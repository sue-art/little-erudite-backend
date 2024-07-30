import mongoose from "mongoose";

// Define Schemas
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const SeriesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: false }, // Assuming this is a URL to an image
  descriptions: { type: String, required: false },
  popularRatings: { type: Number, required: false },
  lexileLevel: { type: String, required: false },
});

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  series: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Series",
    required: false,
  }, // Reference to Series
  ageRange: { type: String, required: false },
  ratingLevel: { type: Number, required: false },
  descriptions: { type: String, required: false },
  characters: [{ type: String, required: false }], // Assuming characters can be a list of names
});

// Compile models from the schemas
const Category = mongoose.model("Category", CategorySchema);
const Series = mongoose.model("Series", SeriesSchema);
const Book = mongoose.model("Book", BookSchema);

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/bookshop");
    console.log("Connected to database");

    // Example usage (Inserting a category)
    const fictionCategory = new Category({ name: "Fiction" });
    await fictionCategory.save();

    // Example usage (Inserting a series)
    const series = new Series({
      id: "series1",
      name: "Series Name",
      image: "http://example.com/image.png",
      descriptions: "Description of the series",
      popularRatings: 4.5,
      lexileLevel: "880L",
    });
    await series.save();

    // Example usage (Inserting a book with reference to series)
    const book = new Book({
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      price: 10.99,
      series: series._id, // Reference the series by its ID
      ageRange: "12-18",
      ratingLevel: 5,
      descriptions: "A description of the book",
      characters: ["Character 1", "Character 2"],
    });
    await book.save();

    console.log("Inserted documents into the collection");
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

main().catch(console.error);
