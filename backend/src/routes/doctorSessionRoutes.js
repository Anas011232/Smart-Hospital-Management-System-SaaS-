// src/routes/doctorSessionRoutes.js
import express from "express";
import { startSession, nextPatient, toggleBreak, getActiveSession } from "../controllers/doctorSessionController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/start", authMiddleware, startSession);
router.post("/next", authMiddleware, nextPatient);
router.patch("/break", authMiddleware, toggleBreak);
router.get("/active/:doctorId", getActiveSession);
export default router;