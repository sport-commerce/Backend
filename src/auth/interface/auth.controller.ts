import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/security/auth.guard';
import { UserSeq } from 'src/common/security/user-seq';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, USER_AGENT_HEADER_NAME } from 'src/constant';
import { DurationParser } from 'src/util/duration-parser';
import { LoginCommand } from '../application/command/login.command';
import { LogoutAnywhereCommand } from '../application/command/logout-anywhere.command';
import { RenewAccessTokenCommand } from '../application/command/renew-access-token.command';
import { SignupCommand } from '../application/command/signup.command';
import { VerifyEmailCommand } from '../application/command/verify-email.command';
import { LoginDto } from './dto/req/login.dto';
import { SignupDto } from './dto/req/signup.dto';
import { VerifyEmailDto } from './dto/req/verify-email.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<void> {
    const command = new SignupCommand(dto.email, dto.nickname, dto.password);
    await this.commandBus.execute(command);
  }

  @Post('email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const command = new VerifyEmailCommand(dto.signupVerifyToken);
    return await this.commandBus.execute(command);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const userAgent = request.headers[USER_AGENT_HEADER_NAME];
    const ipAddress = request.ip;
    const command = new LoginCommand(dto.email, dto.password, userAgent, ipAddress);
    try {
      const { accessToken, refreshToken } = await this.commandBus.execute(command);
      this.setAuthCookie(response, ACCESS_TOKEN_COOKIE, accessToken, process.env.JWT_EXPIRES_IN);
      this.setAuthCookie(
        response,
        REFRESH_TOKEN_COOKIE,
        refreshToken,
        process.env.JWT_REFRESH_EXPIRES_IN,
      );
      response.status(HttpStatus.OK).send();
    } catch (error) {
      response.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }

  @Post('refresh-token')
  async refresh(@Req() request: Request, @Res() response: Response): Promise<void> {
    try {
      const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE];

      if (!refreshToken) {
        throw new Error('Refresh token not found in cookies');
      }

      const newAccessToken = await this.commandBus.execute(
        new RenewAccessTokenCommand(refreshToken),
      );

      this.setAuthCookie(response, ACCESS_TOKEN_COOKIE, newAccessToken, process.env.JWT_EXPIRES_IN);
      response.status(HttpStatus.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Res() response: Response): Promise<void> {
    response.clearCookie(ACCESS_TOKEN_COOKIE);
    response.clearCookie(REFRESH_TOKEN_COOKIE);

    response.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }

  @UseGuards(AuthGuard)
  @Delete('logout-anywhere')
  async logoutAnywhere(@UserSeq() userSeq: bigint, @Res() response: Response): Promise<void> {
    if (!userSeq) {
      response.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid user sequence' });
      return;
    }
    try {
      await this.commandBus.execute(new LogoutAnywhereCommand(userSeq));
      response.status(HttpStatus.OK).json({ message: 'Logged out from all devices successfully' });
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error during total logout' });
    }
  }

  private setAuthCookie(response: Response, name: string, value: string, duration: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      path: '/',
      // domain: process.env.SERVER_DOMAIN,
      // sameSite: 'none' as const,
      maxAge: DurationParser.parseDuration(duration),
    };

    response.cookie(name, value, cookieOptions);
  }
}
