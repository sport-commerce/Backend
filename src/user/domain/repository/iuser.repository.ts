
export interface IUserRepository {
  existByEmail: (email: string) => Promise<boolean>;
  existByNickname: (nickname: string) => Promise<boolean>;
}
