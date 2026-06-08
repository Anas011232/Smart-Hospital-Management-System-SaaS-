import express from "express";

import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
  getDoctorAppointments,
  getMyAppointments,
  getAppointmentById,
  skipPatient,
  recallPatient,
  getQueueStats,
  getQueueBoard,
  startConsultation,
  finishConsultation,
} from "../controllers/appointmentController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create appointment
router.post("/", authMiddleware, createAppointment);

// Get doctor's appointments
router.get("/doctor", authMiddleware, getDoctorAppointments);

// Accept/Reject appointments
router.patch("/accept/:id", authMiddleware, acceptAppointment);
router.patch("/reject/:id", authMiddleware, rejectAppointment);

// Get my appointments (patient)
router.get("/my-appointments", authMiddleware, getMyAppointments);

// Get appointment by ID
router.get("/:id", authMiddleware, getAppointmentById);

// Skip patient (doctor action)
router.patch("/:id/skip", authMiddleware, skipPatient);

// Recall skipped patient (doctor action)
router.patch("/:id/recall", authMiddleware, recallPatient);

// Start consultation
router.patch("/:id/start-consultation", authMiddleware, startConsultation);

// Finish consultation
router.patch("/:id/finish-consultation", authMiddleware, finishConsultation);

// Queue statistics (for dashboard)
router.get("/queue/stats", getQueueStats);

// Queue board (display board for all active queues)
router.get("/queue/board", getQueueBoard);

export default router;