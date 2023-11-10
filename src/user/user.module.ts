import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './application/user.service';
import { UserFactory } from './domain/user.factory';
import { UserEntity } from './infra/db/entity/user.entity';
import { UserRepository } from './infra/db/repository/UserRepository';
import { UserController } from './interface/user.controller';

const factories = [UserFactory];

const repositories = [{ provide: 'UserRepository', useClass: UserRepository }];

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, ...factories, ...repositories],
  exports: [...factories, ...repositories],
})
export class UserModule {}