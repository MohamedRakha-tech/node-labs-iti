const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const isAuth = require('../middlewares/is-auth');
const validator = require('../middlewares/validator');
const chatSchemas = require('../validators/chat');

router.use(isAuth);

router.get('/', validator(chatSchemas.getMyChats), chatController.getMyChats);
router.get('/:userId', validator(chatSchemas.getOrCreateChat), chatController.getOrCreateChat);
router.get('/:chatId/messages', validator(chatSchemas.getMessages), chatController.getMessages);
router.patch('/:chatId/read', validator(chatSchemas.markAsRead), chatController.markAsRead);

module.exports = router;
