import { Follow } from "./follow.model.js";
import { User } from "../user/user.model.js";
import { ApiError } from "../../utils/apiError.js";

export const toggleFollowService = async (followerId, targetUserId) => {
  if (followerId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const targetExists = await User.exists({ _id: targetUserId });
  if (!targetExists) throw new ApiError(404, "User to follow does not exist");

  const existingFollow = await Follow.findOne({
    follower: followerId,
    following: targetUserId,
  });

  if (existingFollow) {
    await Follow.findByIdAndDelete(existingFollow._id);
    return { isFollowing: false, message: "Unfollowed successfully" };
  }

  await Follow.create({ follower: followerId, following: targetUserId });
  return { isFollowing: true, message: "Followed successfully" };
};

export const getFollowersService = async (userId) => {
  return await Follow.find({ following: userId })
    .populate("follower", "name avatar headline")
    .select("follower createdAt");
};

export const getFollowingService = async (userId) => {
  return await Follow.find({ follower: userId })
    .populate("following", "name avatar headline")
    .select("following createdAt");
};
