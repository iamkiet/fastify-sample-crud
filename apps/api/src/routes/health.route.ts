import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { databaseService } from '@/services/database.service';
import { successResponse, errorResponse } from '@/utils/response.util';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dbHealthy = await databaseService.healthCheck();
      
      const health = {
        status: dbHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        database: dbHealthy ? 'connected' : 'disconnected',
      };

      const statusCode = dbHealthy ? 200 : 503;
      return reply.status(statusCode).send(health);
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, 'Health check failed', 503);
    }
  });

  fastify.get('/health/ready', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dbHealthy = await databaseService.healthCheck();
      if (dbHealthy) {
        return successResponse(reply, { status: 'ready' });
      } else {
        return errorResponse(reply, 'Service not ready', 503);
      }
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, 'Readiness check failed', 503);
    }
  });
}