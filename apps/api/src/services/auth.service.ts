import { userService } from './user.service';
import { LoginCredentials, AuthResponse } from '@/types/auth.types';
import { CreateUser } from '@repo/shared';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt.util';

export class AuthService {
  async register(userData: CreateUser): Promise<AuthResponse> {
    const user = await userService.createUser(userData);
    const tokens = await generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    const user = await userService.getUserByEmail(credentials.email);
    if (!user) {
      return null;
    }

    const isValidPassword = await user.validatePassword(credentials.password);
    if (!isValidPassword) {
      return null;
    }

    const tokens = await generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string } | null> {
    try {
      const payload = await verifyRefreshToken(refreshToken);
      const user = await userService.getUserById(payload.userId);
      
      if (!user) {
        return null;
      }

      const tokens = await generateTokens({
        userId: user.id,
        email: user.email,
      });

      return {
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();