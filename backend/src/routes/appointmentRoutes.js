import express from "express";

import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
  getDoctorAppointments,
} from "../controllers/appointmentController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createAppointment
);

// 🔥 DOCTOR DASHBOARD (ONLY OWN APPOINTMENTS)
router.get("/doctor", authMiddleware, getDoctorAppointments);

router.patch(
  "/accept/:id",
  authMiddleware,
  acceptAppointment
);

router.patch(
  "/reject/:id",
  authMiddleware,
  rejectAppointment
);

export default router;