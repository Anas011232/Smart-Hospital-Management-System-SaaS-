import express from "express";
import {
  registerHospital,
} from "../controllers/hospitalController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerHospital);

// router.post("/login", loginHospital);

export default router;