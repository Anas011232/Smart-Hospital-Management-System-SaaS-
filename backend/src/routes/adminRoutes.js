import express from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  getStats,
  getHospitals,
  toggleVerifyHospital,
  toggleBlockHospital,
  updateHospitalSubscription,
  deleteHospital,
  getDoctors,
  toggleVerifyDoctor,
  toggleBlockDoctor,
  getPatients,
  toggleBlockPatient,
  getSystemHealth,
  getRevenueByDateRange,
} from "../controllers/adminController.js";

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminMiddleware);

// ================= PLATFORM METRICS & REVENUE =================
router.get("/stats", getStats);
router.get("/revenue", getRevenueByDateRange);


// ================= HOSPITALS MANAGEMENT =================
router.get("/hospitals", getHospitals);
router.patch("/hospitals/:id/verify", toggleVerifyHospital);
router.patch("/hospitals/:id/block", toggleBlockHospital);
router.patch("/hospitals/:id/subscription", updateHospitalSubscription);
router.delete("/hospitals/:id", deleteHospital);

// ================= DOCTORS MANAGEMENT =================
router.get("/doctors", getDoctors);
router.patch("/doctors/:id/verify", toggleVerifyDoctor);
router.patch("/doctors/:id/block", toggleBlockDoctor);

// ================= PATIENTS MANAGEMENT =================
router.get("/patients", getPatients);
router.patch("/patients/:id/block", toggleBlockPatient);

// ================= SYSTEM HEALTH =================
router.get("/system-health", getSystemHealth);

export default router;
