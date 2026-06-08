const Joi = require('joi');

const userIdParam = Joi.object({
  userId: Joi.string().length(24).hex().required().messages({
    'string.length': 'User ID must be 24 characters long.',
    'string.hex': 'User ID must be a valid hex string.',
    'any.required': 'User ID is required.',
  }),
}).unknown(false);

const chatIdParam = Joi.object({
  chatId: Joi.string().length(24).hex().required().messages({
    'string.length': 'Chat ID must be 24 characters long.',
    'string.hex': 'Chat ID must be a valid hex string.',
    'any.required': 'Chat ID is required.',
  }),
}).unknown(false);

const paginationQuery = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
}).unknown(false);

module.exports = {
  getOrCreateChat: { params: userIdParam },
  getMyChats: { query: paginationQuery },
  getMessages: { params: chatIdParam, query: paginationQuery },
  markAsRead: { params: chatIdParam },
};
