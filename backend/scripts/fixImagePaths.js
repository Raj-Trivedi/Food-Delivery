import mongoose from 'mongoose';
import foodModel from '../models/foodModel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fixImagePaths() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all food items where image doesn't start with /upload/ and doesn't start with /assets/
    const foods = await foodModel.find({
      $and: [
        { image: { $not: /^\/upload\// } },
        { image: { $not: /^\/assets\// } }
      ]
    });

    console.log(`Found ${foods.length} food items with incorrect image paths`);

    for (const food of foods) {
      // Only fix if it's a filename without path (not a static asset)
      if (food.image && !food.image.includes('/')) {
        const updatedImage = `/upload/${food.image}`;
        await foodModel.findByIdAndUpdate(food._id, { image: updatedImage });
        console.log(`Updated ${food.name}: ${food.image} -> ${updatedImage}`);
      }
    }

    console.log('Image path fix completed!');
  } catch (error) {
    console.error('Error fixing image paths:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixImagePaths(); 