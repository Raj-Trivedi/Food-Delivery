import foodModel from "../models/foodModel.js";

import fs from 'fs';

//add food items
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    // Create a new food item
    // req.body is used to get the data from the frontend
    const food = new foodModel({               
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    }); 

    // Save the food item to the database
    try {
        await food.save(); 
        res.json({success: true, message: "Food item added successfully"}); // Send success response
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Failed to add food item" });    // Send error responses               
    }
}

export { addFood };