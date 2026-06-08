const crypto = require('crypto');
const queryString = require('query-string');
const _ = require('underscore');
const APIError = require('../utils/APIERROR');

module.exports = (req, res, next) => {
  try {
    const { data } = req.body;
    data.signatureKeys.sort();
    const objectSignaturePayload = _.pick(data, data.signatureKeys);
    const signaturePayload = queryString.stringify(objectSignaturePayload);
    const signature = crypto
      .createHmac('sha256', process.env.PAYMENT_GATEWAY_KEY)
      .update(signaturePayload)
      .digest('hex');
    const kashierSignature = req.header('x-kashier-signature');
    if (kashierSignature !== signature) {
      throw new APIError(401, 'Invalid signature');
    }
    next();
  } catch (err) {
    next(err);
  }
};
