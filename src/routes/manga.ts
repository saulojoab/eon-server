import { HttpStatusCode } from "axios";
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  RegisterOptions,
} from "fastify";
import Manga from "../models/manga";
import CurrentlyReading from "../models/currently-reading";

interface MangaProps {
  manga_id: string;
  image: string;
  referer: string;
  title: string;
  views: number;
  todayViews: {
    date: Date;
    count: number;
  };
  createdAt: Date;
}

interface CurrentlyReadingProps {
  manga_id: string;
  user_id: string;
  current_chapter: string;
  finished_chapters: string[];
  createdAt: Date;
}

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  // Get all mangas registered in the database
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    const mangas = await Manga.find();
    reply.status(HttpStatusCode.Ok).send(mangas);
  });

  // Get all views from a manga
  fastify.get(
    "/views/:id",
    async (
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
    }
  );

  // Adds a manga to the database
  fastify.post(
    "/",
    async (
      request: FastifyRequest<{ Body: MangaProps }>,
      reply: FastifyReply
    ) => {
      const { manga_id, image, referer, title } = request.body;

      if (!manga_id || !image || !referer || !title) {
        return reply.status(HttpStatusCode.BadRequest).send({
          message: "Missing required fields",
        });
      }

      try {
        const manga = new Manga({
          manga_id,
          image,
          referer,
          title,
          views: 0,
        });

        await manga.save();

        reply.status(HttpStatusCode.Created).send(manga);
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Finds a specific manga by id
  fastify.get(
    "/:id",
    async (
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

      reply.status(HttpStatusCode.Ok).send(manga);
    }
  );

  // Deletes a manga from the database
  fastify.delete(
    "/:id",
    async (
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
    }
  );

  // Adds a manga to the currently reading list of the user
  fastify.post(
    "currently-reading/",
    async (
      request: FastifyRequest<{ Body: CurrentlyReadingProps }>,
      reply: FastifyReply
    ) => {
      const { manga_id, user_id, current_chapter, finished_chapters } =
        request.body;

      if (!manga_id || !user_id || !current_chapter || !finished_chapters) {
        return reply.status(HttpStatusCode.BadRequest).send({
          message: "Missing required fields",
        });
      }

      try {
        const currentlyReading = new CurrentlyReading({
          manga_id,
          user_id,
          current_chapter,
          finished_chapters,
        });

        await currentlyReading.save();

        reply.status(HttpStatusCode.Created).send(currentlyReading);
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Removes a manga from the currently reading list of the user
  fastify.delete(
    "currently-reading/:user_id/:manga_id",
    async (
      request: FastifyRequest<{
        Params: { manga_id: string; user_id: string };
      }>,
      reply: FastifyReply
    ) => {
      const { manga_id, user_id } = request.params;

      const currentlyReading = await CurrentlyReading.findOneAndDelete({
        manga_id,
        user_id,
      });

      if (!currentlyReading) {
        return reply.status(HttpStatusCode.NotFound).send({
          message: "Currently reading not found",
        });
      }

      reply.status(HttpStatusCode.Ok).send(currentlyReading);
    }
  );

  // Updates the currently reading manga of the user
  fastify.put(
    "currently-reading/:user_id/:manga_id",
    async (
      request: FastifyRequest<{
        Params: { manga_id: string; user_id: string };
        Body: CurrentlyReadingProps;
      }>,
      reply: FastifyReply
    ) => {
      const { manga_id, user_id } = request.params;
      const { current_chapter, finished_chapters } = request.body;

      if (!current_chapter && !finished_chapters) {
        return reply.status(HttpStatusCode.BadRequest).send({
          message: "Missing required fields",
        });
      }

      const currentlyReadingObject = await CurrentlyReading.findOne({
        manga_id,
        user_id,
      });

      if (!currentlyReadingObject) {
        return reply.status(HttpStatusCode.NotFound).send({
          message: "Currently reading not found",
        });
      }

      const updatedObject = Object.fromEntries(
        Object.entries({ current_chapter, finished_chapters }).filter(
          ([, value]) => value !== undefined
        )
      );

      try {
        const currentlyReading = await CurrentlyReading.findByIdAndUpdate(
          currentlyReadingObject._id,
          updatedObject,
          { new: true }
        );

        reply.status(HttpStatusCode.Created).send(currentlyReading);
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Gets the currently reading manga list of the user
  fastify.get(
    "currently-reading/:user_id",
    async (
      request: FastifyRequest<{ Params: { user_id: string } }>,
      reply: FastifyReply
    ) => {
      const { user_id } = request.params;

      const currentlyReading = await CurrentlyReading.find({ user_id });

      if (!currentlyReading) {
        return reply.status(HttpStatusCode.NotFound).send({
          message: "Currently reading not found",
        });
      }

      reply.status(HttpStatusCode.Ok).send(currentlyReading);
    }
  );

  // Adds a view to the manga
  fastify.put(
    "/view/:id",
    async (
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

      try {
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
      } catch (error) {
        reply.status(HttpStatusCode.InternalServerError).send({
          message: "Something went wrong",
        });
      }
    }
  );

  // Gets the most viewed manga of the day
  fastify.get(
    "trending-today",
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const manga = await Manga.findOne({
        "todayViews.date": today,
      }).sort("-todayViews.count");

      if (!manga) {
        return reply.status(HttpStatusCode.NotFound).send({
          message: "No mangas had any views today",
        });
      }

      reply.status(HttpStatusCode.Ok).send(manga);
    }
  );

  // Gets the 10 most viewed mangas
  fastify.get(
    "trending",
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const mangas = await Manga.find().sort("-views").limit(10);

      if (!mangas) {
        return reply.status(HttpStatusCode.NotFound).send({
          message: "No mangas found",
        });
      }

      reply.status(HttpStatusCode.Ok).send(mangas);
    }
  );
};

export default routes;
