const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const ejs = require('ejs');
const User = require('../models/user');
const ResetToken = require('../models/resetToken');
const APIError = require('../utils/APIERROR');
const { getIO } = require('./socket');
const { sendWelcomeEmail } = require('./emailService');

exports.signup = async (userData) => {
  const { email, password, name } = userData;

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    email: email,
    password: hashedPassword,
    name: name,
    role: 'user'
  });
  const result = await user.save();
  sendWelcomeEmail(result).catch(err => {
    console.error('Error sending welcome email:', err);
  });
  getIO().emit('user:registered', { userId: result._id, email: result.email });
  return result._id;
};

exports.login = async (email, password) => {
  
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    throw new APIError(401, 'A user with this email could not be found.');
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new APIError(401, 'Wrong password!');
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token: token,
    userId: user._id.toString()
  };
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;

  const rawToken = await ResetToken.createToken(user._id);
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${rawToken}`;

  const html = await ejs.renderFile(
    path.join(__dirname, '..', 'views', 'emails', 'resetPassword.ejs'),
    { name: user.name, resetUrl, year: new Date().getFullYear() }
  );

  const nodeMailer = require('nodemailer');
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    html,
  });
};

exports.resetPassword = async (rawToken, newPassword) => {
  const tokenDoc = await ResetToken.verifyToken(rawToken);
  if (!tokenDoc) throw new APIError(400, 'Invalid or expired reset token.');

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(tokenDoc.userId, { password: hashedPassword });
  await ResetToken.deleteMany({ userId: tokenDoc.userId });
};
