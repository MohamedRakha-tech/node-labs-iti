const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');
const APIError = require('./utils/APIERROR');
const cors = require('cors');
const app = express();

// Security middleware
const hpp = require('hpp');
const helmet = require('helmet');
const { limiter, authLimiter } = require('./middlewares/ratelimiter');

app.use(hpp());
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use('/auth', authLimiter);
app.use(limiter);
app.use(express.static('public'));

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

// Enable built-in NoSQL injection protection in Mongoose
mongoose.set('sanitizeFilter', true);

const { initialize: initSocketIO } = require('./services/socket');

mongoose
  .connect(MONGODB_URI ,{
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    w: 'majority'
  })
  .then(() => {
    console.log('Connected to MongoDB!');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    let socketIO = initSocketIO(server);

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
