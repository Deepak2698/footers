import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import pino from 'pino';

dotenv.config();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'Server started');
    });

    const shutdown = async (signal) => {
      try {
        logger.info({ signal }, 'Shutdown initiated');
        server.close(async (err) => {
          if (err) logger.error(err, 'Server close error');
          try {
            await mongoose.connection.close(false);
            logger.info('Mongo connection closed');
            process.exit(0);
          } catch (closeErr) {
            logger.error(closeErr, 'Error closing Mongo connection');
            process.exit(1);
          }
        });
      } catch (e) {
        logger.error(e, 'Shutdown failure');
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error({ port: PORT }, `Port ${PORT} is already in use. Please free the port or change PORT in .env`);
      } else {
        logger.error(err, 'Server error');
      }
      process.exit(1);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
