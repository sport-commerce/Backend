import { User } from 'src/common/domain/user';

export interface IUserRepository {
  existByEmail: (email: string) => Promise<boolean>;
  existByNickname: (nickname: string) => Promise<boolean>;
  findBySeq: (seq: bigint) => Promise<User>;
}
