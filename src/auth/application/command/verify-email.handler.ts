import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IEmailVerificationRepository } from 'src/auth/domain/repository/iemail-verification.repository';
import { ITransactionManager } from 'src/auth/domain/repository/itransaction-manager';
import { IUserRepository } from 'src/auth/domain/repository/iuser.repository';
import { VerifyEmailCommand } from './verify-email.command';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @Inject('EmailVerificationRepository')
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('TransactionManager') private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const { signupVerifyToken } = command;

    const emailVerification =
      await this.emailVerificationRepository.existsByToken(signupVerifyToken);

    if (!emailVerification) {
      throw new BadRequestException('유효하지 않은 토큰입니다.');
    }

    const userSeq = emailVerification.getUserSeq();
    const user = await this.userRepository.findBySeq(userSeq);

    if (!user.isPreVerificationStatue() || !emailVerification.isPreVerificationStatue()) {
      throw new UnprocessableEntityException('이미 인증된 토큰입니다.');
    }

    const emailVerificationResult = user.checkEmailVerification() | emailVerification.check();
    if (emailVerificationResult === 0) {
      throw new Error('이메일 인증에 실패했습니다.');
    }

    await this.transactionManager.transaction(async () => {
      await this.emailVerificationRepository.save(emailVerification);
      await this.userRepository.save(user);
    });

    if (emailVerificationResult === 0) {
      throw new Error('이메일 인증에 실패했습니다.');
    }
  }
}
