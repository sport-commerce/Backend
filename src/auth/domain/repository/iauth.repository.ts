import { SignupType } from '../signup-type.enum';

export interface IAuthRepository {
  create: (
    userSeq: bigint,
    signupType: SignupType,
    userId: string,
    password: string,
  ) => Promise<void>;
}
