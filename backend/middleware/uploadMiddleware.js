import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Resolve upload dir relative to this file to avoid duplicated paths (backend/backend/...)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'products');

// Ensure upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configurable max file size (bytes) via env, default 5MB
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Allowed: jpg, jpeg, png, webp'));
  }
}

const limits = { fileSize: MAX_FILE_SIZE };

function singleUpload(fieldName) {
  const upload = multer({ storage, fileFilter, limits }).single(fieldName);
  return (req, res, next) => upload(req, res, next);
}

function multipleUpload(fieldName, maxCount = 10) {
  // Explicitly expect field name 'images' in our API; callers may still pass another name
  const upload = multer({ storage, fileFilter, limits }).array(fieldName, maxCount);
  return (req, res, next) => upload(req, res, next);
}

export { singleUpload, multipleUpload, MAX_FILE_SIZE };
