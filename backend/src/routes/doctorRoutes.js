import express from "express";
import multer from "multer";
import {
  createDoctor,
  getDoctorsByHospital,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("photo"), createDoctor);

// ✅ ADD THIS (IMPORTANT)
router.put("/:id", upload.single("photo"), updateDoctor);

router.delete("/:id", deleteDoctor);

router.get("/hospital/:hospitalId", getDoctorsByHospital);

router.get("/", getDoctors);

router.get("/:id", getDoctorById);

export default router;