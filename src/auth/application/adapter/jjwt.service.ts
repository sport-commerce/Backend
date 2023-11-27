import { JwtPayload } from 'src/jwt/jwt.payload';

export interface IJwtService {
  generateToken: (payload: JwtPayload) => string;

  generateRefreshToken: (
    payload: JwtPayload,
    userAgent: string,
    ipAddress: string,
  ) => Promise<string>;

  verifyToken: (token: string) => JwtPayload;

  renewAccessToken: (refreshToken: string) => Promise<string>;

  deactivateRefreshToken: (refreshToken: string) => Promise<void>;

  deactivateUserRefreshTokens: (userSeq: bigint) => Promise<void>;
}

