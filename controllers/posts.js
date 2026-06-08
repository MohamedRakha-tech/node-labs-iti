const postsService = require('../services/posts');
const { parsePagination, paginatedResponse, successResponse } = require('../utils/helpers');

exports.getAllPosts = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await postsService.getAllPosts(page, limit, req.userId);
    res.status(200).json(paginatedResponse(result.posts, result.totalItems, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await postsService.getPostById(postId);
    res.status(200).json(successResponse(post));
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const filename = req.file ? req.file.filename : undefined;
    const result = await postsService.createPost(req.body, req.userId, filename);
    res.status(201).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const filename = req.file ? req.file.filename : undefined;
    const result = await postsService.updatePost(postId, req.body, req.userId, filename);
    res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const result = await postsService.toggleLike(postId, req.userId);
    res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    await postsService.deletePost(postId, req.userId);
    res.status(200).json(successResponse({ deleted: true }));
  } catch (err) {
    next(err);
  }
};
