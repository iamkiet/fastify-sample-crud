import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginRequest, loginSchema, RefreshTokenRequest, RegisterRequest, registerSchema } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { successResponse, errorResponse } from '@/utils/response.util';
import { IdentityProvider } from '@repo/shared';

export class AuthController {
  async register(
    request: FastifyRequest< { Body: RegisterRequest } >,
    reply: FastifyReply
  ) {
    try {
      const requestBody = registerSchema.parse(request.body);
      const identityProvider = IdentityProvider.GOOGLE
      const result = await authService.register({identityProvider, ...requestBody});
      return successResponse(reply, result, 'User registered successfully', 201);
    } catch (error: any) {
      request.log.error(error);
      if (error.code === '23505') {
        return errorResponse(reply, 'Email already exists', 409);
      }
      return errorResponse(reply, 'Registration failed', 500);
    }
  }

  async login(
    request: FastifyRequest<{ Body: LoginRequest } >,
    reply: FastifyReply
  ) {
    try {
      const requestBody = loginSchema.parse(request.body);
      const result = await authService.login(requestBody);
      if (!result) {
        return errorResponse(reply, 'Invalid credentials', 401);
      }
      
      // Set refresh token as httpOnly cookie
      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(reply, {
        accessToken: result.accessToken,
        user: result.user
      }, 'Login successful');
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, 'Login failed', 500);
    }
  }

  async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenRequest }>,
    reply: FastifyReply
  ) {
    try {
      const refreshToken = request.body.refreshToken || request.cookies.refreshToken;
      if (!refreshToken) {
        return errorResponse(reply, 'Refresh token required', 400);
      }

      const result = await authService.refreshToken(refreshToken);
      if (!result) {
        return errorResponse(reply, 'Invalid refresh token', 401);
      }

      return successResponse(reply, result, 'Token refreshed successfully');
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, 'Token refresh failed', 500);
    }
  }

  async logout(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      reply.clearCookie('refreshToken');
      return successResponse(reply, null, 'Logout successful');
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, 'Logout failed', 500);
    }
  }

  async me(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const user = request.user;
      return successResponse(reply, user);
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, 'Failed to get user profile', 500);
    }
  }
}

export const authController = new AuthController();