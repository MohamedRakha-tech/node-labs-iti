const User = require('../models/user');
const APIError = require('../utils/APIERROR');

exports.checkEmailExists = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      const apiError = new APIError(422, 'Validation failed.');
      apiError.data = [{ field: 'email', msg: 'E-Mail address already exists!' }];
      return next(apiError);
    }
    next();
  } catch (err) {
    next(err);
  }
};

exports.checkEmailExistsForUpdate = async (req, res, next) => {
  try {
    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser._id.toString() !== req.params.userId) {
        const apiError = new APIError(422, 'Validation failed.');
        apiError.data = [{ field: 'email', msg: 'E-Mail address already exists!' }];
        return next(apiError);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};
