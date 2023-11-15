import { EmailVerificationContentType } from "./email-verification-content-type.enum";
import { EmailVerificationStatus } from "./email-verification-status.enum";

export class EmailVerification {
  constructor(
    private seq: bigint,
    private receiptEmail: string,
    private contentType: EmailVerificationContentType,
    private token: string,
    private status: EmailVerificationStatus,
    private expireAt: Date,
    private userSeq: bigint,
  ) { }

  getStatus(): EmailVerificationStatus {
    this.updateStatusIfNeeded();
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

  isPreVerificationStatue(): boolean {
    return this.status === EmailVerificationStatus.PRE_VERIFICATIED;
  }

  check(): number {
    if (this.isPreVerificationStatue) {
      this.status = EmailVerificationStatus.VERIFIED;
      return 1;
    }
    return 0;
  } 
}