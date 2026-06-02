import express from "express";

import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
} from "../controllers/appointmentController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createAppointment
);

router.patch(
  "/accept/:id",
  authMiddleware,
  acceptAppointment
);

router.patch(
  "/reject/:id",
  authMiddleware,
  rejectAppointment
);

export default router;