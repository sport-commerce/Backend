import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserFactory {
  create(seq: bigint, email: string, password: string): User {
    const user = new User(seq, email, password);

    return user;
  }

  reconstitute(seq: bigint, email: string, password: string): User {
    return new User(seq, email, password);
  }
}