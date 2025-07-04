import orderModel from "../models/orderModel.js";

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { user, items, total } = req.body;
    const order = new orderModel({ user, items, total });
    await order.save();
    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

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

export { createOrder, getAllOrders, getUserOrders, updateOrderStatus, deleteOrder }; 