import { ApiResponse } from "../../utils/apiResponse.js";
import * as followService from "./follow.service.js";

export const toggleFollow = async (req, res, next) => {
  try {
    const result = await followService.toggleFollowService(
      req.user._id,
      req.params.userId,
    );
    res.status(200).json(new ApiResponse(200, result, result.message));
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const followers = await followService.getFollowersService(
      req.params.userId,
    );
    res
      .status(200)
      .json(new ApiResponse(200, followers, "Followers retrieved"));
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const following = await followService.getFollowingService(
      req.params.userId,
    );
    res
      .status(200)
      .json(new ApiResponse(200, following, "Following retrieved"));
  } catch (error) {
    next(error);
  }
};
