import { Router } from "express";
import {
  login,
  register,
  syncAuthUser,
  updateProfile,
} from "../controllers/authController";
import { protect } from "../middleware/protect";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sync", protect, syncAuthUser);
router.patch("/profile", protect, updateProfile);

export default router;
