import { FastifyInstance } from "fastify";
import {
  addViewToManga,
  getAllViewsFromManga,
  getMostViewedMangaOfTheDay,
  getTrendingMangas,
} from "./Analytics.controllers";

export const AnalyticsRoutes = async (fastify: FastifyInstance) => {
  // Get all views from a manga
  fastify.get("/views/:id", getAllViewsFromManga);

  // Adds a view to the manga
  fastify.put("/view/:id", addViewToManga);

  // Gets the most viewed manga of the day
  fastify.get("/trending-today", getMostViewedMangaOfTheDay);

  // Gets the 10 most viewed mangas
  fastify.get("/trending", getTrendingMangas);
};
