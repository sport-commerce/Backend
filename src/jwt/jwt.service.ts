import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { FileLoader } from 'src/util/file-loader';
import { v4 as uuidv4 } from 'uuid';
import { IRefreshTokenRepository } from './irefresh-token.repository';
import { JwtPayload } from './jwt.payload';
import { RefreshTokenEntity } from './refresh-token.entity';

@Injectable()
export class JwtService {
  private readonly accessTokenOptions: jwt.SignOptions;
  private readonly refreshTokenOptions: jwt.SignOptions;
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly issuer: string;
  private readonly algorithm: jwt.Algorithm;

  constructor(
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {
    this.accessTokenOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: (this.algorithm = process.env.JWT_ALGORITHM as jwt.Algorithm),
    };
    this.refreshTokenOptions = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      algorithm: this.algorithm,
    };
    this.privateKey = FileLoader.loadFileAsString(process.env.JWT_PRIVATE_KEY_PATH);
    this.publicKey = FileLoader.loadFileAsString(process.env.JWT_PUBLIC_KEY_PATH);
    this.issuer = process.env.JWT_ISSUER;
  }

  generateToken(payload: JwtPayload): string {
    const tokenPayload = this.createTokenPayload(payload, this.accessTokenOptions);
    return this.signToken(tokenPayload, this.accessTokenOptions);
  }

  async generateRefreshToken(
    payload: JwtPayload,
    userAgent: string,
    ipAddress: string,
  ): Promise<string> {
    const refreshTokenPayload = this.createTokenPayload(payload, this.refreshTokenOptions);
    const refreshToken = this.signToken(refreshTokenPayload, this.refreshTokenOptions);
    const refreshTokenEntity = new RefreshTokenEntity(
      refreshTokenPayload.jti,
      userAgent,
      ipAddress,
      payload.userSeq,
    );
    try {
      await this.refreshTokenRepository.createToken(refreshTokenEntity);
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        throw new ConflictException('Duplicate tokenUuid');
      }
      throw error;
    }
    return refreshToken;
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: [this.algorithm],
      }) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('JWT 토큰 검증 실패: ' + error.message);
    }
  }

  async renewAccessToken(refreshToken: string): Promise<string> {
    try {
      const refreshTokenPayload = this.verifyToken(refreshToken);
      const jti = refreshTokenPayload.jti;
      await this.getValidRefreshToken(jti);

      const newAccessTokenPayload = this.createNewAccessTokenPayload(refreshTokenPayload);
      const newAccessToken = this.generateToken(newAccessTokenPayload);

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('액세스 토큰 갱신 실패', error.message);
    }
  }

  private async getValidRefreshToken(jti: string): Promise<void> {
    const refreshTokenEntity = await this.refreshTokenRepository.findByTokenUuid(jti);

    if (!refreshTokenEntity || !refreshTokenEntity.isValid()) {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }
  }

  private createNewAccessTokenPayload(refreshTokenPayload: JwtPayload): JwtPayload {
    return {
      userSeq: refreshTokenPayload.userSeq,
      signupType: refreshTokenPayload.signupType,
      userRole: refreshTokenPayload.userRole,
      jti: uuidv4(),
    };
  }

  async deactivateRefreshToken(refreshToken: string): Promise<void> {
    const refreshTokenPayload = this.verifyToken(refreshToken);
    const tokenUuid = refreshTokenPayload.jti;
    await this.refreshTokenRepository.deactivateToken(tokenUuid);
  }

  async deactivateUserRefreshTokens(userSeq: bigint): Promise<void> {
    await this.refreshTokenRepository.deactivateUserTokens(userSeq);
  }

  private createTokenPayload(payload: JwtPayload, options: jwt.SignOptions): JwtPayload {
    return {
      ...payload,
      jti: uuidv4(),
      iss: this.issuer,
    };
  }

  private signToken(tokenPayload: JwtPayload, options: jwt.SignOptions): string {
    return jwt.sign(tokenPayload, this.privateKey, options);
  }
}
