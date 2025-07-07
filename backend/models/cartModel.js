import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
  quantity: { type: Number, required: true, default: 1 },
}, { timestamps: true });

const CartItem = mongoose.models.cartitem || mongoose.model('cartitem', cartItemSchema);

export default CartItem; 