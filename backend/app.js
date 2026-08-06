import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/upload.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(helmet());

// Logging (pino-http)
app.use(pinoHttp());

// Response standardization
import responseMiddleware from './middleware/responseMiddleware.js';
app.use(responseMiddleware);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: restrict using env var CORS_ORIGIN (comma-separated)
// If not provided, allow common local dev origins (3000/3001) and fallback to allow all.
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : [];
const defaultLocalOrigins = ['http://localhost:3000', 'http://localhost:3001'];
let corsOptions;
if (corsOrigins.length > 0) {
  corsOptions = {
    origin: function (origin, callback) {
      // allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (corsOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204
  };
} else {
  corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (defaultLocalOrigins.indexOf(origin) !== -1) return callback(null, true);
      // allow any origin in non-production by returning true — keep conservative for prod
      if ((process.env.NODE_ENV || 'development') !== 'production') return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204
  };
}

app.use(cors(corsOptions));

app.use(morgan('dev'));

// Basic rate limiter for all API requests (can be overridden per-route)
const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 300 });
app.use('/api', generalLimiter);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running successfully' });
});

// Readiness endpoint: checks DB connection
import mongoose from 'mongoose';
app.get('/api/ready', (req, res) => {
  const ready = mongoose.connection.readyState === 1; // 1 = connected
  if (ready) return res.json({ success: true, message: 'Ready' });
  return res.status(503).json({ success: false, message: 'Not ready' });
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
