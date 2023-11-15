import { IQuery } from '@nestjs/cqrs';

export class CheckNicknameAvailabilityQuery implements IQuery {
  constructor(public readonly nickname: string) {}
}
