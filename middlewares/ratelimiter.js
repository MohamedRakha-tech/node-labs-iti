const rateLimit = require('express-rate-limit');
const APIError = require('../utils/APIERROR');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    next(new APIError(429, 'Too many requests from this IP.'));
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler: (req, res, next) => {
    next(new APIError(429, 'Too many auth attempts from this IP.'));
  }
});

module.exports = {
  limiter,
  authLimiter
};
