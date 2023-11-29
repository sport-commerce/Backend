import { SignupType } from 'src/auth/domain/model/signup-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  seq: bigint;

  @Column({ name: 'user_seq', type: 'bigint' })
  userSeq: bigint;

  @Column({
    name: 'signup_type',
    type: 'enum',
    enum: SignupType,
    comment: 'EMAIL,NAVER,KAKAO,GOOGLE',
  })
  signupType: SignupType;

  @Column({
    name: 'user_id',
    length: 255,
    comment: '1. Email Login - email, 2. Social Login - Social id',
  })
  userId: string;

  @Column({ length: 255 })
  password: string | null;

  @Column({ length: 255, nullable: true })
  salt: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
