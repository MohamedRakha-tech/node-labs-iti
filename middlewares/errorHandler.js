const APIError = require('../utils/APIERROR');

module.exports = (err, req, res, next) => {
  console.error('[Error Handler Middleware]:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: 'error', message: err.message });
  }

  if (err.code === 11000) {
    const message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, value: ${Object.values(err.keyValue)}`;
    return res.status(400).json({ status: 'error', message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ status: 'error', message: err.message });
  }

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      data: err.data || null,
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message || 'something went wrong',
      data: err.data || null,
    });
  }

  res.status(500).json({ status: 'error', message: 'something went wrong' });
};
