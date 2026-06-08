const donationService = require('../services/donationService');
const { sendDonationReceipt } = require('../services/emailService');

exports.createDonation = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const donation = await donationService.createDonation(amount, req.userEmail, req.userId);
    const gatewayRes = await donationService.createPaymentLink(donation);
    const updatedDonation = await donationService.updateDonation(donation._id, {
      providerSessionId: gatewayRes._id,
      link: gatewayRes.sessionUrl,
    });
    res.status(201).json({
      status: 'success',
      data: updatedDonation,
    });
  } catch (err) {
    next(err);
  }
};

exports.webHook = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { merchantOrderId: donationId, status } = data;
    const donationStatus = status === 'SUCCESS' ? 'completed' : 'failed';
    await donationService.updateDonation(donationId, { status: donationStatus });

    if (donationStatus === 'completed') {
      const donation = await donationService.getDonationWithUser(donationId);
      if (donation?.user) {
        sendDonationReceipt(donation, donation.user).catch(err => {
          console.error('Error sending donation receipt:', err);
        });
      }
    }

    res.status(200).json({ status: 'success', data: 'webhook received' });
  } catch (err) {
    next(err);
  }
};

exports.listMyDonations = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const { data, total } = await donationService.listMyDonations(req.userId, page, limit);
    res.status(200).json({
      status: 'success',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.listAllDonations = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const { data, total } = await donationService.listAllDonations(page, limit);
    res.status(200).json({
      status: 'success',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};
