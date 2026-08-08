import mongoose from 'mongoose';
import pino from 'pino';
import env from './env.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

async function connectDB() {
  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment');
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in newer mongoose versions
    });
    logger.info({ host: conn.connection.host }, 'MongoDB connected');
    return conn;
  } catch (error) {
    logger.error({ err: error }, 'Error connecting to MongoDB');
    throw error;
  }
}

export default connectDB;
