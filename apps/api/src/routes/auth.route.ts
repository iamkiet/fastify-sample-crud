import { FastifyInstance } from "fastify";
import { authController } from "@/controllers/auth.controller";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "@/schemas/auth.schema";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post("/register", {
    schema: registerSchema,
    handler: authController.register,
  });

  fastify.post("/login", {
    schema: loginSchema,
    handler: authController.login,
  });

  fastify.post("/refresh", {
    schema: refreshTokenSchema,
    handler: authController.refreshToken,
  });

  // Protected routes
  fastify.post("/logout", {
    preHandler: [authMiddleware],
    handler: authController.logout,
  });

  fastify.get("/me", {
    preHandler: [authMiddleware],
    handler: authController.me,
  });
}
