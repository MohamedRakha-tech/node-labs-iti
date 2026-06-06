const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const APIError = require('../utils/APIERROR');

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
  return result._id;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
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

exports.getAllUsers = async () => {
  return await User.find();
};

exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError(404, 'Could not find user.');
  }
  return user;
};

exports.createUser = async (userData) => {
  const { email, password, name, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    email,
    password: hashedPassword,
    name,
    role: role || 'user'
  });
  const result = await user.save();
  return { _id: result._id };
};

exports.updateUser = async (userId, userData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError(404, 'Could not find user.');
  }
  if (userData.name) user.name = userData.name;
  if (userData.email) user.email = userData.email;
  if (userData.role) user.role = userData.role;
  await user.save();
  return user;
};

exports.deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError(404, 'Could not find user.');
  }
  await User.findByIdAndDelete(userId);
};
