import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
const collectionName = "vocabulary";

// Create a new vocabulary
router.post("/", async (req, res) => {
  try {
    const query = req.body;
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(query);

    if (!result) {
      res.json("Not found").status(404);
      res.send("Not updated");
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all vocabularies
router.get("/", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    res.json(result);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a vocabulary
router.put("/:id", async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { returnOriginal: false }
    );
    res.json(result.value);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a vocabulary
router.delete("/:id", async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndDelete({ _id: req.params.id });
    res.json(result.value);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get vocabulary by title
router.get("/byTitle/:title", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.find({ title: req.params.title }).toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
