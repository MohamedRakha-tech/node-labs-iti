const APIError = require('../utils/APIERROR');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return next(new APIError(403, `Not authorized. Role(s) required: ${roles.join(', ')}.`));
    }
    next();
  };
};
