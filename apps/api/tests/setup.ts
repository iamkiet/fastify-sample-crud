import { PostgresDataSource } from '../src/config/data-source';

beforeAll(async () => {
  // Setup test database
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USERNAME = 'postgres';
  process.env.DB_PASSWORD = 'password';
  process.env.DB_NAME = 'fastify_test';
  
  // Initialize TypeORM for tests
  if (!PostgresDataSource.isInitialized) {
    await PostgresDataSource.initialize();
  }
});

afterAll(async () => {
  // Clean up
  if (PostgresDataSource.isInitialized) {
    await PostgresDataSource.destroy();
  }
});