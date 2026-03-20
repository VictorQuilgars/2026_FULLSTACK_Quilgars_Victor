import { Router } from "express";
import {
  getAdminAppointments,
  updateAppointmentStatus,
} from "../controllers/adminController";
import { protectAdmin } from "../middleware/protectAdmin";

const router = Router();

router.get("/appointments", ...protectAdmin, getAdminAppointments);
router.patch("/appointments/:id/status", ...protectAdmin, updateAppointmentStatus);

export default router;
