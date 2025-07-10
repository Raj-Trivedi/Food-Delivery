import foodModel from "../models/foodModel.js";

import fs from 'fs';


// add food item
const addFood = async (req,res)=>{
      console.log("req.file", req.file);  // check if multer actually added the file

    if (!req.file) {
  return res.status(400).json({ success: false, message: "No image uploaded" });
}

 let image_fileName= `/upload/${req.file.filename}`; // getting image file name from request

 
 
 const food= new foodModel({ // creating a new food item
    // req.body is used to get data from the body of the request
    
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: image_fileName,
    category: req.body.category,
    Dietary: req.body.Dietary,
    seller: req.user.id // associate food with seller
 });
    try {
        await food.save(); // saving the food item to the database
        res.json({ success:true ,message: "Food item added successfully"}); // sending success response
        } catch (error) {
        console.log(error);
        res.json({success:false , message: "Error adding food item"}); // sending error response
    }


 

   
}

// Get all food items
const getAllFoods = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching food items" });
  }
};

// Get all food items for the logged-in seller
const getMyFoods = async (req, res) => {
  try {
    const foods = await foodModel.find({ seller: req.user.id });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching your food items" });
  }
};

// Delete food item
const deleteFood = async (req, res) => {
  try {
    await foodModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting food item' });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    let update = req.body;
    // If an image was uploaded, update the image field
    if (req.file) {
      update = { ...update, image: `/upload/${req.file.filename}` };
      // Optionally: delete old image file
      const food = await foodModel.findById(req.params.id);
      if (food && food.image && food.image !== `/upload/${req.file.filename}`) {
        const oldPath = food.image.substring(1); // Remove leading slash
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }
    // Ensure Dietary field is included in update
    if (req.body.Dietary) {
      update.Dietary = req.body.Dietary;
    }
    const food = await foodModel.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, message: 'Food item updated', food });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating food item' });
  }
};

// Toggle inStock
const toggleInStock = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    food.inStock = !food.inStock;
    await food.save();
    res.json({ success: true, message: 'inStock status toggled', food });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling inStock' });
  }
};

export {addFood, getAllFoods, deleteFood, updateFood, toggleInStock, getMyFoods};