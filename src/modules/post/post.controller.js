import { ApiResponse } from "../../utils/apiResponse.js";
import * as postService from "./post.service.js";

export const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPostService(
      req.user._id,
      req.body,
      req.file,
    );
    res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getFeedPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const feed = await postService.getFeedPostsService(
      req.user._id,
      page,
      limit,
    );
    res
      .status(200)
      .json(new ApiResponse(200, feed, "Feed retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostByIdService(
      req.params.id,
      req.user._id,
    );
    res
      .status(200)
      .json(new ApiResponse(200, post, "Post retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePostService(
      req.params.id,
      req.user._id,
      req.body,
      req.file,
    );
    res
      .status(200)
      .json(new ApiResponse(200, post, "Post updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const result = await postService.deletePostService(
      req.params.id,
      req.user._id,
    );
    res
      .status(200)
      .json(new ApiResponse(200, result, "Post deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const result = await postService.toggleLikeService(
      req.params.id,
      req.user._id,
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          result.isLiked ? "Post liked" : "Post unliked",
        ),
      );
  } catch (error) {
    next(error);
  }
};
