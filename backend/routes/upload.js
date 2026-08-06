import express from 'express';
import { multipleUpload } from '../middleware/uploadMiddleware.js';
import { uploadImages } from '../controllers/uploadController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Per-route limiter for uploads to reduce abuse
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many upload requests, please try later' } });

// Accepts form-data field `images` (multiple)
// Protected: only staff/owner should upload product images
router.post('/', protect, authorizeRoles('owner','staff'), uploadLimiter, multipleUpload('images', 10), uploadImages);

export default router;
