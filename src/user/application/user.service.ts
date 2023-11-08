import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { IUserRepository } from '../domain/repository/iuser.repository';
import { UserFactory } from '../domain/user.factory';

@Injectable()
export class UserService {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async createUser(email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException('이미 등록된 이메일 주소입니다.');
    }

    await this.userRepository.save(email, password);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(emailAddress);
    if (user !== null) {
      throw new UnprocessableEntityException('이미 등록된 이메일 주소입니다.');
    }
    return false;
  }
}
