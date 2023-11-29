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
export class VerifyEmailCommandHandler implements ICommandHandler<VerifyEmailCommand> {
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
      throw new BadRequestException('Invalid token.');
    }

    const userSeq = emailVerification.getUserSeq();
    const user = await this.userRepository.findBySeq(userSeq);
    if (!user) {
      throw new Error('User not found');
    }

    if (!emailVerification.isPreVerificationStatus()) {
      throw new UnprocessableEntityException('Already verified token.');
    }

    const userVerificationSucceeded = user.checkEmailVerification();
    const emailVerificationSucceeded = emailVerification.check();

    if (!userVerificationSucceeded || !emailVerificationSucceeded) {
      throw new Error('Unexpected verification status.');
    }

    await this.transactionManager.transaction(async () => {
      await this.emailVerificationRepository.save(emailVerification);
      await this.userRepository.save(user);
    });
  }
}
