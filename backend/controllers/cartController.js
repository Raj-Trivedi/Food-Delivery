import CartItem from '../models/cartModel.js';
import Food from '../models/foodModel.js';

// Get all cart items for the logged-in user
export const getCart = async (req, res) => {
  try {
    const cart = await CartItem.find({ user: req.user.id }).populate('food');
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  try {
    let cartItem = await CartItem.findOne({ user: req.user.id, food: foodId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ user: req.user.id, food: foodId, quantity });
    }
    res.json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  try {
    const cartItem = await CartItem.findOneAndUpdate(
      { _id: cartItemId, user: req.user.id },
      { quantity },
      { new: true }
    );
    if (!cartItem) return res.status(404).json({ success: false, message: 'Cart item not found' });
    res.json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove cart item
export const removeCartItem = async (req, res) => {
  const { cartItemId } = req.body;
  try {
    const cartItem = await CartItem.findOneAndDelete({ _id: cartItemId, user: req.user.id });
    if (!cartItem) return res.status(404).json({ success: false, message: 'Cart item not found' });
    res.json({ success: true, message: 'Cart item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Clear all cart items for user
export const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user.id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 