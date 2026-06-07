// src/routes/prescriptionRoutes.js
import express from "express";
import { createPrescription, getPatientPrescriptions } from "../controllers/prescriptionController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/", authMiddleware, createPrescription);
router.get("/my-prescriptions", authMiddleware, getPatientPrescriptions);
export default router;