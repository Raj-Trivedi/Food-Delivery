import orderModel from "../models/orderModel.js";
import Food from '../models/foodModel.js';

// Place a new order (for logged-in user)
export const placeOrder = async (req, res) => {
  console.log('placeOrder called', req.user, req.body); // Debug log
  try {
    const { items, total } = req.body;
    // For each item, fetch the food and set the seller field
    const itemsWithSeller = await Promise.all(items.map(async (item) => {
      const food = await Food.findById(item.foodId);
      if (!food) {
        console.error('Food not found for foodId:', item.foodId);
        throw new Error('Food not found');
      }
      return {
        ...item,
        seller: food.seller
      };
    }));
    const order = await orderModel.create({
      user: req.user.id,
      items: itemsWithSeller,
      total,
    });
    console.log('Order created:', order);
    res.json({ success: true, order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all orders for the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user.id }).populate('items.foodId');
    res.json({ success: true, orders });
  } catch (err) {
    console.error('getMyOrders error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// (Admin) Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate('user', 'name email').populate('items.food');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// // Get all orders (admin)
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching orders" });
//   }
// };

// Get orders for a specific user
const getUserOrders = async (req, res) => {
  try {
    const { user } = req.params;
    const orders = await orderModel.find({ user }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order status" });
  }
};

// Delete/cancel order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    // Find all orders that have at least one item for this seller
    const orders = await orderModel.find({ 'items.seller': req.user.id })
      .populate('user', 'name email')
      .populate('items.foodId');
    // Filter each order's items to only those for this seller
    const sellerOrders = orders.map(order => ({
      _id: order._id,
      buyer: order.user,
      createdAt: order.createdAt,
      status: order.status,
      items: order.items.filter(item => item.seller.toString() === req.user.id),
      total: order.total
    })).filter(order => order.items.length > 0);
    res.json({ success: true, orders: sellerOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getUserOrders, updateOrderStatus, deleteOrder }; 