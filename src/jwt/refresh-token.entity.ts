import { DurationParser } from 'src/util/duration-parser';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('refresh_token')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, name: 'seq' })
  seq: number;

  @Column({ length: 255, unique: true, name: 'token_uuid' })
  tokenUuid: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean = true;

  @Column({ name: 'user_agent', length: 255 })
  userAgent: string;

  @Column({ name: 'ip_address', length: 255 })
  ipAddress: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'datetime', name: 'expire_at' })
  expireAt: Date;

  @Column({ type: 'bigint', unsigned: true, name: 'user_seq' })
  userSeq: bigint;

  constructor(tokenUuid: string, userAgent: string, ipAddress: string, userSeq: bigint) {
    this.tokenUuid = tokenUuid;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.userSeq = userSeq;
    this.setExpireAtFromEnv();
  }

  setExpireAtFromEnv() {
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    if (expiresIn) {
      const expiresInMilliSeconds = DurationParser.parseDuration(expiresIn);
      this.expireAt = new Date(Date.now() + expiresInMilliSeconds);
    }
  }

  isValid(): boolean {
    return this.isActive && this.expireAt && this.expireAt > new Date();
  }
}
