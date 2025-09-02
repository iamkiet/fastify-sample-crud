import { FastifyInstance } from 'fastify';
import { userController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

export async function userRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/users', userController.createUser);

  // Protected routes
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authMiddleware);

    fastify.get('/users', userController.getUsers);
    fastify.get('/users/:id', userController.getUser);
    fastify.put('/users/:id', userController.updateUser);
    fastify.delete('/users/:id', userController.deleteUser);
  });
}