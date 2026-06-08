const joi = require('joi');

const createPaymentIntentSchema = joi.object({
  amount: joi.number().positive().required()
    .messages({
      'number.base': 'Amount must be a number.',
      'number.positive': 'Amount must be a positive number.',
      'any.required': 'Amount is required.',
    }),
  currency: joi.string().length(3).optional(),
});

module.exports = { body: createPaymentIntentSchema };
