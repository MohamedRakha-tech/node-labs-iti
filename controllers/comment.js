const commentService = require('../services/commentService');
const { parsePagination, paginatedResponse, successResponse } = require('../utils/helpers');

exports.getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page, limit } = parsePagination(req.query, { limit: 20, maxLimit: 50 });
    const { data, total } = await commentService.getComments(postId, page, limit);
    res.status(200).json(paginatedResponse(data, total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const comment = await commentService.createComment(postId, req.userId, text);
    res.status(201).json(successResponse(comment));
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId, req.userId);
    res.status(200).json(successResponse({ deleted: true }));
  } catch (err) {
    next(err);
  }
};
