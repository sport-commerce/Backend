import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IJwtService } from '../adapter/jjwt.service';
import { LogoutAnywhereCommand } from './logout-anywhere.command';

@Injectable()
@CommandHandler(LogoutAnywhereCommand)
export class LogoutAnywhereCommandHandler implements ICommandHandler<LogoutAnywhereCommand> {
  constructor(@Inject('JwtService') private readonly jwtService: IJwtService) {}

  async execute(command: LogoutAnywhereCommand): Promise<any> {
    await this.jwtService.deactivateUserRefreshTokens(command.userSeq);
  }
}
