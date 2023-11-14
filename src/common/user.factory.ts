import { Injectable } from '@nestjs/common';

import { UserRole } from 'src/common/user-role.enum';
import { UserStatus } from 'src/common/user-status.enum';
import { User } from './user';

@Injectable()
export class UserFactory {
  create(seq: bigint, nickname: string, email: string, status: UserStatus, role: UserRole): User {
    const user = new User(seq, nickname, email, status, role);

    return user;
  }

  reconstitute(
    seq: bigint,
    nickname: string,
    email: string,
    status: UserStatus,
    role: UserRole,
  ): User {
    return new User(seq, nickname, email, status, role);
  }
}
