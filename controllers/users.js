const usersService = require('../services/users');
const { parsePagination, paginatedResponse, successResponse } = require('../utils/helpers');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await usersService.getAllUsers(page, limit);
    res.status(200).json(paginatedResponse(result.users, result.totalItems, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await usersService.getUserById(userId);
    res.status(200).json(successResponse(user));
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const result = await usersService.createUser(req.body);
    res.status(201).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const filename = req.file ? req.file.filename : undefined;
    const result = await usersService.updateUser(userId, req.body, filename);
    res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const { userId: targetId } = req.params;
    const result = await usersService.followUser(req.userId, targetId);
    res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await usersService.deleteUser(userId);
    res.status(200).json(successResponse({ deleted: true }));
  } catch (err) {
    next(err);
  }
};
