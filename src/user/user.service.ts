import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserInfoDto } from 'src/user/interface/dto/res/user-info.dto';
import { IUserRepository } from 'src/user/iuser.repository';

@Injectable()
export class UserService {
  constructor(@Inject('UserRepository') private readonly userRepository: IUserRepository) {}

  async checkEmailAvailability(email: string): Promise<boolean> {
    if (await this.userRepository.existByEmail(email)) {
      throw false;
    }
    return true;
  }

  async checkNicknameAvailability(nickname: string): Promise<boolean> {
    if (await this.userRepository.existByNickname(nickname)) {
      throw false;
    }
    return true;
  }

  async getUserInfo(seq: bigint): Promise<UserInfoDto> {
    const user = await this.userRepository.findBySeq(seq);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return UserInfoDto.of(user);
  }
}
