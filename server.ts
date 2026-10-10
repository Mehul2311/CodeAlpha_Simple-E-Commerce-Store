import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './server/config/db.js';
import { Product } from './server/models/Product.js';
import { seedDatabase } from './server/seed/seeder.js';
import authRoutes from './server/routes/authRoutes.js';
import productRoutes from './server/routes/productRoutes.js';
import cartRoutes from './server/routes/cartRoutes.js';
import orderRoutes from './server/routes/orderRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import { errorHandler } from './server/middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// CORS setup
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Logging
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Body and Cookie Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting for Auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'DesiKart',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// ZIP Download endpoint
app.get(['/desikart.zip', '/download-zip'], (req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'client/desikart.zip');
  res.download(zipPath, 'desikart-source-code.zip');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Static client assets
app.use('/client', express.static(path.resolve(__dirname, 'client')));

// Error handling middleware for API
app.use('/api', errorHandler);

async function startServer() {
  try {
    // Connect to MongoDB (auto starts MongoMemoryServer if no local mongo)
    await connectDB();

    // Check if database needs seeding
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Database empty on startup. Auto-seeding initial Indian catalogue and demo users...');
      await seedDatabase(false);
    } else {
      console.log(`Database ready with ${productCount} products.`);
    }

    if (!isProduction) {
      // Dev mode: Mount Vite middleware
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR !== 'true'
        },
        appType: 'spa'
      });
      app.use(vite.middlewares);
      console.log('Vite middleware mounted for development.');
    } else {
      // Production mode: Serve built dist folder
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🇮🇳 DesiKart Server running proudly on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
}

startServer();
