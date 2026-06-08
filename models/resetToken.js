const mongoose = require('mongoose');
const crypto = require('crypto');

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

resetTokenSchema.statics.createToken = async function (userId) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  await this.deleteMany({ userId });
  await this.create({
    userId,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  return rawToken;
};

resetTokenSchema.statics.verifyToken = async function (rawToken) {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const doc = await this.findOne({ token: hashedToken, expiresAt: { $gt: new Date() } });
  return doc;
};

module.exports = mongoose.model('ResetToken', resetTokenSchema);
