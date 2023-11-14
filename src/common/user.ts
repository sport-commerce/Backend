import { UserRole } from 'src/common/user-role.enum';
import { UserStatus } from 'src/common/user-status.enum';

export class User {
  constructor(
    private seq: bigint,
    private nickname: string,
    private email: string,
    private status: UserStatus,
    private role: UserRole,
  ) {}

  getSeq(): Readonly<bigint> {
    return this.seq;
  }

  getNickname(): Readonly<string> {
    return this.nickname;
  }

  getEmail(): Readonly<string> {
    return this.email;
  }

  getStatus(): Readonly<UserStatus> {
    return this.status;
  }

  getRole(): Readonly<UserRole> {
    return this.role;
  }

  isPreVerificationStatue(): boolean {
    return this.status === UserStatus.PRE_VERIFICATION;
  }

  checkEmailVerification(): number {
    if (this.isPreVerificationStatue) {
      this.status = UserStatus.ACTIVE;
      return 1;
    }
    return 0;
  }
}
