import fastify from "fastify";
import { registerPlugins } from "@/plugins";
import { registerRoutes } from "@/routes";
import { errorHandler } from "@/middleware/error.middleware";
import { loggerOptions } from "./config/logger";

export async function buildApp() {
  const app = fastify({
    logger: loggerOptions,
  });

  await registerPlugins(app);
  app.setErrorHandler(errorHandler);

  await registerRoutes(app);

  app.addHook("onSend", async (request, _, payload) => {
    request.log.info({ response: payload }, "Response sent");
    return payload;
  });

  return app;
}
