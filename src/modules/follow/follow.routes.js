import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  toggleFollow,
  getFollowers,
  getFollowing,
} from "./follow.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/:userId/toggle", toggleFollow);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

export default router;
