import { User } from "./user.model.js";
import { Follow } from "../follow/follow.model.js";
import { ApiError } from "../../utils/apiError.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

export const getUserProfileService = async (targetUserId, viewerId) => {
  const user = await User.findById(targetUserId).select("-googleId -__v");
  if (!user) throw new ApiError(404, "User not found");

  const [followersCount, followingCount, isFollowing] = await Promise.all([
    Follow.countDocuments({ following: targetUserId }),
    Follow.countDocuments({ follower: targetUserId }),
    viewerId
      ? Follow.exists({ follower: viewerId, following: targetUserId })
      : null,
  ]);

  return {
    ...user.toObject(),
    followersCount,
    followingCount,
    isFollowing: Boolean(isFollowing),
  };
};

export const updateProfileService = async (
  userId,
  { name, bio, headline },
  file,
) => {
  const updates = {};
  if (name) updates.name = name.trim();
  if (typeof bio === "string") updates.bio = bio.trim();
  if (typeof headline === "string") updates.headline = headline.trim();

  if (file) {
    const avatarUrl = await uploadToCloudinary(
      file.buffer,
      "linkedin_clone/avatars",
    );
    updates.avatar = avatarUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true },
  ).select("-googleId -__v");
  return updatedUser;
};

export const searchUsersService = async (query, currentUserId) => {
  if (!query || query.trim() === "") return [];

  const users = await User.find({
    _id: { $ne: currentUserId },
    $or: [
      { name: { $regex: query.trim(), $options: "i" } },
      { headline: { $regex: query.trim(), $options: "i" } },
    ],
  })
    .select("name email avatar headline")
    .limit(20);

  return users;
};
