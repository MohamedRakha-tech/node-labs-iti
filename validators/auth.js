const Joi = require('joi');

const signupSchema = {
  body: Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': 'Name must not be empty.',
      'any.required': 'Name is required.'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email.',
      'any.required': 'Email is required.'
    }),
    password: Joi.string().min(6).trim().required().messages({
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password must match password.',
      'any.required': 'Confirm password is required.'
    })
  }).unknown(false)
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email.',
      'any.required': 'Email is required.'
    }),
    password: Joi.string().trim().required().messages({
      'string.empty': 'Password must not be empty.',
      'any.required': 'Password is required.'
    })
  }).unknown(false)
};

module.exports = {
  signup: signupSchema,
  login: loginSchema
};
