import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    Dietary: {
        type: String,
        required: true,
        enum: ['Veg', 'Non Veg']
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller',
        required: true
    },
});

const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

export default foodModel;