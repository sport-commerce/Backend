import 'dotenv/config';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || '300',
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || '1200',
  10
);

export const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
export const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

export const createToken = (
  userData: { id: string; email: string },
  res: Response
) => {
  const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN || '', {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN || '', {
    expiresIn: '3d',
  });

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);

  return { accessToken };
};
