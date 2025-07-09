// importFoodList.cjs
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
console.log('Current working directory:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI not set in environment variables!');
}

// Define Food schema (adjust fields as needed)
const foodSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  category: String,
  Dietary: String,
  seller: String,
});

const Food = mongoose.model('Food', foodSchema);

async function importFoodList() {
  try {
    // Read food_list.json
    const filePath = path.resolve(__dirname, '../../food_list.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const foodList = JSON.parse(data);

    if (!Array.isArray(foodList)) {
      throw new Error('food_list.json is not an array');
    }

    // Upsert each item (by name)
    const upsertPromises = foodList.map(item =>
      Food.updateOne(
        { name: item.name },
        { $set: item },
        { upsert: true }
      )
    );
    await Promise.all(upsertPromises);
    console.log(`Successfully imported/updated ${foodList.length} food items.`);
  } catch (err) {
    console.error('Error importing food list:', err);
  } finally {
    mongoose.disconnect();
  }
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Current working directory:', process.cwd());
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    importFoodList();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 