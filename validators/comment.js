const Joi = require('joi');

const commentBodySchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required().messages({
    'string.min': 'Comment must not be empty.',
    'string.max': 'Comment must not exceed 1000 characters.',
    'any.required': 'Text is required.',
  }),
}).unknown(false);

const postIdParam = Joi.object({
  postId: Joi.string().length(24).hex().required().messages({
    'string.length': 'Post ID must be 24 characters long.',
    'string.hex': 'Post ID must be a valid hex string.',
    'any.required': 'Post ID is required.',
  }),
}).unknown(false);

const commentIdParam = Joi.object({
  commentId: Joi.string().length(24).hex().required().messages({
    'string.length': 'Comment ID must be 24 characters long.',
    'string.hex': 'Comment ID must be a valid hex string.',
    'any.required': 'Comment ID is required.',
  }),
}).unknown(false);

const createCommentSchema = {
  params: postIdParam,
  body: commentBodySchema,
};

const getCommentsSchema = {
  params: postIdParam,
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
  }).unknown(false),
};

const deleteCommentSchema = {
  params: commentIdParam,
};

module.exports = {
  createComment: createCommentSchema,
  getComments: getCommentsSchema,
  deleteComment: deleteCommentSchema,
};
