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

  @Column({ name: 'signup_type', length: 25, comment: 'EMAIL,NAVER,KAKAO,GOOGLE' })
  signupType: string;

  @Column({
    name: 'user_id',
    length: 255,
    comment: '1. Email Login - email, 2. Social Login - Access Token',
  })
  userId: string;

  @Column({ length: 255 })
  password: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
