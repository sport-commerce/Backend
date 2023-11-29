import { User } from 'src/common/domain/user';

export class UserInfoDto {
  private readonly nickname: string;
  private readonly email: string;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(nickname: string, email: string, createdAt: Date, updatedAt: Date) {
    this.nickname = nickname;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static of(user: User): UserInfoDto {
    return new UserInfoDto(
      user.getNickname(),
      user.getEmail(),
      user.getCreatedAt(),
      user.getUpdatedAt(),
    );
  }
}
