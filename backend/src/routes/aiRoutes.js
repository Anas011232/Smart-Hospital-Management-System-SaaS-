import express from "express";
import { askDoctorAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/triage", askDoctorAI);

export default router;