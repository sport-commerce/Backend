import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { UserFactory } from 'src/common/user.factory';
import { EmailService } from 'src/email/email.service';
import { UserEntity } from '../common/infra/db/entity/user.entity';
import { SignupCommandHandler } from './application/command/signup.handler';
import { VerifyEmailHandler } from './application/command/verify-email.handler';
import { AuthEntity } from './infra/db/entity/auth.entity';
import { EmailVerificationEntity } from './infra/db/entity/email-verification.entity';
import { AuthRepository } from './infra/db/repository/AuthRepository';
import { EmailVerificationRepository } from './infra/db/repository/EmailVerificationRepository';
import { TransactionManager } from './infra/db/repository/TransactionManager';
import { UserRepository } from './infra/db/repository/UserRepository';
import { AuthController } from './interface/auth.controller';

const factories = [UserFactory];

const repositories = [
  { provide: 'TransactionManager', useClass: TransactionManager },
  { provide: 'UserRepository', useClass: UserRepository },
  { provide: 'AuthRepository', useClass: AuthRepository },
  { provide: 'EmailVerificationRepository', useClass: EmailVerificationRepository },
  { provide: 'EmailService', useClass: EmailService },
];

const commandHandlers = [SignupCommandHandler, VerifyEmailHandler];

const queryHandlers = [];

const eventHandlers = [];

@Module({
  imports: [
    CommonModule,
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, AuthEntity, EmailVerificationEntity]),
  ],
  controllers: [AuthController],
  providers: [...commandHandlers, ...eventHandlers, ...factories, ...repositories],
  exports: [...factories, ...repositories],
})
export class AuthModule {}
