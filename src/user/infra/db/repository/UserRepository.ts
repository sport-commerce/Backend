import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/user/domain/repository/iuser.repository';
import { User } from 'src/user/domain/user';
import { UserFactory } from 'src/user/domain/user.factory';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByEmail(emailAddress: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email: emailAddress }, // email 변수를 emailAddress로 변경
    });
    if (!userEntity) {
      return null;
    }

    const { seq, email, password } = userEntity;

    return this.userFactory.reconstitute(seq, email, password);
  }

  async save(email: string, password: string): Promise<User> {
    const user = new UserEntity();
    user.email = email;
    user.password = password;

    const userEntity = await this.userRepository.save(user);

    return this.userFactory.reconstitute(userEntity.seq, userEntity.email, user.password);
  }
}