import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, getCart);
router.post('/add', authenticateJWT, addToCart);
router.put('/update', authenticateJWT, updateCartItem);
router.delete('/remove', authenticateJWT, removeCartItem);
router.delete('/clear', authenticateJWT, clearCart);

export default router; 