import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    if (isProduction) {
      // Fail fast: never boot a production server with a missing critical secret.
      // eslint-disable-next-line no-console
      console.error(`[FATAL] Required environment variable ${name} is not set. Refusing to start in production.`);
      process.exit(1);
    }
    return null;
  }
  return value;
}

const MONGO_URI = requireEnv('MONGO_URI');

// JWT_SECRET must never silently fall back to a hardcoded/guessable value in production
// (a forgeable token would grant owner-level access). In development, generate a random
// per-process secret if unset so local setup still works without extra config, but warn loudly.
let JWT_SECRET = requireEnv('JWT_SECRET');
if (!JWT_SECRET && !isProduction) {
  JWT_SECRET = crypto.randomBytes(32).toString('hex');
  // eslint-disable-next-line no-console
  console.warn('[WARN] JWT_SECRET is not set. Generated a temporary random secret for this process only — all existing tokens will be invalidated on restart. Set JWT_SECRET in backend/.env.');
}

export default {
  NODE_ENV,
  isProduction,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  ADMIN_REG_CODE: process.env.ADMIN_REG_CODE || ''
};
