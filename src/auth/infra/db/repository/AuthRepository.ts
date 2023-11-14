import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthRepository } from 'src/auth/domain/repository/iauth.repository';
import { SignupType } from 'src/auth/domain/signup-type.enum';
import { Repository } from 'typeorm';
import { AuthEntity } from '../entity/auth.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@InjectRepository(AuthEntity) private authRepository: Repository<AuthEntity>) {}

  async create(
    userSeq: bigint,
    signupType: SignupType,
    userId: string,
    password: string,
  ): Promise<void> {
    const auth = new AuthEntity();
    auth.userSeq = userSeq;
    auth.signupType = signupType;
    auth.userId = userId;
    auth.password = password;

    await this.authRepository.save(auth);
  }
}
