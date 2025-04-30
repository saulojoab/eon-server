import { FastifyInstance } from "fastify";
import {
  getCurrentlyReadingList,
  removeFromCurrentlyReading,
  updateCurrentlyReading,
} from "./CurrentlyReading.controllers";

export const CurrentlyReadingRoutes = async (fastify: FastifyInstance) => {
  // Gets the currently reading manga list of the user
  fastify.get("/:user_id", getCurrentlyReadingList);

  // Removes a manga from the currently reading list of the user
  fastify.delete("/:user_id/:manga_id", removeFromCurrentlyReading);

  // Updates the currently reading manga of the user
  fastify.patch("/:user_id/:manga_id", updateCurrentlyReading);
};
