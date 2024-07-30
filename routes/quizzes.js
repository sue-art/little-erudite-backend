import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.

router.get("/", async (req, res) => {
  let collection = await db.collection("quizzes");
  let results = await collection.find({}).toArray();
  res.json(results);
  return; // Stop further execution
});

// GET /books/:id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("quizzes");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) {
    res.json({ message: "Not found" }).status(404);
  } else {
    res.json(result);
  }
});

// This section will update an existing record by id
router.put("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title: req.body.title,
        name: req.body.name,
        image: req.body.image,
        author: req.body.author,
        description: req.body.description,
      },
    };
    let collection = await db.collection("quizzes");
    let result = await collection.updateOne(query, updates);
    if (result.modifiedCount === 0) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section get quiz by title
router.get("/byTitle/:title", async (req, res) => {
  try {
    const slugFromUrl = req.params.title;
    console.log("slugFromUrl", slugFromUrl);
    const query = { title: { $regex: slugFromUrl, $options: "i" } };
    const collection = await db.collection("quizzes");
    const result = await collection.findOne(query);

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error finding record");
  }
});

// This section will create a new record

router.post("/", async (req, res) => {
  try {
    const newQuizzes = req.body;
    let query = [newQuizzes];
    let collection = await db.collection("quizzes");
    let result = await collection.insertMany(query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will delete a record by id
router.delete("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let collection = await db.collection("quizzes");
    let result = await collection.deleteOne(query);
    if (!result) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

//This section will delete all records
router.delete("/", async (req, res) => {
  try {
    let collection = await db.collection("quizzes");
    let result = await collection.deleteMany({});
    if (!result) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
