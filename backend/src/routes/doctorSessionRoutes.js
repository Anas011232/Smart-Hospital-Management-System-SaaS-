// src/routes/doctorSessionRoutes.js
import express from "express";
import { startSession, nextPatient, toggleBreak, getActiveSession, finishSession } from "../controllers/doctorSessionController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Start OPD session
router.post("/start", authMiddleware, startSession);

// Call next patient
router.post("/next", authMiddleware, nextPatient);

// Toggle break
router.patch("/break", authMiddleware, toggleBreak);

// Finish session
router.post("/:id/finish", authMiddleware, finishSession);

// Get active session for a doctor
router.get("/active/:doctorId", getActiveSession);

export default router;