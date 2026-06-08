const Donation = require('../models/donations');
const axios = require('axios');

exports.createDonation = async (amount, email, userId) => {
  const donation = await Donation.create({ amount, email, user: userId });
  return donation;
};

exports.updateDonation = async (id, data) => {
  const donation = await Donation.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  return donation;
};

exports.createPaymentLink = async (donation) => {
  const response = await axios.post(
    'https://test-api.kashier.io/v3/payment/sessions',
    {
      maxFailureAttempts: 3,
      paymentType: 'credit',
      amount: donation.amount.toString(),
      currency: 'EGP',
      order: donation._id,
      merchantRedirect: 'https://example.com/redirect',
      display: 'en',
      type: 'one-time',
      allowedMethods: 'card,wallet',
      redirectMethod: null,
      iframeBackgroundColor: '#FFFFFF',
      metaData: { customKey: 'customValue', displayNotes: { key: 'value' } },
      merchantId: process.env.KASHIER_MERCHANT_ID,
      failureRedirect: false,
      brandColor: '#33e7ffff',
      defaultMethod: 'card',
      description: 'Payment for order ORD123456',
      manualCapture: false,
      saveCard: null,
      retrieveSavedCard: true,
      interactionSource: 'ECOMMERCE',
      enable3DS: true,
      serverWebhook: process.env.KASHIER_WEBHOOK_URL,
    },
    {
      headers: {
        Authorization: process.env.PAYMENT_GATEWAY_SECRET,
        'api-key': process.env.PAYMENT_GATEWAY_KEY,
      },
    }
  );
  return response.data;
};

exports.getDonationWithUser = async (id) => {
  return Donation.findById(id).populate('user', 'name email');
};

exports.listMyDonations = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Donation.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Donation.countDocuments({ user: userId }),
  ]);
  return { data, total };
};

exports.listAllDonations = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Donation.find().populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Donation.countDocuments(),
  ]);
  return { data, total };
};
