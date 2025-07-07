import express from 'express';
import { placeOrder, getMyOrders, getAllOrders, getSellerOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const orderRoute = express.Router();

orderRoute.post('/', authenticateJWT, placeOrder);
orderRoute.get('/myorder', authenticateJWT, getMyOrders);
orderRoute.get('/all', getAllOrders); // for admin
orderRoute.post('/add', authenticateJWT, placeOrder);
orderRoute.get('/seller-orders', authenticateJWT, getSellerOrders);
orderRoute.patch('/:id', authenticateJWT, updateOrderStatus);

export default orderRoute;