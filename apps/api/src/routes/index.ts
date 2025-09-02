import { FastifyInstance } from 'fastify';
import { userRoutes } from './user.route';
import { authRoutes } from './auth.route';
import { healthRoutes } from './health.route';

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check routes (no prefix)
  await fastify.register(healthRoutes);
  
  // API routes with versioning
  await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  await fastify.register(userRoutes, { prefix: '/api/v1' });
}