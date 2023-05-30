import { HttpStatusCode } from "axios";
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  RegisterOptions,
} from "fastify";
import User from "../models/user";

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await User.find();

    reply.status(HttpStatusCode.Ok).send(users);
  });
};

export default routes;
