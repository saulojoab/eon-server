import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getImage } from "./Utils.controllers";

export const UtilRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/image-proxy",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { url, headers } = request.query as { url: string; headers: any };

      if (!url || !headers) {
        reply.status(400).send("No URL provided");
        return;
      }

      reply.header("Content-Type", "image/jpeg");
      reply.header("Cache-Control", "public, max-age=31536000");
      reply.header("Access-Control-Allow-Origin", "*");
      reply.header("Access-Control-Allow-Methods", "GET");
      reply.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      reply.header("Access-Control-Allow-Credentials", "true");
      reply.send(await getImage(url, { headers: JSON.parse(headers) }));
    }
  );
};
