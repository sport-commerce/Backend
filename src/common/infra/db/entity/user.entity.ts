import { UserRole } from 'src/common/user-role.enum';
import { UserStatus } from 'src/common/user-status.enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  seq: bigint;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PRE_VERIFICATION,
    comment: 'PRE_VERIFICATION,ACTIVE,INACTIVE,SUSPENDED,DELETED',
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    comment: 'USER,ADMIN',
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  private async beforeInsert() {
    this.status = UserStatus.PRE_VERIFICATION;
    this.role = UserRole.USER;
  }
}
