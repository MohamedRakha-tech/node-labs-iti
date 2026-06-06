const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');
const APIError = require('./utils/APIERROR');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many auth attempts from this IP.'
});

app.use(helmet());
app.use(mongoSanitize());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use('/auth', authLimiter);
app.use(limiter);

// routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

// 404 Not Found fallback
app.use((req, res, next) => {
  next(new APIError(404, 'Page or endpoint not found.'));
});

// Global Error Handler middleware
app.use(errorHandler);

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Exiting.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
