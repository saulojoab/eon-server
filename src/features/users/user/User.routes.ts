import { FastifyInstance } from "fastify";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  updateUser,
} from "./User.controllers";

const UserRoutes = async (fastify: FastifyInstance) => {
  // List all
  fastify.get("/", getAllUsers);

  // Create
  fastify.post("/", createUser);

  // Find by id
  fastify.get("/:id", getUserById);

  // Update
  fastify.put("/:id", updateUser);

  // Delete
  fastify.delete("/:id", deleteUser);

  // Login
  fastify.post("/login", loginUser);
};

export default UserRoutes;
