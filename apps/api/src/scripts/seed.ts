import { PostgresDataSource } from '@/config/data-source';
import { User } from '@/entities/user.entity';
import { logger } from '@/config/logger';

async function runSeeds() {
  try {
    logger.info('Running database seeds...');
    
    // Initialize TypeORM connection
    await PostgresDataSource.initialize();
    
    const userRepository = PostgresDataSource.getRepository(User);
    
    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      logger.info('Users already exist, skipping seeding');
      await PostgresDataSource.destroy();
      process.exit(0);
    }
    
    // Create sample users
    const sampleUsers = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
      },
      {
        email: 'user@example.com',
        password: 'user123',
        firstName: 'Regular',
        lastName: 'User',
      },
    ];
    
    for (const userData of sampleUsers) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      logger.info(`Created user: ${user.email}`);
    }
    
    logger.info('Database seeding completed successfully');
    await PostgresDataSource.destroy();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    if (PostgresDataSource.isInitialized) {
      await PostgresDataSource.destroy();
    }
    process.exit(1);
  }
}

runSeeds();