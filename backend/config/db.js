import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment');
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in newer mongoose versions
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
}

export default connectDB;
