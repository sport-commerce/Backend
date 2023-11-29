import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailVerificationContentType } from 'src/auth/domain/model/email-verification-content-type.enum';
import { SignupType } from 'src/auth/domain/model/signup-type.enum';
import { UserAuth } from 'src/auth/domain/model/user-auth';
import { IAuthRepository } from 'src/auth/domain/repository/iauth.repository';
import { IEmailVerificationRepository } from 'src/auth/domain/repository/iemail-verification.repository';
import { ITransactionManager } from 'src/auth/domain/repository/itransaction-manager';
import { IUserRepository } from 'src/auth/domain/repository/iuser.repository';
import { UserFactory } from 'src/common/infra/user.factory';
import { EMAIL_VERIFICATION_EXPIRY_MINUTES } from 'src/constant';
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

    const isEmailExist = await this.userRepository.existByEmail(email);
    if (isEmailExist) {
      throw new UnprocessableEntityException(
        'This email address is already registered. Please use a different email address.',
      );
    }

    const isNicknameExist = await this.userRepository.existByNickname(nickname);
    if (isNicknameExist) {
      throw new UnprocessableEntityException(
        'This nickname is already registered. Please use a different nickname.',
      );
    }

    const { encryptedPassword, salt } = await UserAuth.getEncryptPassword(password);

    const signupVerifyToken = uuidv4();
    const expireDate = new Date(new Date().getTime() + EMAIL_VERIFICATION_EXPIRY_MINUTES * 60000);

    await this.transactionManager.transaction(async () => {
      const newUserSeq = await this.userRepository.create(email, nickname);
      await this.authRepository.create(
        newUserSeq,
        SignupType.EMAIL,
        email,
        encryptedPassword,
        salt,
      );
      await this.emailVerificationRepository.create(
        email,
        EmailVerificationContentType.SIGNUP,
        signupVerifyToken,
        newUserSeq,
        expireDate,
      );
    });

    this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
