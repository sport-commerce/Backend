import { ICommand } from '@nestjs/cqrs';

export class LogoutAnywhereCommand implements ICommand {
  constructor(readonly userSeq: bigint) {}
}
