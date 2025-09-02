import { FastifyRequest } from "fastify";

export async function authMiddleware(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw err;
  }
}
