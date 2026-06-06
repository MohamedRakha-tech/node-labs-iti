const Post = require('../models/post');
const APIError = require('../utils/APIERROR');

exports.getAllPosts = async () => {
  return await Post.find().populate('creator', 'name email');
};

exports.getPostById = async (postId) => {
  const post = await Post.findById(postId).populate('creator', 'name email');
  if (!post) {
    throw new APIError(404, 'Could not find post.');
  }
  return post;
};

exports.createPost = async (postData, userId) => {
  const { title, content } = postData;
  const post = new Post({
    title: title,
    content: content,
    creator: userId
  });

  await post.save();

  return {
    post: post,
    creator: { _id: userId }
  };
};

exports.updatePost = async (postId, postData, userId) => {
  const { title, content } = postData;
  const post = await Post.findById(postId);
  if (!post) {
    throw new APIError(404, 'Could not find post.');
  }

  if (post.creator.toString() !== userId) {
    throw new APIError(403, 'Not authorized!');
  }

  post.title = title;
  post.content = content;
  return await post.save();
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
};
