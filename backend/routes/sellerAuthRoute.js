import express from 'express';
import { sellerSignup, sellerLogin, getSellerProfile, verifyOTP, resendOTP } from '../controllers/sellerAuthController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', sellerSignup);
router.post('/login', sellerLogin);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/profile', authenticateJWT, getSellerProfile);

export default router;