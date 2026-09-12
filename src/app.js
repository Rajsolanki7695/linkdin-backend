import express from "express";
import cors from "cors";
import passport from "passport";
import { configurePassport } from "./config/passport.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import userRoutes from "./modules/user/user.routes.js";
import followRoutes from "./modules/follow/follow.routes.js";
import postRoutes from "./modules/post/post.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "https://linkedin-clone-rakesh.duckdns.org",
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Initialize Passport
configurePassport();
app.use(passport.initialize());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running smoothly" });
});

// Mount Modules
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/chats", chatRoutes);

// Global Error Handler
app.use(errorHandler);

export { app };
