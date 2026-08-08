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

// Extension whitelisting alone trusts the client-supplied filename. Verify the file's
// actual magic bytes match a real image so a mislabeled/malicious file can't be stored
// and later served from /uploads.
const SIGNATURES = [
  { ext: ['.jpg', '.jpeg'], check: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: ['.png'], check: (b) => b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, i) => b[i] === byte) },
  { ext: ['.webp'], check: (b) => b.length >= 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP' }
];

function verifyImageSignature(filePath, ext) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, 0);
    const rule = SIGNATURES.find((s) => s.ext.includes(ext));
    return rule ? rule.check(buf) : false;
  } finally {
    fs.closeSync(fd);
  }
}

function verifyUploadedSignatures(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!verifyImageSignature(file.path, ext)) {
      // Clean up every file from this request before rejecting.
      for (const f of files) {
        fs.unlink(f.path, () => {});
      }
      return res.status(400).json({ success: false, message: 'Invalid file content — file does not match a supported image format.' });
    }
  }
  next();
}

function singleUpload(fieldName) {
  const upload = multer({ storage, fileFilter, limits }).single(fieldName);
  return (req, res, next) => upload(req, res, (err) => {
    if (err) return next(err);
    verifyUploadedSignatures(req, res, next);
  });
}

function multipleUpload(fieldName, maxCount = 10) {
  // Explicitly expect field name 'images' in our API; callers may still pass another name
  const upload = multer({ storage, fileFilter, limits }).array(fieldName, maxCount);
  return (req, res, next) => upload(req, res, (err) => {
    if (err) return next(err);
    verifyUploadedSignatures(req, res, next);
  });
}

export { singleUpload, multipleUpload, MAX_FILE_SIZE };
