const jwt = require('jsonwebtoken');
const APIError = require('../utils/APIERROR');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new APIError(401, 'Not authenticated. Authorization header missing or invalid.'));
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new APIError(401, 'Not authenticated. Invalid or expired token.'));
  }

  req.userId = decodedToken.userId;
  req.userRole = decodedToken.role;
  req.userEmail = decodedToken.email;
  next();
};
