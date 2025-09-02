import jwt from 'jsonwebtoken';
import { config } from '@/config/environment';
import { JwtPayload, AuthTokens } from '@/types/auth.types';

export async function generateTokens(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<AuthTokens> {
  const accessToken = jwt.sign(payload, Buffer.from(config.JWT_SECRET), {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, Buffer.from(config.JWT_SECRET), {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  return jwt.verify(token, Buffer.from(config.JWT_SECRET)) as JwtPayload;
}

export async function verifyRefreshToken(token: string): Promise<JwtPayload> {
  return jwt.verify(token, Buffer.from(config.JWT_SECRET)) as JwtPayload;
}