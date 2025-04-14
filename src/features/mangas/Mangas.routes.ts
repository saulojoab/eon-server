import { FastifyInstance } from "fastify";

import {
  getChapterPages,
  getMangaInformation,
  searchForManga,
} from "./Mangas.controllers";

export const MangaRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/search", searchForManga);
  fastify.post("/info", getMangaInformation);
  fastify.post("/chapter", getChapterPages);
};
