import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

const collectionName = "users";

// Create a new user
router.post("/", async (req, res) => {
  console.log("req.body", req.body);
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

// Get all users
router.get("/", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a user by email
router.get("/:id", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.findOne({ email: req.params.id });
    if (!result) {
      res.status(404).json("Not found");
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { email: req.params.id },
      { $set: req.body },
      { returnOriginal: false, returnDocument: "after" } // Use returnDocument: "after" for MongoDB v4.2+
    );
    /*
    const result = await collection.findOneAndUpdate(
      { email: req.params.id },
      { $push: { booklist: req.body } },
      { returnOriginal: false, returnDocument: "after" } // Use returnDocument: "after" for MongoDB v4.2+
    );*/
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Updata a user look list status
router.put("/updateBookStatus/:id", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { email: req.params.id },
      { $set: { booklist: req.body.booklist } },
      { returnOriginal: false, returnDocument: "after" } // Use returnDocument: "after" for MongoDB v4.2+
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/addViewedBook/:id", async (req, res) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { email: req.params.id },
      { $set: { viewedbooklist: req.body.viewedbooklist } },
      { returnOriginal: false, returnDocument: "after" } // Use returnDocument: "after" for MongoDB v4.2+
    );
    res.json(result); // result.value contains the updated document
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const query = { email: req.params.id };
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndDelete(query);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
