const Post = require('../models/post');
const APIError = require('../utils/APIERROR');
const { getIO } = require('./socket');

exports.getAllPosts = async (page = 1, limit = 10, userId) => {
  const skip = (page - 1) * limit;
  const totalItems = await Post.countDocuments();
  // add flag to my post to identify if the post is created by the logged in user or not
  const posts = await Post.find()
    .skip(skip)
    .limit(limit)
    .populate('creator', 'name email').lean();
  
  const result = posts.map(post => {
    return {
      ...post,
      isMine: post.creator._id.toString() === userId
    };
  });
  return {
    posts: result,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page
  };
};

exports.getPostById = async (postId) => {
  const post = await Post.findById(postId).populate('creator', 'name email');
  if (!post) {
    throw new APIError(404, 'Could not find post.');
  }
  return post;
};

exports.createPost = async (postData, userId, filename) => {
  const { title, content } = postData;
  const post = new Post({
    title: title,
    content: content,
    image: filename || undefined,
    creator: userId
  });

  await post.save();

  const result = { post, creator: { _id: userId } };
  getIO().emit('post:created', result);
  return result;
};

exports.updatePost = async (postId, postData, userId, filename) => {
  const { title, content } = postData;
  const post = await Post.findById(postId);
  if (!post) {
    throw new APIError(404, 'Could not find post.');
  }

  if (post.creator.toString() !== userId) {
    throw new APIError(403, 'Not authorized!');
  }

  if (title) post.title = title;
  if (content) post.content = content;
  if (filename) post.image = filename;
  const updated = await post.save();
  getIO().emit('post:updated', updated);
  return updated;
};

exports.deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new APIError(404, 'Could not find post.');
  }

  if (post.creator.toString() !== userId) {
    throw new APIError(403, 'Not authorized!');
  }

  await Post.findByIdAndDelete(postId);
  getIO().emit('post:deleted', { postId });
};

exports.toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new APIError(404, 'Post not found.');

  const alreadyLiked = post.likes.some((id) => id.toString() === userId);
  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  getIO().emit('post:liked', { postId, userId, liked: !alreadyLiked, likesCount: post.likes.length });
  return { liked: !alreadyLiked, likesCount: post.likes.length };
};
