import express from "express";
import { askDoctorAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", askDoctorAI);

export default router;