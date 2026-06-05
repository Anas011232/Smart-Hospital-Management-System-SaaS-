import express from "express";
import { registerPatient, getMyProfile } from "../controllers/patientController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // আপনার যদি অথেন্টিকেশন মিডলওয়্যার থাকে

const router = express.Router();

router.post("/register", registerPatient);

router.get("/me", authMiddleware, getMyProfile); 

export default router;