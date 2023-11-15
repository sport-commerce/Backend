import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/auth/domain/repository/iuser.repository';
import { User } from 'src/common/user';
import { UserStatus } from 'src/common/user-status.enum';
import { UserFactory } from 'src/common/user.factory';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../common/infra/db/entity/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly userFactory: UserFactory,
  ) {}

  async findBySeq(seq: bigint): Promise<User> {
    const userEntity = await this.userRepository.findOneBy({ seq });

    const { nickname, email, status, role } = userEntity;
    return this.userFactory.reconstitute(seq, nickname, email, status, role);
  }

  async existByEmail(email: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { email: email } });
  }

  async existByNickname(nickname: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { nickname: nickname } });
  }

  async create(email: string, nickname: string): Promise<bigint> {
    const user = new UserEntity();
    user.email = email;
    user.nickname = nickname;

    const newUser = await this.userRepository.save(user);
    return newUser.seq;
  }

  async save(user: User): Promise<void> {
    const userEntity = new UserEntity();
    userEntity.seq = user.getSeq();
    userEntity.nickname = user.getNickname();
    userEntity.email = user.getEmail();
    userEntity.role = user.getRole();
    userEntity.status = user.getStatus();

    await this.userRepository.save(userEntity);
  }

  async updateStatus(seq: bigint, status: UserStatus): Promise<void> {
    await this.userRepository.update({ seq: seq }, { status: status });
  }
}
