import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  seq: bigint;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;
}