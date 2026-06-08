const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe');
const isAuth = require('../middlewares/is-auth');
const validator = require('../middlewares/validator');
const stripeSchemas = require('../validators/stripe');

router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.webhook);
router.post('/create-payment-intent', express.json(), isAuth, validator(stripeSchemas), stripeController.createPaymentIntent);

module.exports = router;
