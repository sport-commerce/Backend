import { ICommand } from '@nestjs/cqrs';

export class RenewAccessTokenCommand implements ICommand {
  constructor(readonly refreshToken: string) {}
}
