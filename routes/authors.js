import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all authors
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("authors");
    let results = await collection.find({}).toArray();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific author by ID
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("authors");
    let query = { name: req.params.id }; // Modify the query to match the author name
    let result = await collection.findOne(query);

    if (!result) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new author
router.post("/", async (req, res) => {
  const newAuthor = req.body;

  try {
    let query = [newAuthor];
    let collection = await db.collection("authors");
    let result = await collection.insertMany(query);
    if (!result) {
      res.send("Not updated");
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing author
router.put("/:id", async (req, res) => {
  if (req.body.name != null) {
    res.author.name = req.body.name;
  }

  try {
    const updatedAuthor = await res.author.save();
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get author by name
router.get("/byAuthor/:name", async (req, res) => {
  const authorName = req.params.name;
  try {
    let collection = await db.collection("authors");
    let query = { name: { $regex: authorName, $options: "i" } };
    let result = await collection.findOne(query);
    if (!result) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an author
router.delete("/:id", async (req, res) => {
  try {
    let collection = await db.collection("authors");
    let result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
