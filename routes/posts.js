const express = require('express');
const postsController = require('../controllers/posts');
const isAuth = require('../middlewares/is-auth');
const validator = require('../middlewares/validator');
const postSchemas = require('../validators/posts');
const upload = require('../middlewares/upload');

const router = express.Router();

// GET /posts
router.get(
  '/',isAuth,
  validator(postSchemas.getAllPosts),
  postsController.getAllPosts
);

// GET /posts/:id
router.get(
  '/:id',
  validator(postSchemas.getPost),
  postsController.getPostById
);

// POST /posts
router.post(
  '/',
  isAuth,
  upload.single('image'),
  validator(postSchemas.createPost),
  postsController.createPost
);

// PUT /posts/:id
router.put(
  '/:id',
  isAuth,
  upload.single('image'),
  validator(postSchemas.updatePost),
  postsController.updatePost
);

// DELETE /posts/:id
router.delete(
  '/:id',
  isAuth,
  validator(postSchemas.deletePost),
  postsController.deletePost
);

// POST /posts/:id/like
router.post(
  '/:id/like',
  isAuth,
  validator(postSchemas.getPost),
  postsController.toggleLike
);

// Comment routes nested under posts
router.use('/:postId/comments', require('./comment'));

module.exports = router;
