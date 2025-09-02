import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  // Normalize base shape
  const base = {
    success: false,
  } as const;

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      ...base,
      message: 'Validation error',
      errors: error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Fastify validation (if any)
  if ((error as any).validation) {
    return reply.status(400).send({
      ...base,
      message: 'Validation error',
      errors: (error as any).validation,
    });
  }

  // JWT errors from @fastify/jwt (prefer code over message matching)
  switch ((error as any).code) {
    case 'FST_JWT_NO_AUTHORIZATION_IN_HEADER':
      return reply.status(401).send({ ...base, message: 'Authorization header missing' });
    case 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED':
      return reply.status(401).send({ ...base, message: 'Token expired' });
    case 'FST_JWT_AUTHORIZATION_TOKEN_INVALID':
    case 'FST_JWT_AUTHORIZATION_FORMAT':
      return reply.status(401).send({ ...base, message: 'Invalid token' });
    case 'FST_JWT_OPTIONS_SECRET_REQUIRED':
      return reply.status(500).send({ ...base, message: 'JWT configuration error' });
  }

  // Database errors
  if (error.message.includes('database') || error.message.includes('pg')) {
    return reply.status(500).send({
      ...base,
      message: 'Database error',
    });
  }

  // Common Fastify errors
  if ((error as any).code === 'FST_ERR_NOT_FOUND') {
    return reply.status(404).send({ ...base, message: 'Route not found' });
  }
  if ((error as any).code === 'FST_ERR_CTP_BODY_TOO_LARGE') {
    return reply.status(413).send({ ...base, message: 'Payload too large' });
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    ...base,
    message: error.message || 'Internal server error',
  });
}