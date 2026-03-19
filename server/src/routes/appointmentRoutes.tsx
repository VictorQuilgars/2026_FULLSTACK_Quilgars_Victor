import { Router } from "express";
import {
  cancelAppointment,
  createAppointment,
  createReview,
  getActiveAppointments,
  getAvailableSlots,
  getMyAppointments,
  updateAppointment,
} from "../controllers/appointmentController";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/available-slots", getAvailableSlots);
router.post("/appointments", protect, createAppointment);
router.patch("/appointments/:id/cancel", protect, cancelAppointment);
router.patch("/appointments/:id", protect, updateAppointment);
router.post("/appointments/:id/review", protect, createReview);
router.get("/appointments/active", protect, getActiveAppointments);
router.get("/my-appointments", protect, getMyAppointments);

export default router;
