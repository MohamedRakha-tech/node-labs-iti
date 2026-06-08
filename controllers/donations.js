const donationService = require('../services/donationService');
const { sendDonationReceipt } = require('../services/emailService');
const { parsePagination, paginatedResponse, successResponse } = require('../utils/helpers');

exports.createDonation = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const donation = await donationService.createDonation(amount, req.userEmail, req.userId);
    const gatewayRes = await donationService.createPaymentLink(donation);
    const updatedDonation = await donationService.updateDonation(donation._id, {
      providerSessionId: gatewayRes._id,
      link: gatewayRes.sessionUrl,
    });
    res.status(201).json(successResponse(updatedDonation));
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

    res.status(200).json(successResponse({ received: true }));
  } catch (err) {
    next(err);
  }
};

exports.listMyDonations = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query, { maxLimit: 50 });
    const { data, total } = await donationService.listMyDonations(req.userId, page, limit);
    res.status(200).json(paginatedResponse(data, total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.listAllDonations = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query, { maxLimit: 50 });
    const { data, total } = await donationService.listAllDonations(page, limit);
    res.status(200).json(paginatedResponse(data, total, page, limit));
  } catch (err) {
    next(err);
  }
};
