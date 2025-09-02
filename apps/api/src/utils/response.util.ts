import { FastifyReply } from 'fastify';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export function successResponse<T>(
  reply: FastifyReply,
  data?: T,
  message = 'Success',
  statusCode = 200
): FastifyReply {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  reply: FastifyReply,
  message = 'Error',
  statusCode = 500,
  errors?: any[]
): FastifyReply {
  return reply.status(statusCode).send({
    success: false,
    message,
    errors,
  });
}