// Importing modules using ESM syntax
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import Router
import series from "./routes/series.js";
import books from "./routes/books.js";
import quizzes from "./routes/quizzes.js";
import authors from "./routes/authors.js";
import vocabulary from "./routes/vocabulary.js";
import users from "./routes/users.js";

app.use("/api/series", series);
app.use("/api/books", books);
app.use("/api/quizzes", quizzes);
app.use("/api/authors", authors);
app.use("/api/vocabulary", vocabulary);
app.use("/api/users", users);

// Import Chatbot router
import bookchatbot from "./routes/bookchatbot.js";

app.use("/api/chatbot", bookchatbot);

//Run Server
app.listen(port, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log("Server is running on ", port);
  }
});
