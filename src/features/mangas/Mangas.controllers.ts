import { FastifyReply, FastifyRequest } from "fastify";
import { IProvider } from "./Mangas.type";
import {
  getMangaChapters,
  getMangaInfo,
  searchManga,
} from "src/consumet/consumetFunctions";

export const searchForManga = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { query, providers } = request.body as {
    query: string;
    providers: string;
  };

  if (!query || !providers) {
    return reply.status(400).send({ message: "Missing required fields" });
  }

  const providersArray = providers.split(",");

  const data = await searchManga(query, providersArray as IProvider[]);

  return reply.status(200).send(data);
};

export const getMangaInformation = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id, provider } = request.body as { id: string; provider: string };

  if (!id || !provider) {
    return reply.status(400).send({ message: "Missing required fields" });
  }

  const data = await getMangaInfo(id, provider as IProvider);

  return reply.status(200).send(data);
};

export const getChapterPages = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { chapterId, mangaId, provider } = request.body as {
    chapterId: string;
    mangaId: string;
    provider: string;
  };

  if (!chapterId || !mangaId || !provider) {
    return reply.status(400).send({ message: "Missing required fields" });
  }

  const data = await getMangaChapters(
    chapterId,
    mangaId,
    provider as IProvider
  );

  return reply.status(200).send(data);
};
