import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { getProfile, updateProfile, searchUsers } from "./user.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/search", searchUsers);
router.get("/:id", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile);

export default router;
