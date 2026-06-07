const Post = require('../models/post');
const APIError = require('../utils/APIERROR');

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
