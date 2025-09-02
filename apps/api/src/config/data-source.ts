import { DataSource } from 'typeorm';
import { config } from './environment';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST || 'localhost',
  port: config.DB_PORT,
  username: config.DB_USERNAME || 'postgres',
  password: config.DB_PASSWORD || 'password',
  database: config.DB_NAME || 'fastify_db',
  synchronize: config.NODE_ENV === 'development',
  logging: config.NODE_ENV === 'development',
  entities: config.NODE_ENV === 'development' ? ['src/entities/*.ts'] : ['dist/entities/*.js'],
  migrations: config.NODE_ENV === 'development' ? ['src/migrations/*.ts'] : ['dist/migrations/*.js'],
  subscribers: [],
});
