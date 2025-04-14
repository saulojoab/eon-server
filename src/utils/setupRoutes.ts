import { HttpStatusCode } from "axios";
import { MangaRoutes } from "src/features/mangas/Mangas.routes";
import { AnalyticsRoutes } from "src/features/users/analytics/Analytics.routes";
import { CurrentlyReadingRoutes } from "src/features/users/currently-reading/CurrentlyReading.routes";
import UserMangaRoutes from "src/features/users/user-mangas/UserManga.routes";
import UserRoutes from "src/features/users/user/User.routes";

const setupRoutes = (fastify: import("fastify").FastifyInstance) => {
  fastify.get("/", (_, reply) => {
    reply.status(HttpStatusCode.Ok).send("Welcome to the EON API!");
  });

  fastify.get("*", (_, reply) => {
    reply.status(HttpStatusCode.NotFound).send({
      message: "",
      error: "page not found",
    });
  });

  fastify.register(MangaRoutes, { prefix: "/mangas" });
  fastify.register(UserRoutes, { prefix: "/users" });
  fastify.register(UserMangaRoutes, { prefix: "/user-manga" });
  fastify.register(CurrentlyReadingRoutes, {
    prefix: "/user-manga/currently-reading",
  });
  fastify.register(AnalyticsRoutes, {
    prefix: "/user-manga/analytics",
  });
};

export default setupRoutes;
