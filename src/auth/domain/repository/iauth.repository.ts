import { SignupType } from '../model/signup-type.enum';
import { UserAuth } from '../model/user-auth';

export interface IAuthRepository {
  findByEmail: (email: string) => Promise<UserAuth | null>;
  create: (
    userSeq: bigint,
    signupType: SignupType,
    userId: string,
    password: string,
    salt: string,
  ) => Promise<void>;
}
