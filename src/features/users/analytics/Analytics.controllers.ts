import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import Manga from "src/models/manga";

export const getAllViewsFromManga = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  const manga = await Manga.findById(id);

  if (!manga) {
    return reply.status(HttpStatusCode.NotFound).send({
      message: "Manga not found",
    });
  }

  reply.status(HttpStatusCode.Ok).send(manga.views);
};

export const addViewToManga = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  const manga = await Manga.findById(id);

  if (!manga) {
    return reply
      .status(HttpStatusCode.NotFound)
      .send({ message: "Manga not found" });
  }

  try {
    const today = new Date().setUTCHours(0, 0, 0, 0);
    const mangaViewDate = manga.todayViews?.date?.setUTCHours(0, 0, 0, 0);

    if (mangaViewDate === today) {
      manga.todayViews.count = (manga.todayViews.count || 0) + 1;
    } else {
      manga.todayViews = { date: new Date(today), count: 1 };
    }

    manga.views = (manga.views || 0) + 1;

    await manga.save();

    reply.status(HttpStatusCode.Ok).send(manga);
  } catch {
    reply
      .status(HttpStatusCode.InternalServerError)
      .send({ message: "Something went wrong" });
  }
};

export const getMostViewedMangaOfTheDay = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const manga = await Manga.findOne({
    "todayViews.date": today.toISOString(),
  }).sort("-todayViews.count");

  if (!manga) {
    return reply.status(HttpStatusCode.NotFound).send({
      message: "No mangas had any views today",
    });
  }

  reply.status(HttpStatusCode.Ok).send(manga);
};

export const getTrendingMangas = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const mangas = await Manga.find().sort("-views").limit(10);

  if (!mangas) {
    return reply.status(HttpStatusCode.NotFound).send({
      message: "No mangas found",
    });
  }

  reply.status(HttpStatusCode.Ok).send(mangas);
};
