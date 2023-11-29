import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupType } from 'src/auth/domain/model/signup-type.enum';
import { UserAuth } from 'src/auth/domain/model/user-auth';
import { IAuthRepository } from 'src/auth/domain/repository/iauth.repository';
import { Repository } from 'typeorm';
import { AuthEntity } from '../entity/auth.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@InjectRepository(AuthEntity) private authRepository: Repository<AuthEntity>) {}

  async findByEmail(email: string): Promise<UserAuth | null> {
    const authEntities = await this.authRepository.find({
      where: { userId: email },
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const authEntity = authEntities[0];

    if (authEntity == null) {
      return null;
    }

    const { seq, signupType, userId, password, salt, userSeq, createdAt, updatedAt } = authEntity;

    return new UserAuth(seq, signupType, userId, password, salt, userSeq, createdAt, updatedAt);
  }

  async create(
    userSeq: bigint,
    signupType: SignupType,
    userId: string,
    password: string,
    salt: string,
  ): Promise<void> {
    const auth = new AuthEntity();
    auth.userSeq = userSeq;
    auth.signupType = signupType;
    auth.userId = userId;
    auth.password = password;
    auth.salt = salt;

    await this.authRepository.save(auth);
  }
}
