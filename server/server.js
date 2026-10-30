const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middleware/errorHandler');
const Product = require('./models/Product');
const { seedDatabase } = require('./seed/seedData');

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow 3D CDN assets and images from Unsplash
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Limit auth attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/health', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'EcoSphere API',
    tagline: 'Shop better. Impact the planet less.',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Centralized Error Handler (must be after routes)
app.use(errorHandler);

// Database Connection with in-memory fallback
let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecosphere';

  try {
    console.log(`Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connection established successfully.');
  } catch (err) {
    console.warn(`Local/Remote MongoDB connection failed (${err.message}).`);
    console.log('Spinning up embedded MongoDB instance via mongodb-memory-server...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      console.log(`Embedded MongoDB started at: ${memUri}`);
      await mongoose.connect(memUri);
      console.log('Connected to embedded MongoDB.');
    } catch (memErr) {
      console.error('Failed to initialize embedded MongoDB:', memErr);
      throw memErr;
    }
  }

  // Check if database needs seeding
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('Database is empty. Automatically seeding initial data...');
    await seedDatabase();
  } else {
    console.log(`Database contains ${count} products.`);
  }
};

const PORT = process.env.PORT || 5000;

let server;

// Only start listening if run directly (not required in tests)
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`===============================================`);
        console.log(`EcoSphere Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`API URL: http://localhost:${PORT}/api`);
        console.log(`Health Check: http://localhost:${PORT}/api/health`);
        console.log(`===============================================`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
}

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) server.close();
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
  process.exit(0);
});

module.exports = { app, connectDB };
