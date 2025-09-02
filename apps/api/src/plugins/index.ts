import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { databasePlugin } from "./database.plugin";
import { swaggerPlugin } from "./swagger.plugin";
import { config } from "@/config/environment";

export async function registerPlugins(fastify: FastifyInstance) {
  // Database connection
  await fastify.register(databasePlugin);

  // CORS
  const cors = await import("@fastify/cors");
  await fastify.register(cors.default, {
    origin: config.CORS_ORIGIN?.split(",") || true,
    credentials: true,
  });

  // Security headers
  const helmet = await import("@fastify/helmet");
  await fastify.register(helmet.default, {
    contentSecurityPolicy: false,
  });

  // Rate limiting
  const rateLimit = await import("@fastify/rate-limit");
  await fastify.register(rateLimit.default, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_TIME_WINDOW,
  });

  // Cookies
  const cookie = await import("@fastify/cookie");
  await fastify.register(cookie.default, {
    secret: config.JWT_SECRET,
  });

  // JWT
  const jwt = await import("@fastify/jwt");
  await fastify.register(jwt.default, {
    secret: config.JWT_SECRET,
  });

  // API documentation (only in development)
  if (config.NODE_ENV !== "production") {
    await fastify.register(swaggerPlugin);
  }
}
