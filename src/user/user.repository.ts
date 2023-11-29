import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/domain/user';
import { UserEntity } from 'src/common/infra/db/entity/user.entity';
import { UserFactory } from 'src/common/infra/user.factory';
import { IUserRepository } from 'src/user/iuser.repository';
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

  async findBySeq(seq: bigint): Promise<User> {
    const userEntity = await this.userRepository.findOneBy({ seq });

    const { nickname, email, status, role, createdAt, updatedAt } = userEntity;
    return this.userFactory.reconstitute(seq, nickname, email, status, role, createdAt, updatedAt);
  }
}
