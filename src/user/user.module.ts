import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/infra/db/entity/user.entity';
import { UserFactory } from 'src/common/user.factory';
import { CheckEmailAvailabilityQueryHandler } from './application/query/check-email-availability.handler';
import { CheckNicknamevailabilityQueryHandler } from './application/query/check-nickname-availability.handler';
import { UserRepository } from './infra/db/repository/UserRepository';
import { UserController } from './interface/user.controller';

const factories = [UserFactory];

const repositories = [{ provide: 'UserRepository', useClass: UserRepository }];

const commandHandlers = [];

const queryHandlers = [CheckEmailAvailabilityQueryHandler, CheckNicknamevailabilityQueryHandler];

const eventHandlers = [];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [...commandHandlers, ...queryHandlers, ...factories, ...repositories],
  exports: [...factories, ...repositories],
})
export class UserModule {}
