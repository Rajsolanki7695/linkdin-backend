import { Router } from "express";
import passport from "passport";
import { handleGoogleCallback, getCurrentUser } from "./auth.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

// Trigger Google OAuth consent screen
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Google OAuth callback endpoint
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=oauth_failed`,
  }),
  handleGoogleCallback,
);

// Fetch session user details
router.get("/me", verifyJWT, getCurrentUser);

export default router;
