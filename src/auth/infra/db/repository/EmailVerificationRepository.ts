import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from 'src/auth/domain/model/email-verification';
import { EmailVerificationContentType } from 'src/auth/domain/model/email-verification-content-type.enum';
import { IEmailVerificationRepository } from 'src/auth/domain/repository/iemail-verification.repository';
import { Repository } from 'typeorm';
import { EmailVerificationEntity } from '../entity/email-verification.entity';

@Injectable()
export class EmailVerificationRepository implements IEmailVerificationRepository {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private emailVerificationRepository: Repository<EmailVerificationEntity>,
  ) {}

  async existsByToken(token: string): Promise<EmailVerification | null> {
    const emailVerificationEntity = await this.emailVerificationRepository.findOne({
      where: { token: token },
    });
    if (emailVerificationEntity === null) {
      return null;
    }

    const { seq, receiptEmail, contentType, status, expireAt, userSeq, createdAt, updatedAt } =
      emailVerificationEntity;

    return new EmailVerification(
      seq,
      receiptEmail,
      contentType,
      token,
      status,
      expireAt,
      userSeq,
      createdAt,
      updatedAt,
    );
  }

  async create(
    receiptEmail: string,
    contentType: EmailVerificationContentType,
    token: string,
    userSeq: bigint,
    expireAt: Date,
  ): Promise<void> {
    const emailVerification = new EmailVerificationEntity();
    emailVerification.receiptEmail = receiptEmail;
    emailVerification.contentType = contentType;
    emailVerification.token = token;
    emailVerification.userSeq = userSeq;
    emailVerification.expireAt = expireAt;
    await this.emailVerificationRepository.save(emailVerification);
  }

  async save(email: EmailVerification): Promise<void> {
    const emailVerification = new EmailVerificationEntity();
    emailVerification.seq = email.getSeq();
    emailVerification.receiptEmail = email.getReceiptEmail();
    emailVerification.contentType = email.getContentType();
    emailVerification.status = email.getStatus();
    emailVerification.token = email.getToken();
    emailVerification.userSeq = email.getUserSeq();
    emailVerification.expireAt = email.getExpireAt();
    await this.emailVerificationRepository.save(emailVerification);
  }
}
