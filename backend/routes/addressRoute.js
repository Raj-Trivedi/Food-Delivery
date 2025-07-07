import express from 'express';
import { getAddress, addOrUpdateAddress, deleteAddress } from '../controllers/addressController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, getAddress);
router.post('/save', authenticateJWT, addOrUpdateAddress);
router.delete('/delete', authenticateJWT, deleteAddress);

export default router; 