import express from "express";
import bookserisesModel from "../models/seriesmodel.js";
import db from "../db/connection.js";

export class BookSeriesController {
  async getAllBookSeries(req, res) {
    try {
      let collection = await db.collection("bookseries");
      let results = await collection.find({}).toArray();
      //const bookSeries = await bookserisesModel.find();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getBookSeriesById(req, res) {
    try {
      const bookSeries = await bookserisesModel.findById(req.params.id);
      if (!bookSeries) {
        return res.status(404).json({ error: "Book series not found" });
      }
      res.json(bookSeries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createBookSeries(req, res) {
    try {
      const { id, name, author, image, color, search, description } = req.body;
      const bookSeries = new bookserisesModel({
        id,
        name,
        author,
        image,
        color,
        search,
        description,
      });
      await bookSeries.save();
      res.status(201).json(bookSeries);
      console.log("Book series created successfully");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.log("Internal server error");
    }
  }

  async updateBookSeries(req, res) {
    try {
      const { name, author, genre } = req.body;
      const bookSeries = await bookserisesModel.findByIdAndUpdate(
        req.params.id,
        { name, author, genre },
        { new: true }
      );
      if (!bookSeries) {
        return res.status(404).json({ error: "Book series not found" });
      }
      res.json(bookSeries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteBookSeries(req, res) {
    try {
      const bookSeries = await bookserisesModel.findByIdAndDelete(
        req.params.id
      );
      if (!bookSeries) {
        return res.status(404).json({ error: "Book series not found" });
      }
      res.json({ message: "Book series deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const bookseriesController = new BookSeriesController();
export default bookseriesController;

// Compare this snippet from backend/routes/bookseriesroutes.js:
// import express from "express";
// import bookSeriesController from "../controllers/bookSeriesController.js";
//
