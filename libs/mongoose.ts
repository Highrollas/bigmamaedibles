/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
}

// Module-level cache (shared within a single serverless instance)
let cached = (global as any).mongoose;

if (!cached) {
      cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
      if (cached.conn) {
            return cached.conn;
      }

      if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI!, {
                  bufferCommands: false,
            }).then((mongoose) => {
                  console.log('✅ MongoDB connected');
                  return mongoose;
            }).catch((err) => {
                  console.error('❌ MongoDB connection error:', err);
                  throw err;
            });
      }

      cached.conn = await cached.promise;
      return cached.conn;
}

export default dbConnect;
