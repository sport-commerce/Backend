import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { EmailService } from 'src/email/email.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UserEntity } from '../common/infra/db/entity/user.entity';
import { LoginCommandHandler } from './application/command/login.handler';
import { LogoutAnywhereCommandHandler } from './application/command/logout-anywhere.handler';
import { RenewAccessTokenCommandHandler } from './application/command/renew-access-token.handler';
import { SignupCommandHandler } from './application/command/signup.handler';
import { VerifyEmailCommandHandler } from './application/command/verify-email.handler';
import { AuthEntity } from './infra/db/entity/auth.entity';
import { EmailVerificationEntity } from './infra/db/entity/email-verification.entity';
import { AuthRepository } from './infra/db/repository/AuthRepository';
import { EmailVerificationRepository } from './infra/db/repository/EmailVerificationRepository';
import { TransactionManager } from './infra/db/repository/TransactionManager';
import { UserRepository } from './infra/db/repository/UserRepository';
import { AuthController } from './interface/auth.controller';

const repositories = [
  { provide: 'TransactionManager', useClass: TransactionManager },
  { provide: 'UserRepository', useClass: UserRepository },
  { provide: 'AuthRepository', useClass: AuthRepository },
  { provide: 'EmailVerificationRepository', useClass: EmailVerificationRepository },
  { provide: 'EmailService', useClass: EmailService },
  { provide: 'JwtService', useClass: JwtService },
];

const commandHandlers = [
  SignupCommandHandler,
  VerifyEmailCommandHandler,
  LoginCommandHandler,
  RenewAccessTokenCommandHandler,
  LogoutAnywhereCommandHandler,
];

@Module({
  imports: [
    CommonModule,
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, AuthEntity, EmailVerificationEntity]),
  ],
  controllers: [AuthController],
  providers: [...commandHandlers, ...repositories],
})
export class AuthModule {}
