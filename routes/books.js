import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /books

// This section will help you get a list of all the books.
router.get("/", async (req, res) => {
  let collection = await db.collection("newbooks");
  let results = await collection.find({}).sort({ _id: -1 }).toArray();
  if (!results) {
    res.send("Not found").status(404);
  } else {
    res.json(results);
  }
});

// GET /books/:id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("newbooks");
  let query = { _id: new ObjectId(req.params.id) };
  let results = await collection.findOne(query);
  if (results === null) {
    res.json("Not found").status(404);
  } else {
    res.json(results);
  }
});

const generateSlug = (title) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(/[^a-z0-9]/g, ""))
    .filter((word) => word.length > 0)
    .join("-");
};

router.get("/byTitle/:name", async (req, res) => {
  try {
    const slugFromUrl = req.params.name;
    const collection = await db.collection("newbooks");
    const result = await collection
      .aggregate([
        {
          $addFields: {
            slug: {
              $cond: {
                if: { $eq: [{ $type: "$title" }, "string"] },
                then: {
                  $reduce: {
                    input: { $range: [0, { $strLenCP: "$title" }] },
                    initialValue: "",
                    in: {
                      $let: {
                        vars: {
                          char: { $substrCP: ["$title", "$$this", 1] },
                        },
                        in: {
                          $concat: [
                            "$$value",
                            {
                              $cond: [
                                {
                                  $regexMatch: {
                                    input: "$$char",
                                    regex: /[a-zA-Z0-9]/,
                                  },
                                },
                                { $toLower: "$$char" },
                                {
                                  $cond: [{ $eq: ["$$char", " "] }, "-", ""],
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
                else: "",
              },
            },
          },
        },
        {
          $addFields: {
            debugSlug: {
              $concat: [
                "Title: ",
                { $ifNull: ["$title", "N/A"] },
                " | Slug: ",
                { $ifNull: ["$slug", "N/A"] },
              ],
            },
          },
        },
        {
          $match: {
            slug: slugFromUrl,
          },
        },
      ])
      .toArray();

    // Log the debug information for each document
    result.forEach((doc) => console.log(doc.debugSlug));

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /books
router.post("/", async (req, res) => {
  // Logic to create a new book in the database

  try {
    let query = {
      title: req.body.title,
      author: req.body.author,
      series: req.body.series,
      description: req.body.description,
      booktalks: req.body.booktalks,
      characters: req.body.characters,
      characterlist: req.body.characterlist,
      image: req.body.image,
    };

    let collection = db.collection("newbooks");
    let result = await collection.insertOne(query);
    if (!result) {
      res.send("Not updated");
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// GET /books/bySeries/:name
router.get("/bySeries/:name", async (req, res) => {
  let collection = db.collection("newbooks");
  // Query modified to search by name instead of _id
  let query = { series: req.params.name };
  let results = await collection.find(query).toArray();

  if (!results) {
    res.send("Not found").status(404);
  } else {
    res.json(results);
    return; // Stop further execution
  }
});

// get book list by roadmaplist
router.get("/byRoadmap/:name", async (req, res) => {
  let collection = db.collection("newbooks");
  let query = { roadmaplist: req.params.name };
  let results = await collection.find(query).toArray();
  if (!results) {
    res.json("Not found").status(404);
  } else {
    res.json(results);
  }
});

// get book list by author
router.get("/byAuthor/:name", async (req, res) => {
  let collection = db.collection("newbooks");
  let query = { author: { $regex: new RegExp(`^${req.params.name}$`, "i") } };

  let results = await collection.find(query).toArray();
  if (!results) {
    res.send("Not found").status(404);
  } else {
    res.json(results);
  }
});

// get book list by genre
router.get("/byGenre/:name", async (req, res) => {
  let collection = db.collection("newbooks");

  let query = {
    $or: [
      { topics: { $in: [new RegExp(req.params.name, "i")] } },
      { include: { $in: [new RegExp(req.params.name, "i")] } },
    ],
  };

  let results = await collection.find(query).toArray();
  console.log(results);
  if (!results) {
    res.send("Not found").status(404);
  } else {
    res.json(results);
  }
});
// PUT /books/:id

// This section will update an existing record by id
router.put("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let updates = {
      $set: {
        title: req.body.title,
        author: req.body.author,
        series: req.body.series,
        ages: req.body.ages,
        pages: req.body.pages,
        lexile: req.body.lexile,
        description: req.body.description,
        audioscript: req.body.audioscript,
        roadmaplist: req.body.roadmaplist,
        topics: req.body.topics,
        booktalks: req.body.booktalks,
        characterlist: req.body.characterlist,
        keywordlist: req.body.keywordlist,
        image: req.body.image,
        relatedbooks: req.body.relatedbooks,
        amazon: req.body.amazon,
        booktopia: req.body.booktopia,
      },
    };
    let collection = await db.collection("newbooks");
    let result = await collection.updateOne(query, updates);
    if (result) {
      res.json(result);
    } else {
      res.send("Not found").status(404);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// DELETE /books/:id

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("newbooks");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

// add slug field to books
router.put("/addSlug/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let updates = {
      $set: {
        slug: req.body.slug,
      },
    };
    let collection = await db.collection("newbooks");
    let result = await collection.updateOne(query, updates);
    if (result) {
      res.json(result);
    } else {
      res.send("Not found").status(404);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// add slug field to all books
router.put("/addSlug", async (req, res) => {
  try {
    let collection = await db.collection("newbooks");
    let books = await collection.find({}).toArray();

    // Function to generate slug
    function generateSlug(title) {
      if (!title) return "";
      return title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    }

    for (let book of books) {
      let query = { _id: new ObjectId(book._id) };
      let updates = {
        $set: {
          slug: generateSlug(book.title),
        },
      };
      let result = await collection.updateOne(query, updates);
      console.log(`Updated book: ${book.title}`);
    }

    res.send("Updated all books").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

export default router;
