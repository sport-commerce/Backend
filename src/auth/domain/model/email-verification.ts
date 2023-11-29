import { EmailVerificationContentType } from './email-verification-content-type.enum';
import { EmailVerificationStatus } from './email-verification-status.enum';

export class EmailVerification {
  constructor(
    private readonly seq: bigint,
    private readonly receiptEmail: string,
    private readonly contentType: EmailVerificationContentType,
    private readonly token: string,
    private status: EmailVerificationStatus,
    private readonly expireAt: Date,
    private readonly userSeq: bigint,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.updateStatusIfNeeded();
  }

  getStatus(): EmailVerificationStatus {
    return this.status;
  }

  private updateStatusIfNeeded(): Readonly<void> {
    const currentTime = new Date();
    if (currentTime > this.expireAt) {
      this.status = EmailVerificationStatus.EXPIRED;
    }
  }

  getSeq(): Readonly<bigint> {
    return this.seq;
  }

  getReceiptEmail(): Readonly<string> {
    return this.receiptEmail;
  }

  getContentType(): Readonly<EmailVerificationContentType> {
    return this.contentType;
  }

  getToken(): Readonly<string> {
    return this.token;
  }

  getExpireAt(): Readonly<Date> {
    return this.expireAt;
  }

  getUserSeq(): Readonly<bigint> {
    return this.userSeq;
  }

  isPreVerificationStatus(): boolean {
    return this.status === EmailVerificationStatus.PRE_VERIFICATIED;
  }

  check(): number {
    this.updateStatusIfNeeded();
    if (!this.isPreVerificationStatus()) {
      return 0;
    }
    this.status = EmailVerificationStatus.VERIFIED;
    return 1;
  }
}
