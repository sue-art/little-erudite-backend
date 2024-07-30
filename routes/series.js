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
  let collection = await db.collection("series");
  let results = await collection.find({}).sort({ _id: -1 }).toArray();
  if (!results) {
    res.send("Not found").status(404);
  } else {
    res.json(results);
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("series");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.get("/byName/:name", async (req, res) => {
  let collection = await db.collection("series");
  let query = { name: { $regex: new RegExp(`^${req.params.name}$`, "i") } };

  let result = await collection.findOne(query);
  console.log(result);
  if (result === null) {
    res.status(404).json("Not found");
  } else {
    res.json(result);
    return;
  }
});

// This section will update an existing record by id
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        author: req.body.author,
        description: req.body.description,
      },
    };
    let collection = await db.collection("series");
    let result = await collection.updateOne(query, updates);
    if (result.modifiedCount === 0) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
      return; // Stop further execution
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will create a new record

router.post("/", async (req, res) => {
  try {
    let newDocument = [
      {
        name: req.body.name,
        value: req.body.value,
        image: req.body.image,
        search: req.body.search,
        description: req.body.description,
      },
    ];

    let collection = await db.collection("series");
    let result = await collection.insertMany(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will delete a record by id
router.delete("/:id", async (req, res) => {
  try {
    let collection = await db.collection("series");
    let result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      res.send("Not found").status(404);
    } else {
      res.json(result);
      return; // Stop further execution
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});
export default router;
