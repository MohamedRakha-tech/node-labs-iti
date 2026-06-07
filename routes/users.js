const express = require('express');
const usersController = require('../controllers/users');
const isAuth = require('../middlewares/is-auth');
const authorizedTo = require('../middlewares/autherization');
const validator = require('../middlewares/validator');
const userSchemas = require('../validators/UserSchema');
const { checkEmailExists, checkEmailExistsForUpdate } = require('../middlewares/checkEmail');

const router = express.Router();

// All routes here require authentication AND admin role
router.use(isAuth, authorizedTo('admin'));

// GET /users
router.get(
  '/',
  validator(userSchemas.getAllUsers),
  usersController.getAllUsers
);

// GET /users/:userId
router.get('/:userId', validator(userSchemas.getUser), usersController.getUserById);

// POST /users
router.post(
  '/',
  validator(userSchemas.createUser),
  checkEmailExists,
  usersController.createUser
);

// PUT /users/:userId
router.put(
  '/:userId',
  validator(userSchemas.updateUser),
  checkEmailExistsForUpdate,
  usersController.updateUser
);

// DELETE /users/:userId
router.delete('/:userId', validator(userSchemas.deleteUser), usersController.deleteUser);

module.exports = router;
