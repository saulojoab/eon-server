import { FastifyInstance } from "fastify";
import {
  addToCurrentlyReading,
  getCurrentlyReadingList,
  removeFromCurrentlyReading,
  updateCurrentlyReading,
} from "./CurrentlyReading.controllers";

export const CurrentlyReadingRoutes = async (fastify: FastifyInstance) => {
  // Gets the currently reading manga list of the user
  fastify.get("/currently-reading/:user_id", getCurrentlyReadingList);

  // Adds a manga to the currently reading list of the user
  fastify.post("/currently-reading", addToCurrentlyReading);

  // Removes a manga from the currently reading list of the user
  fastify.delete(
    "/currently-reading/:user_id/:manga_id",
    removeFromCurrentlyReading
  );

  // Updates the currently reading manga of the user
  fastify.put("/currently-reading/:user_id/:manga_id", updateCurrentlyReading);
};
