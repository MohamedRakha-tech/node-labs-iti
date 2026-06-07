const User = require('../models/user');
const APIError = require('../utils/APIERROR');
const validator = require('./validator');
const authSchemas = require('../validators/auth');

exports.validateSignup = [
  validator(authSchemas.signup),
  async (req, res, next) => {
    try {
      const userDoc = await User.findOne({ email: req.body.email });
      if (userDoc) {
        const apiError = new APIError(422, 'Validation failed.');
        apiError.data = [{ field: 'email', msg: 'E-Mail address already exists!' }];
        return next(apiError);
      }
      next();
    } catch (err) {
      next(err);
    }
  }
];

exports.validateLogin = validator(authSchemas.login);