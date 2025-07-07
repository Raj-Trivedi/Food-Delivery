import express from 'express';
import { getReviewsForFood, addReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:foodId', getReviewsForFood);
router.post('/add', authenticateJWT, addReview);
router.put('/update', authenticateJWT, updateReview);
router.delete('/delete', authenticateJWT, deleteReview);

export default router; 