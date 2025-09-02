import { FastifyRequest } from "fastify";
import { ZodSchema } from "zod";

export function validateSchema(schema: ZodSchema) {
  return async (request: FastifyRequest) => {
    try {
      const validatedData = schema.parse({
        body: request.body,
        query: request.query,
        params: request.params,
      });

      Object.assign(request, validatedData);
    } catch (error) {
      throw error;
    }
  };
}
