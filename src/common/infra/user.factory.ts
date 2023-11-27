import { Injectable } from '@nestjs/common';

import { UserRole } from 'src/common/domain/user-role.enum';
import { UserStatus } from 'src/common/domain/user-status.enum';
import { User } from '../domain/user';

@Injectable()
export class UserFactory {
  create(
    seq: bigint,
    nickname: string,
    email: string,
    status: UserStatus,
    role: UserRole,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    const user = new User(seq, nickname, email, status, role, createdAt, updatedAt);

    return user;
  }

  reconstitute(
    seq: bigint,
    nickname: string,
    email: string,
    status: UserStatus,
    role: UserRole,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(seq, nickname, email, status, role, createdAt, updatedAt);
  }
}
