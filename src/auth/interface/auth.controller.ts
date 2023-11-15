import { Body, Controller, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignupCommand } from '../application/command/signup.command';
import { VerifyEmailCommand } from '../application/command/verify-email.command';
import { SignupDto } from './dto/req/signup.dto';
import { VerifyEmailDto } from './dto/req/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<void> {
    const { email, nickname, password } = dto;

    const command = new SignupCommand(email, nickname, password);

    await this.commandBus.execute(command);
  }

  @Post('email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    const command = new VerifyEmailCommand(signupVerifyToken);

    return this.commandBus.execute(command);
  }
}
