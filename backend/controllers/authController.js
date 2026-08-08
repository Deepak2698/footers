import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.json({ success: true, token, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  // For stateless JWTs, logout can be handled client-side by deleting token.
  // Optionally implement token blacklist. Here we simply respond success.
  res.json({ success: true, message: 'Logged out' });
};

export const profile = async (req, res, next) => {
  try {
    // authMiddleware attaches req.user
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminCode } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'User already exists' });

    let finalRole = role === 'owner' ? 'owner' : 'staff';
    if (finalRole === 'owner') {
      // owner creation requires ADMIN_REG_CODE env var to match
      const ADMIN_REG_CODE = env.ADMIN_REG_CODE;
      if (!ADMIN_REG_CODE) return res.status(403).json({ success: false, message: 'Owner registration is disabled' });
      if (!adminCode || adminCode !== ADMIN_REG_CODE) return res.status(403).json({ success: false, message: 'Invalid admin registration code' });
    }

    const user = new User({ name, email: email.toLowerCase(), password, role: finalRole });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ success: true, token, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};
