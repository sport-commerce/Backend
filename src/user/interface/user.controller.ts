import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/security/auth.guard';
import { UserSeq } from 'src/common/security/user-seq';
import { UserService } from '../user.service';
import { UserInfoDto } from './dto/res/user-info.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('emails/availability/:email')
  async checkEmailAvailability(@Param('email') email: string): Promise<boolean> {
    return await this.userService.checkEmailAvailability(email);
  }

  @Get('nickname/availability/:nickname')
  async checkNicknameAvailability(@Param('nickname') nickname: string): Promise<boolean> {
    return await this.userService.checkNicknameAvailability(nickname);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getUser(@Headers() headers: any, @UserSeq() userSeq: bigint): Promise<UserInfoDto> {
    return await this.userService.getUserInfo(userSeq);
  }
}
