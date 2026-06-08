const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/comment');
const isAuth = require('../middlewares/is-auth');
const validator = require('../middlewares/validator');
const commentSchemas = require('../validators/comment');

router.get('/', validator(commentSchemas.getComments), commentController.getComments);
router.post('/', isAuth, validator(commentSchemas.createComment), commentController.createComment);
router.delete('/:commentId', isAuth, validator(commentSchemas.deleteComment), commentController.deleteComment);

module.exports = router;
