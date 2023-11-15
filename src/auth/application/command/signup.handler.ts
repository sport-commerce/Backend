import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { EmailVerificationContentType } from 'src/auth/domain/email-verification-content-type.enum';
import { IAuthRepository } from 'src/auth/domain/repository/iauth.repository';
import { IEmailVerificationRepository } from 'src/auth/domain/repository/iemail-verification.repository';
import { ITransactionManager } from 'src/auth/domain/repository/itransaction-manager';
import { IUserRepository } from 'src/auth/domain/repository/iuser.repository';
import { SignupType } from 'src/auth/domain/signup-type.enum';
import { EMAIL_VERIFICATION_EXPIRY_MINUTES } from 'src/common/constant';
import { UserFactory } from 'src/common/user.factory';
import { v4 as uuidv4 } from 'uuid';
import { IEmailService } from '../adapter/iemail.serivce';
import { SignupCommand } from './signup.command';

@Injectable()
@CommandHandler(SignupCommand)
export class SignupCommandHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private readonly userFactory: UserFactory,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('AuthRepository') private readonly authRepository: IAuthRepository,
    @Inject('EmailVerificationRepository')
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    @Inject('EmailService') private readonly emailService: IEmailService,
    @Inject('TransactionManager') private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(command: SignupCommand) {
    const { email, nickname, password } = command;

    const signupVerifyToken = await this.transactionManager.transaction(async () => {
      const userSeq = await this.registerUser(email, nickname, password);
      return await this.createEmailVerification(email, userSeq);
    });

    this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  private async registerUser(email: string, nickname: string, password: string): Promise<bigint> {
    const isEmailExist = await this.userRepository.existByEmail(email);
    if (isEmailExist) {
      throw new UnprocessableEntityException(
        '이미 등록된 이메일 주소입니다. 다른 이메일 주소를 사용해주세요.',
      );
    }

    const isNicknameExist = await this.userRepository.existByNickname(nickname);
    if (isNicknameExist) {
      throw new UnprocessableEntityException(
        '이미 등록된 닉네임입니다. 다른 닉네임을 사용해주세요.',
      );
    }

    const saltRounds = parseInt(process.env.ENCRYPTION_SALT_OR_ROUND);
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUserSeq = await this.userRepository.create(email, nickname);
    await this.authRepository.create(newUserSeq, SignupType.EMAIL, email, encryptedPassword);

    return newUserSeq;
  }

  private async createEmailVerification(email: string, newUserSeq: bigint): Promise<string> {
    const signupVerifyToken = uuidv4();
    const expireDate = new Date(new Date().getTime() + EMAIL_VERIFICATION_EXPIRY_MINUTES * 60000);
    await this.emailVerificationRepository.create(
      email,
      EmailVerificationContentType.SIGNUP,
      signupVerifyToken,
      newUserSeq,
      expireDate,
    );
    return signupVerifyToken;
  }
}
