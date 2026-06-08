const joi=require('joi');

const donationSchema = joi.object({
  amount: joi.number().positive().required()
    .messages({
      'number.base': 'Amount must be a number.',
      'number.positive': 'Amount must be a positive number.',
      'any.required': 'Amount is required.'
    })
});

module.exports = { body: donationSchema };

