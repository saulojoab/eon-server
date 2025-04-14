import { FastifyInstance, RegisterOptions } from "fastify";
import {
  addMangaToFavorites,
  createManga,
  deleteManga,
  getAllUserManga,
  getFavoriteMangasFromUser,
  getMangaById,
} from "./UserManga.controllers";

const UserMangaRoutes = async (fastify: FastifyInstance) => {
  // Get all mangas registered in the database
  fastify.get("/", getAllUserManga);

  // Adds a manga to the database
  fastify.post("/", createManga);

  // Finds a specific manga by id
  fastify.get("/:id", getMangaById);

  // Deletes a manga from the database
  fastify.delete("/:id", deleteManga);

  // Add manga to favorites
  fastify.post("/favorites/:user_id/:manga_id", addMangaToFavorites);

  // Get favorite mangas from user
  fastify.get("/favorites/:user_id", getFavoriteMangasFromUser);
};

export default UserMangaRoutes;
