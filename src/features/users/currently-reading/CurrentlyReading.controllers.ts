import { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "axios";
import CurrentlyReading from "src/models/currently-reading";
import { ICurrentlyReading } from "./CurrentlyReading.type";

export const getCurrentlyReadingList = async (
  request: FastifyRequest<{ Params: { user_id: string } }>,
  reply: FastifyReply
) => {
  const { user_id } = request.params;

  const currentlyReading = await CurrentlyReading.find({ user: user_id })
    .populate("manga")
    .populate("user");

  if (!currentlyReading) {
    return reply.status(HttpStatusCode.NotFound).send({
      message: "Currently reading not found",
    });
  }

  reply.status(HttpStatusCode.Ok).send(currentlyReading);
};

export const addToCurrentlyReading = async (
  request: FastifyRequest<{ Body: ICurrentlyReading }>,
  reply: FastifyReply
) => {
  const { manga_id, user_id, current_chapter, finished_chapters } =
    request.body;

  console.log(request.body);

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
};

export const removeFromCurrentlyReading = async (
  request: FastifyRequest<{
    Params: { manga_id: string; user_id: string };
  }>,
  reply: FastifyReply
) => {
  const { manga_id, user_id } = request.params;

  const currentlyReading = await CurrentlyReading.findOneAndDelete({
    manga: manga_id,
    user: user_id,
  });

  if (!currentlyReading) {
    return reply.status(HttpStatusCode.NotFound).send({
      message: "Currently reading not found",
    });
  }

  reply.status(HttpStatusCode.Ok).send(currentlyReading);
};

export const updateCurrentlyReading = async (
  request: FastifyRequest<{
    Params: { manga_id: string; user_id: string };
    Body: ICurrentlyReading;
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
    manga: manga_id,
    user: user_id,
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

    reply.status(HttpStatusCode.Ok).send(currentlyReading);
  } catch (error) {
    reply.status(HttpStatusCode.InternalServerError).send({
      message: "Something went wrong",
    });
  }
};
