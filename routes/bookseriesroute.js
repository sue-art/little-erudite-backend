import express from "express";
import bookseriesController from "../controller/bookseriescontroller.js";

import multer from "multer";

// Image Upload setting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/series");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", bookseriesController.getAllBookSeries);
router.post("/add-bookseries", bookseriesController.createBookSeries);
export default router;
