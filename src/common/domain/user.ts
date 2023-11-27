import { UnprocessableEntityException } from '@nestjs/common';
import { UserRole } from 'src/common/domain/user-role.enum';
import { UserStatus } from 'src/common/domain/user-status.enum';

export class User {
  constructor(
    private seq: bigint,
    private nickname: string,
    private email: string,
    private status: UserStatus,
    private role: UserRole,
    private createdAt: Date,
    private updatedAt: Date,
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

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<Date> {
    return this.updatedAt;
  }

  isPreVerificationStatus(): boolean {
    return this.status === UserStatus.PRE_VERIFICATION;
  }

  checkEmailVerification(): number {
    if (this.isPreVerificationStatus) {
      this.status = UserStatus.ACTIVE;
      return 1;
    }
    return 0;
  }

  public validateUserActiveStatus() {
    switch (this.status) {
      case UserStatus.ACTIVE:
        break;
      case UserStatus.PRE_VERIFICATION:
        throw new UnprocessableEntityException('아직 이메일 인증이 완료되지 않았습니다.');
      case UserStatus.INACTIVE:
        throw new UnprocessableEntityException('계정이 비활성 상태입니다.');
      case UserStatus.SUSPENDED:
        throw new UnprocessableEntityException('계정이 정지된 상태입니다.');
      case UserStatus.DELETED:
        throw new UnprocessableEntityException('계정이 삭제되었습니다.');
      default:
        throw new UnprocessableEntityException('알 수 없는 계정 상태입니다.');
    }
  }
}
