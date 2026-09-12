import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?._id).select("-__v");

    if (!user) {
      throw new ApiError(401, "Invalid token: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || "Invalid or expired token"));
  }
};
