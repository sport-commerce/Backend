import * as bcrypt from 'bcrypt';
import { SignupType } from './signup-type.enum';

export class UserAuth {
  constructor(
    private seq: bigint,
    private signupType: SignupType,
    private userId: string,
    private password: string | null,
    private salt: string | null,
    private userSeq: bigint,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  getUserSeq(): Readonly<bigint> {
    return this.userSeq;
  }

  getSignupType(): Readonly<SignupType> {
    return this.signupType;
  }

  async validatePassword(inputPassword: string): Promise<boolean> {
    if (inputPassword === null) {
      return false;
    }

    const encryptedPassword = await bcrypt.hash(inputPassword, this.salt);
    return bcrypt.compare(encryptedPassword, this.password);
  }

  static async getEncryptPassword(
    password: string,
  ): Promise<{ encryptedPassword: string; salt: string }> {
    const saltRounds = parseInt(process.env.ENCRYPTION_SALT_OR_ROUND);
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return { encryptedPassword, salt };
  }
}
