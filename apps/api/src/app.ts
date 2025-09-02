import fastify from "fastify";
// Use Fastify's built-in logger to avoid TS type friction
import { registerPlugins } from '@/plugins';
import { registerRoutes } from '@/routes';
import { errorHandler } from '@/middleware/error.middleware';

export async function buildApp() {
  const app = fastify({ logger: true });

  await registerPlugins(app);
  app.setErrorHandler(errorHandler);

  await registerRoutes(app);

  return app;
}
