import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from './jwt.service';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenRepository } from './refresh-token.repository';

const repositories = [{ provide: 'RefreshTokenRepository', useClass: RefreshTokenRepository }];

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [JwtService, ...repositories],
  exports: [JwtService, ...repositories],
})
export class JwtModule {}
