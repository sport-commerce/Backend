import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CheckEmailAvailabilityQuery } from '../application/query/check-email-availability.query';
import { CheckNicknameAvailabilityQuery } from '../application/query/check-nickname-availability.query';

@Controller('users')
export class UserController {
  constructor(private queryBus: QueryBus) {}

  @Get('emails/availability/:email')
  async checkEmailAvailability(@Param('email') email: string): Promise<boolean> {
    return await this.queryBus.execute(new CheckEmailAvailabilityQuery(email));
  }

  @Get('nickname/availability/:nickname')
  async checkNicknameAvailability(@Param('nickname') nickname: string): Promise<boolean> {
    const result = await this.queryBus.execute(new CheckNicknameAvailabilityQuery(nickname));
    return result;
  }
}
