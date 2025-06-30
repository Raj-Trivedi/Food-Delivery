import express from "express";
import { addFood } from "../controllers/foodController.js";
import multer from "multer"; // for image storing system 

const foodRouter = express.Router();

//Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads/", // Destination to store image
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`); // Appending extension
  },
});

const upload = multer({ storage: storage }); // Upload variable

foodRouter.post("/add", upload.single("image") ,addFood); //for collecting data from the frontend


export { foodRouter };