import mongoose from "mongoose";
const Schema = mongoose.Schema;

const todayViewsSchema = new Schema({
  date: Date,
  count: Number,
});

const mangaSchema = new Schema({
  manga_id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  referer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  views: { type: Number, default: 0 },
  todayViews: {
    type: todayViewsSchema,
    default: { date: new Date(), count: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

const Manga = mongoose.model("Manga", mangaSchema);

export default Manga;
