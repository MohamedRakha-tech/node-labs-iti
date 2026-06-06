const APIError = require('../utils/APIERROR');

module.exports = (schema) => {
  return (req, res, next) => {
    const validations = ['body', 'params', 'query', 'headers'];
    const errors = [];

    for (const key of validations) {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
          allowUnknown: false
        });
        if (error) {
          error.details.forEach((err) => {
            errors.push({
              field: err.path.join('.'),
              message: err.message
            });
          });
        } else {
          req[key] = value;
        }
      }
    }

    if (errors.length > 0) {
      const apiError = new APIError(422, 'Validation failed.');
      apiError.data = errors;
      return next(apiError);
    }
    next();
  };
};
