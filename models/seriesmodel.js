import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    search: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const seriesModel = mongoose.model("series", seriesSchema);

export default seriesModel;
