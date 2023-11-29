import { SignupType } from 'src/auth/domain/model/signup-type.enum';
import { UserRole } from 'src/common/domain/user-role.enum';

export interface JwtPayload {
  userSeq: bigint;
  signupType: SignupType;
  userRole: UserRole;
  jti?: string;
  iss?: string;
  aud?: string;
}
