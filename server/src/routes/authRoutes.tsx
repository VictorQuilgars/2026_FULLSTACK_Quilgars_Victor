import { Router } from "express";
import {
  getMe,
  login,
  register,
  updateProfile,
} from "../controllers/authController";
import { protect } from "../middleware/protect";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

export default router;
