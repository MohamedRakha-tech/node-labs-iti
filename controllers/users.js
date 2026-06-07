const usersService = require('../services/users');

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await usersService.getAllUsers(page, limit);
    res.status(200).json({
      message: 'Fetched users successfully.',
      users: result.users,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await usersService.getUserById(userId);
    res.status(200).json({ message: 'User fetched.', user: user });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const result = await usersService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully!', userId: result._id });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const result = await usersService.updateUser(userId, req.body);
    res.status(200).json({ message: 'User updated!', user: result });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await usersService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
