import { EmailVerification } from '../model/email-verification';
import { EmailVerificationContentType } from '../model/email-verification-content-type.enum';

export interface IEmailVerificationRepository {
  existsByToken: (token: string) => Promise<EmailVerification | null>;
  create: (
    receiptEmail: string,
    contentType: EmailVerificationContentType,
    token: string,
    userSeq: bigint,
    expireAt: Date,
  ) => Promise<void>;
  save: (email: EmailVerification) => Promise<void>;
}
