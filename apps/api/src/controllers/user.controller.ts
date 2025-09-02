import { FastifyRequest, FastifyReply } from "fastify";
import { userService } from "@/services/user.service";
import { successResponse, errorResponse } from "@/utils/response.util";
import { CreateUser, UpdateUser, GetUsersQuery } from "@repo/shared";

export class UserController {
  async createUser(
    request: FastifyRequest<{ Body: CreateUser }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.createUser(request.body);
      return successResponse(reply, user, "User created successfully", 201);
    } catch (error: any) {
      request.log.error(error);
      if (error.code === "23505") {
        // Unique violation
        return errorResponse(reply, "Email already exists", 409);
      }
      return errorResponse(reply, "Failed to create user", 500);
    }
  }

  async getUsers(
    request: FastifyRequest<{ Querystring: GetUsersQuery }>,
    reply: FastifyReply
  ) {
    try {
      const result = await userService.getUsers(request.query);
      return successResponse(reply, result);
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, "Failed to fetch users", 500);
    }
  }

  async getUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.getUserById(request.params.id);
      if (!user) {
        return errorResponse(reply, "User not found", 404);
      }
      return successResponse(reply, user);
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, "Failed to fetch user", 500);
    }
  }

  async updateUser(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUser }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.updateUser(
        request.params.id,
        request.body
      );
      if (!user) {
        return errorResponse(reply, "User not found", 404);
      }
      return successResponse(reply, user, "User updated successfully");
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, "Failed to update user", 500);
    }
  }

  async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const deleted = await userService.deleteUser(request.params.id);
      if (!deleted) {
        return errorResponse(reply, "User not found", 404);
      }
      return successResponse(reply, null, "User deleted successfully");
    } catch (error) {
      request.log.error(error);
      return errorResponse(reply, "Failed to delete user", 500);
    }
  }
}

export const userController = new UserController();
