import { Router } from "express";
import {
  getAdminAppointments,
  updateAppointmentStatus,
} from "../controllers/adminController";
import {
  getUsers,
  getUserAppointments,
  updateUserState,
  deleteUser,
} from "../controllers/adminUserController";
import { protectAdmin } from "../middleware/protectAdmin";

const router = Router();

router.get("/appointments", ...protectAdmin, getAdminAppointments);
router.patch("/appointments/:id/status", ...protectAdmin, updateAppointmentStatus);

router.get("/users", ...protectAdmin, getUsers);
router.get("/users/:id/appointments", ...protectAdmin, getUserAppointments);
router.patch("/users/:id/state", ...protectAdmin, updateUserState);
router.delete("/users/:id", ...protectAdmin, deleteUser);

export default router;
