const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/donations');

exports.createPaymentIntent = async (amount, currency, email, userId) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency || 'usd',
    receipt_email: email,
    metadata: { userId },
  });

  const donation = await Donation.create({
    amount,
    email,
    user: userId,
    currency: currency || 'usd',
    providerSessionId: paymentIntent.id,
    link: paymentIntent.client_secret,
  });

  return { clientSecret: paymentIntent.client_secret, donationId: donation._id };
};

exports.handleWebhook = async (payload, sig) => {
  const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Donation.findOneAndUpdate(
      { providerSessionId: paymentIntent.id },
      { status: 'completed' }
    );
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await Donation.findOneAndUpdate(
      { providerSessionId: paymentIntent.id },
      { status: 'failed' }
    );
  }

  return event;
};
