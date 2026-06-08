const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
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
