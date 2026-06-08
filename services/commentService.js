const Comment = require('../models/comment');
const Post = require('../models/post');
const APIError = require('../utils/APIERROR');
const { getIO } = require('./socket');

exports.getComments = async (postId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Comment.find({ post: postId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments({ post: postId }),
  ]);
  return { data, total };
};

exports.createComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);
  if (!post) throw new APIError(404, 'Post not found.');

  const comment = await Comment.create({ post: postId, user: userId, text });
  const populated = await comment.populate('user', 'name email avatar');

  getIO().emit('comment:created', populated);
  return populated;
};

exports.deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new APIError(404, 'Comment not found.');
  if (comment.user.toString() !== userId) {
    throw new APIError(403, 'Not authorized to delete this comment.');
  }
  await Comment.findByIdAndDelete(commentId);
  getIO().emit('comment:deleted', { commentId, postId: comment.post });
};
