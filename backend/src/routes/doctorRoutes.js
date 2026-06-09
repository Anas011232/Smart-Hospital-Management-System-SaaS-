import express from "express";
import multer from "multer";

import {
  createDoctor,
  getDoctorsByHospital,
  getMyDoctors,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getMyProfile,
  getDoctorsFiltered,
  getHospitalSpecializations,
} from "../controllers/doctorController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/*
|--------------------------------------------------------------------------
| CREATE / UPDATE / DELETE
|--------------------------------------------------------------------------
*/

router.post("/", upload.single("photo"), createDoctor);

router.put("/:id", upload.single("photo"), updateDoctor);

router.delete("/:id", deleteDoctor);

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

router.get(
  "/my-doctors",
  authMiddleware,
  getMyDoctors
);

router.get(
  "/me/profile",
  authMiddleware,
  getMyProfile
);

/*
|--------------------------------------------------------------------------
| SPECIALIZATION
|--------------------------------------------------------------------------
*/

router.get(
  "/specializations/:hospitalId",
  getHospitalSpecializations
);

/*
|--------------------------------------------------------------------------
| FILTER / SEARCH / SORT
|--------------------------------------------------------------------------
*/

router.get(
  "/hospital/:hospitalId/filter",
  getDoctorsFiltered
);

/*
|--------------------------------------------------------------------------
| HOSPITAL DOCTORS
|--------------------------------------------------------------------------
*/

router.get(
  "/hospital/:hospitalId",
  getDoctorsByHospital
);

/*
|--------------------------------------------------------------------------
| GENERAL
|--------------------------------------------------------------------------
*/

router.get("/", getDoctors);

/*
|--------------------------------------------------------------------------
| SINGLE DOCTOR
| ALWAYS KEEP LAST
|--------------------------------------------------------------------------
*/

router.get("/:id", getDoctorById);

export default router;