const Joi = require('joi');

const idParamSchema = Joi.object({
  userId: Joi.string().length(24).hex().required().messages({
    'string.length': 'ID must be 24 characters long.',
    'string.hex':    'ID must be a valid hex string.',
    'any.required':  'ID is required.'
  })
}).unknown(false);

const createUserBodySchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name must be at most 30 characters long.',
    'any.required': 'Name is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required.'
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.min': 'Password must be at least 6 characters long.',
    'string.max': 'Password must be at most 30 characters long.',
    'any.required': 'Password is required.'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password.',
    'any.required': 'Confirm password is required.'
  })
}).unknown(false);

const updateUserBodySchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name must be at most 30 characters long.',
    'any.required': 'Name is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required.'
  })
}).unknown(false);

module.exports = {
  createUser: { body: createUserBodySchema },
  updateUser: { params: idParamSchema, body: updateUserBodySchema },
  getUser:    { params: idParamSchema },
  deleteUser: { params: idParamSchema },
  getAllUsers: {
    query: Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional()
    }).unknown(false)
  }
};
