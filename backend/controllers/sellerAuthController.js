import Seller from '../models/sellerModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const sellerSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Seller.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const seller = new Seller({ name, email, password: hashed });
    await seller.save();
    const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, seller: { id: seller._id, name: seller.name, email: seller.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, seller.password);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, seller: { id: seller._id, name: seller.name, email: seller.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select('-password');
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }
    res.json({ success: true, seller });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch seller profile' });
  }
}; 