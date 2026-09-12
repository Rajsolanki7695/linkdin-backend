import { ApiResponse } from "../../utils/apiResponse.js";
import * as userService from "./user.service.js";

export const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfileService(
      req.params.id,
      req.user?._id,
    );
    res
      .status(200)
      .json(new ApiResponse(200, profile, "Profile fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfileService(
      req.user._id,
      req.body,
      req.file,
    );
    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const users = await userService.searchUsersService(
      req.query.q,
      req.user._id,
    );
    res.status(200).json(new ApiResponse(200, users, "Users found"));
  } catch (error) {
    next(error);
  }
};
