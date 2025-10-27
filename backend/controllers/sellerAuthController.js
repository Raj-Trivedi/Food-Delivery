import Seller from '../models/sellerModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/mailer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/seller/signup
export const sellerSignup = async (req, res) => {
  try {
    const { name, email, password, phone, restaurantName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    let seller = await Seller.findOne({ email });

    // If verified account already exists, block
    if (seller && seller.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (seller) {
      // Update existing unverified seller
      if (password) seller.password = await bcrypt.hash(password, 10);
      seller.name = name || seller.name;
      seller.otp = otp;
      seller.otpExpires = otpExpires;
      // store optional fields if your schema supports them in future
      seller = await seller.save();
    } else {
      const hashed = await bcrypt.hash(password, 10);
      seller = await Seller.create({ name, email, password: hashed, isVerified: false, otp, otpExpires });
    }

    try {
      await sendOtpEmail(email, otp);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Check MAIL_USER/MAIL_PASS' });
    }

    return res.status(201).json({ success: true, message: 'OTP sent to your email. Verify to complete signup.', email });
  } catch (error) {
    console.error('sellerSignup error:', error);
    return res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// POST /api/seller/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    if (seller.isVerified) return res.status(400).json({ success: false, message: 'Already verified' });

    if (!seller.otp || seller.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (!seller.otpExpires || seller.otpExpires < new Date()) return res.status(400).json({ success: false, message: 'OTP expired' });

    seller.isVerified = true;
    seller.otp = undefined;
    seller.otpExpires = undefined;
    await seller.save();

    const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Email verified successfully', token, seller: { id: seller._id, name: seller.name, email: seller.email, isVerified: true } });
  } catch (error) {
    console.error('verifyOTP error:', error);
    return res.status(500).json({ success: false, message: 'Server error during OTP verification' });
  }
};

// POST /api/seller/resend-otp
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    if (seller.isVerified) return res.status(400).json({ success: false, message: 'Email is already verified' });

    const otp = generateOtp();
    seller.otp = otp;
    seller.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await seller.save();

    try {
      await sendOtpEmail(email, otp);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Check MAIL_USER/MAIL_PASS' });
    }

    return res.json({ success: true, message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('resendOTP error:', error);
    return res.status(500).json({ success: false, message: 'Server error while resending OTP' });
  }
};

// POST /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    if (!seller.isVerified) {
      return res.status(403).json({ success: false, message: 'Email not verified', error: 'EMAIL_NOT_VERIFIED', email });
    }

    const match = await bcrypt.compare(password, seller.password);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token, seller: { id: seller._id, name: seller.name, email: seller.email, isVerified: seller.isVerified } });
  } catch (error) {
    console.error('sellerLogin error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// GET /api/seller/profile
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select('-password -otp');
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    return res.json({ success: true, seller });
  } catch (error) {
    console.error('getSellerProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch seller profile' });
  }
};