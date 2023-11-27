import { RefreshTokenEntity } from './refresh-token.entity';

export interface IRefreshTokenRepository {
  createToken(tokenData: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity>;
  findByTokenUuid(tokenUuid: string): Promise<RefreshTokenEntity | undefined>;
  deactivateToken(tokenUuid: string): Promise<void>;
  deactivateUserTokens(userSeq: bigint): Promise<void>;
}
