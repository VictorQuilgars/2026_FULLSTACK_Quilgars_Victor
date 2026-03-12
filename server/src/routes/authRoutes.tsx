import { Router } from "express";
import { syncAuthUser } from "../controllers/authController";
import { protect } from "../middleware/protect";

const router = Router();

router.post("/sync", protect, syncAuthUser);

export default router;
