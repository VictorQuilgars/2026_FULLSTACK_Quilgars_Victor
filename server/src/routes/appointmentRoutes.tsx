import { Router } from "express";
import {
  createAppointment,
  getActiveAppointments,
  getMyAppointments,
} from "../controllers/appointmentController";
import { protect } from "../middleware/protect";

const router = Router();

router.post("/appointments", protect, createAppointment);
router.get("/appointments/active", protect, getActiveAppointments);
router.get("/my-appointments", protect, getMyAppointments);

export default router;
