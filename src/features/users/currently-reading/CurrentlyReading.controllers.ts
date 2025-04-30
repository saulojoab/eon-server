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
  const { current_chapter, finished_chapter } = request.body;

  if (!current_chapter && !finished_chapter) {
    return reply.status(HttpStatusCode.BadRequest).send({
      message: "Missing required fields",
    });
  }

  const currentlyReadingObject = await CurrentlyReading.findOne({
    manga: manga_id,
    user: user_id,
  });

  if (!currentlyReadingObject) {
    const newCurrentlyReading = new CurrentlyReading({
      manga: manga_id,
      user: user_id,
      current_chapter: current_chapter || 1,
      finished_chapters: [],
    });

    try {
      await newCurrentlyReading.save();
      return reply.status(HttpStatusCode.Created).send(newCurrentlyReading);
    } catch (error) {
      console.log(error);
      return reply.status(HttpStatusCode.InternalServerError).send({
        message: "Something went wrong while adding to currently reading",
      });
    }
  }

  let updatedFinishedChapters = currentlyReadingObject.finished_chapters;

  if (finished_chapter && !updatedFinishedChapters.includes(finished_chapter)) {
    updatedFinishedChapters = [...updatedFinishedChapters, finished_chapter];
  }

  const updatedObject = Object.fromEntries(
    Object.entries({
      current_chapter,
      finished_chapters: updatedFinishedChapters,
    }).filter(([, value]) => value !== undefined)
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
