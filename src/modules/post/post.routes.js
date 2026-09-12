import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import {
  createPost,
  getFeedPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
} from "./post.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(upload.single("image"), createPost).get(getFeedPosts);

router
  .route("/:id")
  .get(getPostById)
  .put(upload.single("image"), updatePost)
  .delete(deletePost);

router.post("/:id/like", toggleLike);

export default router;
