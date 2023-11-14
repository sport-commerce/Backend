import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserHandler } from './application/command/create-user.handler';
import { UserEventsHandler } from './application/event/user-events.handler';
import { UserFactory } from './domain/user.factory';
import { UserEntity } from './infra/db/entity/user.entity';
import { UserRepository } from './infra/db/repository/UserRepository';
import { UserController } from './interface/user.controller';

const factories = [UserFactory];

const repositories = [{ provide: 'UserRepository', useClass: UserRepository }];

const commandHandlers = [CreateUserHandler];

const queryHandlers = [];

const eventHandlers = [UserEventsHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [...commandHandlers, ...eventHandlers, ...factories, ...repositories],
  exports: [...factories, ...repositories],
})
export class UserModule {}