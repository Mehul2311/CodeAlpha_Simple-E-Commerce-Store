import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<string> {
  const uri = process.env.MONGODB_URI;

  // Try external URI first if provided
  if (uri && !uri.includes('127.0.0.1') && !uri.includes('localhost')) {
    try {
      console.log(`Connecting to external MongoDB at ${uri.split('@')[1] || uri}...`);
      await mongoose.connect(uri);
      console.log('MongoDB connected successfully to external instance.');
      return uri;
    } catch (err) {
      console.warn('External MongoDB connection failed, falling back to embedded MongoMemoryServer:', (err as Error).message);
    }
  }

  // Fallback to embedded MongoMemoryServer for instant zero-config operation
  try {
    if (!mongoMemoryServer) {
      console.log('Initializing embedded MongoDB Memory Server for seamless local execution...');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'desikart'
        }
      });
    }
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`Embedded MongoDB connected successfully at ${memUri}`);
    return memUri;
  } catch (err) {
    console.error('Failed to initialize MongoDB Memory Server:', err);
    throw err;
  }
}

export async function closeDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
