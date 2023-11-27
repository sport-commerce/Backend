import { Module } from '@nestjs/common';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserFactory } from './infra/user.factory';
import { AuthGuard } from './security/auth.guard';

@Module({
  imports: [JwtModule],
  controllers: [],
  providers: [AuthGuard, UserFactory],
  exports: [JwtModule, AuthGuard, UserFactory],
})
export class CommonModule {}
