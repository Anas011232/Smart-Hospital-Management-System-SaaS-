import express from "express";
import multer from "multer";
import path from "path";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

// =======================
// MULTER CONFIG
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =======================
// ROUTES
// =======================

// 🔥 CREATE (WITH IMAGE)
router.post("/", upload.single("photo"), createDoctor);

// 🔥 UPDATE (WITH IMAGE)
router.put("/:id", upload.single("photo"), updateDoctor);

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.delete("/:id", deleteDoctor);

export default router;