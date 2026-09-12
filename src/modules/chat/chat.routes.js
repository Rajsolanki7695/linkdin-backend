import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  getMessages,
  getConversations,
  checkChatPermission,
} from "./chat.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/conversations", getConversations);
router.get("/permission/:targetUserId", checkChatPermission);
router.get("/:targetUserId", getMessages);

export default router;
