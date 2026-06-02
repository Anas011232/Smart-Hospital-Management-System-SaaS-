import express from "express";
import { createAppointment, acceptAppointment } from "../controllers/appointmentController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAppointment);
router.patch("/accept/:id", authMiddleware, acceptAppointment);

export default router;