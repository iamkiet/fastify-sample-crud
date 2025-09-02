import { FastifyRequest, FastifyReply } from 'fastify';
import { config } from '@/config/environment';

export async function corsMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const origin = request.headers.origin;
  const allowedOrigins = config.CORS_ORIGIN?.split(',') || ['*'];

  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    reply.header('Access-Control-Allow-Origin', origin || '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    reply.header('Access-Control-Allow-Credentials', 'true');
  }

  if (request.method === 'OPTIONS') {
    reply.status(200).send();
  }
}