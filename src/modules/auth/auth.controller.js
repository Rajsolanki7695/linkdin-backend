import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

export const handleGoogleCallback = (req, res) => {
  if (!req.user) {
    throw new ApiError(400, "Google authentication failed");
  }

  const token = req.user.generateAccessToken();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  // Redirect to frontend auth callback route with token
  res.redirect(`${clientUrl}/auth/callback?token=${token}`);
};

export const getCurrentUser = (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
};
