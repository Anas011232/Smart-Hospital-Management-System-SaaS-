import express from "express";
import upload from "../middlewares/upload.js";
import {
  registerHospital,
  getAllHospitals,
  getMyHospital,
} from "../controllers/hospitalController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("image"),
  registerHospital
);

router.get("/", getAllHospitals);

router.get(
  "/me",
  authMiddleware,
  getMyHospital
);

export default router;