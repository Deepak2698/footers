import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './config/env.js';
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

// Strip any keys starting with '$' or containing '.' from req.body/params/query
// to prevent NoSQL operator injection (e.g. ?category[$ne]=1).
app.use(mongoSanitize());

// CORS: restrict using env var CORS_ORIGIN (comma-separated). Local dev origins are
// always allowed for convenience; there is no environment-gated "allow any origin"
// escape hatch, since a misconfigured NODE_ENV in production must never open CORS wide.
const configuredOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map(s => s.trim()) : [];
const defaultLocalOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const allowedOrigins = [...new Set([...configuredOrigins, ...defaultLocalOrigins])];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204
};

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
