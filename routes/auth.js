const express = require('express');
const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');
const { generateToken } = require('../middlewares/csrf');

const router = express.Router();

router.get('/csrf-token', (req, res) => {
  const token = generateToken(req, res);
  res.json({ status: 'success', data: { csrfToken: token } });
});

router.post(
  '/signup',
  authMiddleware.validateSignup,
  authController.signup
);

router.post(
  '/login',
  authMiddleware.validateLogin,
  authController.login
);

router.post(
  '/forgot-password',
  authMiddleware.validateForgotPassword,
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  authMiddleware.validateResetPassword,
  authController.resetPassword
);

module.exports = router;
