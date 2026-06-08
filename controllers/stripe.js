const stripeService = require('../services/stripeService');
const { successResponse } = require('../utils/helpers');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;
    const result = await stripeService.createPaymentIntent(
      amount,
      currency,
      req.userEmail,
      req.userId
    );
    res.status(201).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

exports.webhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = await stripeService.handleWebhook(req.body, sig);
    res.status(200).json(successResponse({ received: true, type: event.type }));
  } catch (err) {
    next(err);
  }
};
