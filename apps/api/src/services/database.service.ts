import { PostgresDataSource } from '@/config/data-source';
import { logger } from '@/config/logger';

export class DatabaseService {
  async healthCheck(): Promise<boolean> {
    try {
      if (!PostgresDataSource.isInitialized) {
        return false;
      }
      
      const result = await PostgresDataSource.query('SELECT 1');
      return result.length > 0;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  async getVersion(): Promise<string> {
    try {
      const result = await PostgresDataSource.query('SELECT version()');
      return result[0].version;
    } catch (error) {
      logger.error('Failed to get database version:', error);
      throw error;
    }
  }

  async runMigration(sql: string): Promise<void> {
    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.query(sql);
      await queryRunner.commitTransaction();
      logger.info('Migration executed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Migration failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export const databaseService = new DatabaseService();