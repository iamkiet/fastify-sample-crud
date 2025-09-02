import { FastifyInstance } from 'fastify';

export async function swaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Fastify Production API',
        description: 'A production-ready Fastify API with TypeScript',
        version: '1.0.0',
      },
      host: 'localhost:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}