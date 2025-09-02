import 'reflect-metadata';
import { config } from '@/config/environment';
import { logger } from '@/config/logger';
import { buildApp } from '@/app';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({
      port: config.PORT,
      host: config.HOST
    });
    app.log.info(`Server listening on ${config.HOST}:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    process.exit(0);
  });
});

start();