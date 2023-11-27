import { UserStatus } from 'src/common/domain/user-status.enum';
import { User } from '../../../common/domain/user';

export interface IUserRepository {
  findBySeq: (seq: bigint) => Promise<User>;
  existByEmail: (email: string) => Promise<boolean>;
  existByNickname: (nickname: string) => Promise<boolean>;
  create: (email: string, nickname: string) => Promise<bigint>;
  save: (user: User) => Promise<void>;
  updateStatus: (seq: bigint, status: UserStatus) => Promise<void>;
}
