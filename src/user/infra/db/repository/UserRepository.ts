import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/infra/db/entity/user.entity';
import { UserFactory } from 'src/common/user.factory';
import { IUserRepository } from 'src/user/domain/repository/iuser.repository';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async existByEmail(email: string): Promise<boolean> {
    const userEntity = await this.userRepository.findOne({
      where: { email: email },
    });

    return !!userEntity;
  }

  async existByNickname(nickname: string): Promise<boolean> {
    const userEntity = await this.userRepository.findOne({
      where: { nickname: nickname },
    });

    return !!userEntity;
  }

  async save(email: string, nickname: string): Promise<bigint> {
    const user = new UserEntity();
    user.email = email;
    user.nickname = nickname;

    const newUser = await this.userRepository.save(user);
    return newUser.seq;
  }
}
