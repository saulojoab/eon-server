import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import Manga from "src/models/manga";
import { IUserManga } from "./UserManga.type";
import { Types } from "mongoose";
import User from "src/models/user";

export const getAllUserManga = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const mangas = await Manga.find();
  reply.status(HttpStatusCode.Ok).send(mangas);
};

export const createManga = async (
  request: FastifyRequest<{ Body: IUserManga }>,
  reply: FastifyReply
) => {
  const { manga_id, image, referer, title } = request.body;

  if (!manga_id || !image || !referer || !title) {
    return reply.status(HttpStatusCode.BadRequest).send({
      message: "Missing required fields",
    });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    const manga = new Manga({
      manga_id,
      image,
      referer,
      title,
      views: 1,
      todayViews: {
        date: today,
        count: 1,
      },
    });

    await manga.save();

    reply.status(HttpStatusCode.Created).send(manga);
  } catch (error) {
    reply.status(HttpStatusCode.InternalServerError).send({
      message: "Something went wrong",
    });
  }
};

export const getMangaById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  console.log(id);

  const manga = await Manga.findOne({ manga_id: id });

  if (!manga) {
    return reply.status(HttpStatusCode.NotFound).send({
      message: "Manga not found",
    });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (
    manga.todayViews?.date?.toDateString() === today.toDateString() &&
    manga.todayViews?.count
  ) {
    manga.todayViews.count += 1;
  } else {
    manga.todayViews = {
      date: today,
      count: 1,
    };
  }

  manga.views += 1;

  await manga.save();
  reply.status(HttpStatusCode.Ok).send(manga);
};

export const deleteManga = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  const manga = await Manga.findByIdAndDelete(id);

  if (!manga) {
    return reply.status(HttpStatusCode.NotFound).send({
      message: "Manga not found",
    });
  }

  reply.status(HttpStatusCode.Ok).send(manga);
};

export const addMangaToFavorites = async (
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

    if (user.favorites.some((fav) => fav.equals(mangaId))) {
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
};

export const getFavoriteMangasFromUser = async (
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
};
