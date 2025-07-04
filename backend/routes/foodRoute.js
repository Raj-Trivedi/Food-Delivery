import express from "express";
import { addFood, getAllFoods, deleteFood, updateFood, toggleInStock } from "../controllers/foodController.js";

import multer from "multer"; //for image storing system


const foodRouter = express.Router();
const storage=multer.diskStorage({
    destination:"upload",
    filename:(req,file,cb)=>{
        return  cb(null,`${Date.now()}${file.originalname}`)

    }
})

const upload=multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood); // for collecting data from body(form etc)
foodRouter.get("/", getAllFoods); // for getting all food items
foodRouter.delete('/:id', deleteFood);
foodRouter.patch('/:id', updateFood);
foodRouter.patch('/:id/toggle-instock', toggleInStock);

// img storage engine




export {foodRouter}
