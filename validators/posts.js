const Joi = require('joi');

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    'string.length': 'ID must be 24 characters long.',
    'string.hex': 'ID must be a valid hex string.',
    'any.required': 'ID is required.'
  })
}).unknown(false);

const postBodySchema = Joi.object({
  title: Joi.string().trim().min(5).required().messages({
    'string.min': 'Title must be at least 5 characters long.',
    'any.required': 'Title is required.'
  }),
  content: Joi.string().trim().min(5).required().messages({
    'string.min': 'Content must be at least 5 characters long.',
    'any.required': 'Content is required.'
  })
}).unknown(false);

const createPostSchema = {
  body: postBodySchema
};

const updatePostSchema = {
  params: idParamSchema,
  body: postBodySchema
};

const getPostSchema = {
  params: idParamSchema
};

const getAllPostsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
  }).unknown(false)
};

const deletePostSchema = {
  params: idParamSchema
};

module.exports = {
  createPost: createPostSchema,
  updatePost: updatePostSchema,
  getPost: getPostSchema,
  deletePost: deletePostSchema,
  getAllPosts: getAllPostsSchema
};
