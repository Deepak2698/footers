import express from 'express';
import { login, logout, profile, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateSchema from '../middleware/validateMiddleware.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/login', authLimiter, validateSchema(loginSchema), login);
// Register (create user) — allows creating staff; owner creation requires ADMIN_REG_CODE env var
router.post('/register', authLimiter, validateSchema(registerSchema), register);
router.post('/logout', protect, logout);
router.get('/profile', protect, profile);

export default router;
