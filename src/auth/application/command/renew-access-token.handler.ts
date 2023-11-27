import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IJwtService } from '../adapter/jjwt.service';
import { RenewAccessTokenCommand } from './renew-access-token.command';

@Injectable()
@CommandHandler(RenewAccessTokenCommand)
export class RenewAccessTokenCommandHandler implements ICommandHandler<RenewAccessTokenCommand> {
  constructor(@Inject('JwtService') private readonly jwtService: IJwtService) {}

  async execute(command: RenewAccessTokenCommand): Promise<any> {
    const { refreshToken } = command;
    return await this.jwtService.renewAccessToken(refreshToken);
  }
}
