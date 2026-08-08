import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024;

export function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err, req, res, next) { // eslint-disable-line
  if (req && req.log && typeof req.log.error === 'function') {
    req.log.error(err);
  } else {
    console.error(err);
  }

  // Multer errors
  if (err instanceof multer.MulterError) {
    // Provide a clear, consistent response for multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      const mb = Math.round((MAX_FILE_SIZE / (1024 * 1024)) * 100) / 100;
      return res.status(400).json({ success: false, message: `File too large. Max size is ${mb} MB.`, field: err.field || 'file' });
    }
    return res.status(400).json({ success: false, message: err.message || 'File upload error', field: err.field || 'file' });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }

  // Mongoose cast errors (invalid ObjectId, wrong type for a field/query param, etc.)
  // — a client mistake, not a server failure, so this must be a 400, not a 500.
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid value for field \`${err.path}\`` });
  }

  // MongoServerError (duplicate keys, etc.)
  if (err.name === 'MongoServerError' || err.code === 11000) {
    const msg = err.message || 'Database error';
    return res.status(400).json({ success: false, message: msg });
  }

  // Generic errors
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = process.env.NODE_ENV === 'production' ? (err.publicMessage || 'Server Error') : (err.message || 'Server Error');
  res.status(statusCode).json({ success: false, message });
}
