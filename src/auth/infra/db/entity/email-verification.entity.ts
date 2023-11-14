import { EmailVerificationContentType } from 'src/auth/domain/email-verification-content-type.enum';
import { EmailVerificationStatus } from 'src/auth/domain/email-verification-status.enum';
import { UserEntity } from 'src/common/infra/db/entity/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'email_verification' })
export class EmailVerificationEntity {
  @PrimaryGeneratedColumn()
  seq: bigint;

  @Column({ name: 'receipt_email', length: 255 })
  receiptEmail: string;

  @Column({
    name: 'content_type',
    length: 25,
    comment: 'SIGNUP,PASSWORD_RESET',
  })
  contentType: EmailVerificationContentType;

  @Column({ length: 255, unique: true })
  token: string;

  @Column({
    name: 'status',
    length: 25,
    comment: 'PRE_VERIFICATIED,VERIFIED,EXPIRED',
  })
  status: EmailVerificationStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'expire_at', type: 'datetime', nullable: false })
  expireAt: Date;

  @Column({ name: 'user_seq', type: 'bigint' })
  userSeq: bigint;

  @ManyToOne(() => UserEntity, { lazy: true })
  @JoinColumn({ name: 'user_seq', referencedColumnName: 'seq' })
  user: UserEntity;

  @BeforeInsert()
  private async beforeInsert() {
    this.status = EmailVerificationStatus.PRE_VERIFICATIED;
  }
}
