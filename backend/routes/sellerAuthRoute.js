import express from 'express';
import { sellerSignup, sellerLogin, getSellerProfile } from '../controllers/sellerAuthController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', sellerSignup);
router.post('/login', sellerLogin);
router.get('/profile', authenticateJWT, getSellerProfile);

export default router; 