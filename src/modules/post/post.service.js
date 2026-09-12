import { Post } from "./post.model.js";
import { ApiError } from "../../utils/apiError.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

export const createPostService = async (authorId, { content }, file) => {
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty");
  }

  let imageUrl = null;
  if (file) {
    imageUrl = await uploadToCloudinary(file.buffer, "linkedin_clone/posts");
  }

  const post = await Post.create({
    author: authorId,
    content: content.trim(),
    image: imageUrl,
  });

  return await post.populate("author", "name avatar headline");
};

export const getFeedPostsService = async (
  currentUserId,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "name avatar headline")
    .lean();

  const total = await Post.countDocuments();

  const formattedPosts = posts.map((post) => ({
    ...post,
    likesCount: post.likes.length,
    isLiked: post.likes.some(
      (id) => id.toString() === currentUserId.toString(),
    ),
  }));

  return {
    posts: formattedPosts,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

export const getPostByIdService = async (postId, currentUserId) => {
  const post = await Post.findById(postId)
    .populate("author", "name avatar headline")
    .lean();

  if (!post) throw new ApiError(404, "Post not found");

  return {
    ...post,
    likesCount: post.likes.length,
    isLiked: post.likes.some(
      (id) => id.toString() === currentUserId.toString(),
    ),
  };
};

export const updatePostService = async (postId, userId, { content }, file) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  // Strict ownership check
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "Forbidden: You can only edit your own posts");
  }

  if (content && content.trim() !== "") {
    post.content = content.trim();
  }

  if (file) {
    post.image = await uploadToCloudinary(file.buffer, "linkedin_clone/posts");
  }

  await post.save();
  return await post.populate("author", "name avatar headline");
};

export const deletePostService = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  // Strict ownership check
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "Forbidden: You can only delete your own posts");
  }

  await Post.findByIdAndDelete(postId);
  return { message: "Post deleted successfully" };
};

export const toggleLikeService = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const isLiked = post.likes.some((id) => id.toString() === userId.toString());

  if (isLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  await post.save();

  return {
    isLiked: !isLiked,
    likesCount: post.likes.length,
  };
};
