import { FastifyInstance } from 'fastify';
import { PostgresDataSource } from '@/config/data-source';

export async function databasePlugin(fastify: FastifyInstance) {
  try {
    await PostgresDataSource.initialize();
    fastify.log.info('Connected to PostgreSQL database with TypeORM');
  } catch (error) {
    fastify.log.error({ err: error }, 'Failed to connect to database');
    process.exit(1);
  }

  fastify.addHook('onClose', async () => {
    if (PostgresDataSource.isInitialized) {
      await PostgresDataSource.destroy();
      fastify.log.info('Disconnected from PostgreSQL database');
    }
  });
}