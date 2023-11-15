import { IQuery } from '@nestjs/cqrs';

export class CheckEmailAvailabilityQuery implements IQuery {
  constructor(public readonly email: string) {}
}
