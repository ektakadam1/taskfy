import mongoose from 'mongoose';
import { ENV } from '../config/env.js';

let _connected = false;

export const connectDB = async () => {
  if (!ENV.MONGODB_URI) {
    console.warn('MONGODB_URI not set — using in-memory fallback.');
    _connected = false;
    return;
  }
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('✅ MongoDB connected');
    _connected = true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message || err);
    _connected = false;
  }
};

export const isDbConnected = () => _connected;
