const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
const APIError = require('../utils/APIERROR');
const { getIO } = require('./socket');

exports.getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const totalItems = await User.countDocuments();
  const users = await User.find()
    .skip(skip)
    .limit(limit);
  return {
    users,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page
  };
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
  getIO().to('admin').emit('user:created', { _id: result._id, email, name, role });
  return { _id: result._id };
};

exports.updateUser = async (userId, userData, filename) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError(404, 'Could not find user.');
  }
  if (userData.name) user.name = userData.name;
  if (userData.email) user.email = userData.email;
  if (userData.role) user.role = userData.role;
  if (filename) user.avatar = filename;
  await user.save();
  getIO().to('admin').emit('user:updated', user);
  return user;
};

exports.deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError(404, 'Could not find user.');
  }
  await Post.deleteMany({ creator: userId });
  await User.findByIdAndDelete(userId);
  getIO().to('admin').emit('user:deleted', { userId });
};

exports.followUser = async (userId, targetId) => {
  if (userId === targetId) throw new APIError(400, 'Cannot follow yourself.');

  const [user, target] = await Promise.all([
    User.findById(userId),
    User.findById(targetId),
  ]);
  if (!user) throw new APIError(404, 'Authenticated user not found.');
  if (!target) throw new APIError(404, 'Target user not found.');

  const alreadyFollowing = user.following.some((id) => id.toString() === targetId);
  if (alreadyFollowing) {
    user.following.pull(targetId);
    target.followers.pull(userId);
  } else {
    user.following.push(targetId);
    target.followers.push(userId);
  }

  await Promise.all([user.save(), target.save()]);

  getIO().emit('user:followed', { userId, targetId, following: !alreadyFollowing });
  return { following: !alreadyFollowing };
};
