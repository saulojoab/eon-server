import { HttpStatusCode } from "axios";
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  RegisterOptions,
} from "fastify";
import User from "../models/user";
import argon2 from "argon2";
import { Types } from "mongoose";

interface UserProps {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  // List all
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await User.find().select("-password").populate("favorites");

    reply.status(HttpStatusCode.Ok).send(users);
  });

  // Create
  fastify.post(
    "/",
    async (
      request: FastifyRequest<{ Body: UserProps }>,
      reply: FastifyReply
    ) => {
      const { username, email, password, profilePicture } = request.body;

      if (!username || !email || !password) {
        reply.status(HttpStatusCode.BadRequest).send({
          message: "Missing required fields",
        });
      }

      try {
        const hashedPassword = await argon2.hash(password);
        const user = new User({
          username,
          email,
          password: hashedPassword,
          profilePicture: profilePicture || "",
          favorites: [],
        });

        await user.save();

        reply
          .status(HttpStatusCode.Created)
          .send({ ...user, password: undefined });
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Find by id
  fastify.get(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const user = await User.findById(new Types.ObjectId(id))
        .select("-password")
        .populate("favorites");

      if (!user) {
        return reply.status(HttpStatusCode.NotFound).send({
          message: "User not found",
        });
      }

      reply.status(HttpStatusCode.Ok).send(user);
    }
  );

  // Update
  fastify.put(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: UserProps }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { username, email, profilePicture } = request.body;

      if (!username && !email) {
        return reply.status(HttpStatusCode.BadRequest).send({
          message: "Missing required fields",
        });
      }

      const update = Object.fromEntries(
        Object.entries({
          username,
          email,
          profilePicture,
        }).filter(([key, value]) => value !== undefined)
      );

      try {
        const updatedUser = await User.findByIdAndUpdate(id, update, {
          new: true,
        });

        if (!updatedUser) {
          return reply.status(HttpStatusCode.NotFound).send({
            message: "User not found",
          });
        }

        reply
          .status(HttpStatusCode.Ok)
          .send({ ...updatedUser, password: undefined });
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Delete
  fastify.delete(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return reply.status(HttpStatusCode.NotFound).send({
            message: "User not found",
          });
        }

        reply.status(HttpStatusCode.NoContent).send();
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Add manga to favorites
  fastify.post(
    "/favorites/:user_id/:manga_id",
    async (
      request: FastifyRequest<{
        Params: { user_id: string; manga_id: string };
      }>,
      reply: FastifyReply
    ) => {
      const { user_id, manga_id } = request.params;

      if (!manga_id) {
        return reply.status(HttpStatusCode.BadRequest).send({
          message: "Missing required fields",
        });
      }

      const mangaId = new Types.ObjectId(manga_id);

      try {
        const user = await User.findById(user_id);

        if (!user) {
          return reply.status(HttpStatusCode.NotFound).send({
            message: "User not found",
          });
        }

        if (user.favorites.includes(new Types.ObjectId(mangaId))) {
          return reply.status(HttpStatusCode.BadRequest).send({
            message: "Manga already in favorites",
          });
        }

        user.favorites.push(mangaId);

        await user.save();

        reply.status(HttpStatusCode.Ok).send({ ...user, password: undefined });
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Login
  fastify.post(
    "/login",
    async (
      request: FastifyRequest<{ Body: { email: string; password: string } }>,
      reply: FastifyReply
    ) => {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.status(HttpStatusCode.BadRequest).send({
          message: "Missing required fields",
        });
      }

      const userInDatabase = await User.findOne({ email });

      if (!userInDatabase) {
        return reply.status(HttpStatusCode.NotFound).send({
          message: "User not found",
        });
      }

      const isPasswordValid = await argon2.verify(
        userInDatabase.password,
        password
      );

      if (!isPasswordValid) {
        return reply.status(HttpStatusCode.BadRequest).send({
          message: "Invalid password",
        });
      }

      reply.status(HttpStatusCode.Ok).send({
        _id: userInDatabase._id,
        username: userInDatabase.username,
        email: userInDatabase.email,
        profilePicture: userInDatabase.profilePicture,
        favorites: userInDatabase.favorites,
        createdAt: userInDatabase.createdAt,
        updatedAt: userInDatabase.updatedAt,
      });
    }
  );

  // Get favorite mangas from user
  fastify.get(
    "/favorites/:user_id",
    async (
      request: FastifyRequest<{ Params: { user_id: string } }>,
      reply: FastifyReply
    ) => {
      const { user_id } = request.params;

      try {
        const user = await User.findById(user_id).populate("favorites");

        if (!user) {
          return reply.status(HttpStatusCode.NotFound).send({
            message: "User not found",
          });
        }

        reply.status(HttpStatusCode.Ok).send(user.favorites);
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );
};

export default routes;
