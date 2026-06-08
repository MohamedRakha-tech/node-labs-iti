const authService = require('../services/auth');
const { successResponse } = require('../utils/helpers');

exports.signup = async (req, res, next) => {
  try {
    const userId = await authService.signup(req.body);
    res.status(201).json(successResponse({ userId }));
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json(successResponse({ message: 'If that email exists, a password reset link has been sent.' }));
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json(successResponse({ message: 'Password reset successfully.' }));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const loginData = await authService.login(email, password);
    res.status(200).json(successResponse({ token: loginData.token, userId: loginData.userId }));
  } catch (err) {
    next(err);
  }
};
