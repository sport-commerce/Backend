import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { UserEntity } from 'src/common/infra/db/entity/user.entity';
import { UserController } from './interface/user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
const repositories = [{ provide: 'UserRepository', useClass: UserRepository }];

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [...repositories, UserService],
  exports: [...repositories],
})
export class UserModule {}
