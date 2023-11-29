import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async createToken(tokenData: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity> {
    const token = this.refreshTokenRepository.create(tokenData);
    await this.refreshTokenRepository.save(token);
    return token;
  }

  async findByTokenUuid(tokenUuid: string): Promise<RefreshTokenEntity | null> {
    return this.refreshTokenRepository.findOne({ where: { tokenUuid: tokenUuid } });
  }

  async deactivateToken(tokenUuid: string): Promise<void> {
    await this.refreshTokenRepository.update({ tokenUuid }, { isActive: false });
  }

  async deactivateUserTokens(userSeq: bigint): Promise<void> {
    await this.refreshTokenRepository.update({ userSeq }, { isActive: false });
  }
}
