const { doubleCsrf } = require('csrf-csrf');
const APIError = require('../utils/APIERROR');

const {
  generateToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.JWT_SECRET,
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64,
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return next(new APIError(403, 'Invalid CSRF token.'));
  }
  next(err);
};

module.exports = { generateToken, doubleCsrfProtection, csrfErrorHandler };
