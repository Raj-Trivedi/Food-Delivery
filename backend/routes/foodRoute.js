import express from "express";
import { addFood, getAllFoods, deleteFood, updateFood, toggleInStock, getMyFoods } from "../controllers/foodController.js";
import multer from "multer"; //for image storing system
import { authenticateJWT } from '../middleware/authMiddleware.js';

const foodRouter = express.Router();
const storage=multer.diskStorage({
    destination:"upload",
    filename:(req,file,cb)=>{
        return  cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload=multer({storage:storage})

foodRouter.post("/add", authenticateJWT, upload.single("image"), addFood); // protected
foodRouter.get("/", getAllFoods); // public
foodRouter.delete('/:id', authenticateJWT, deleteFood); // protected
foodRouter.patch('/:id', authenticateJWT, upload.single('image'), updateFood); // protected
foodRouter.patch('/:id/toggle-instock', authenticateJWT, toggleInStock); // protected
foodRouter.get("/mine", authenticateJWT, getMyFoods); // seller's own food

// img storage engine

export {foodRouter}
