import argon2 from "argon2";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import User from "src/models/user";
import { IUser } from "./User.type";
import { Types } from "mongoose";

export const getAllUsers = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const users = await User.find().select("-password").populate("favorites");

  reply.status(HttpStatusCode.Ok).send(users);
};

export const createUser = async (
  request: FastifyRequest<{ Body: IUser }>,
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

    reply.status(HttpStatusCode.Created).send({ ...user, password: undefined });
  } catch (error) {
    reply.status(HttpStatusCode.InternalServerError).send({
      message: "Something went wrong",
    });
  }
};

export const getUserById = async (
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
};

export const updateUser = async (
  request: FastifyRequest<{ Params: { id: string }; Body: IUser }>,
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
};

export const deleteUser = async (
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
};

export const loginUser = async (
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
    return reply.status(HttpStatusCode.Unauthorized).send({
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
};
