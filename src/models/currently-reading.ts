import mongoose from "mongoose";
const Schema = mongoose.Schema;

const currentlyReadingSchema = new Schema({
  manga: {
    type: { type: Schema.Types.ObjectId, ref: "Manga", required: true },
  },
  user: {
    type: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  current_chapter: {
    type: String,
    required: true,
  },
  finished_chapters: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const CurrentlyReading = mongoose.model(
  "CurrentlyReading",
  currentlyReadingSchema
);

export default CurrentlyReading;
