import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  publicationYear: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const booksModel = mongoose.model("books", bookSchema);

export default booksModel;
