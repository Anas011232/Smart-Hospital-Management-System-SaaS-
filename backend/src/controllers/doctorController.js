import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// 🔥 SAFE HELPER
const safeString = (v) => (v && v !== "undefined" ? v : "");
const safeNumber = (v) => (v && !isNaN(v) ? Number(v) : 0);

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(",").map(v => v.trim());
};

// ===============================
// CREATE DOCTOR
// ===============================

// export const createDoctor = async (req, res) => {
//   try {
//     const db = getDB();

//     console.log("🔥 BODY:", req.body);
//     console.log("📸 FILE:", req.file);

//     // =========================
//     // SAFE HELPERS
//     // =========================
//     const safeString = (v) => (v && v !== "undefined" ? v : "");
//     const safeNumber = (v) => (v && !isNaN(v) ? Number(v) : 0);

//     let hospitalId = null;

//     if (
//       req.body.hospitalId &&
//       req.body.hospitalId !== "undefined" &&
//       ObjectId.isValid(req.body.hospitalId)
//     ) {
//       hospitalId = new ObjectId(req.body.hospitalId);
//     }



//     const doctor = {
//       hospitalId,

//       fullName: safeString(req.body.fullName),

//       photo: req.file ? `/uploads/${req.file.filename}` : "",

//       email: safeString(req.body.email),
//       password: safeString(req.body.password),
//       phone: safeString(req.body.phone),
//       gender: safeString(req.body.gender),
//       dateOfBirth: safeString(req.body.dateOfBirth),

//       bloodGroup: safeString(req.body.bloodGroup),
//       address: safeString(req.body.address),
//       nidNumber: safeString(req.body.nidNumber),

//       specialization: safeString(req.body.specialization),
//       designation: safeString(req.body.designation),
//       department: safeString(req.body.department),

//       qualification: safeString(req.body.qualification),

//       experienceYears: safeNumber(req.body.experienceYears),

//       medicalRegistrationNumber: safeString(req.body.medicalRegistrationNumber),
//       licenseNumber: safeString(req.body.licenseNumber),

//       consultationFee: safeNumber(req.body.consultationFee),

//       availableDays: toArray(req.body.availableDays),
//       startTime: safeString(req.body.startTime),
//       endTime: safeString(req.body.endTime),

//       maxPatientsPerDay: safeNumber(req.body.maxPatientsPerDay),

//       bio: safeString(req.body.bio),
//       languages: toArray(req.body.languages),

//       totalPatients: 0,
//       totalAppointments: 0,
//       rating: 5,
//       reviewsCount: 0,

//       isActive: true,
//       isVerified: false,
//       role: "doctor",

//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await db.collection("doctors").insertOne(doctor);

//     res.status(201).json({
//       success: true,
//       id: result.insertedId,
//     });
//   } catch (err) {
//     console.error("❌ CREATE DOCTOR ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const createDoctor = async (req, res) => {
  try {
    const db = getDB();

    let hospitalId = null;

    if (
      req.body.hospitalId &&
      ObjectId.isValid(req.body.hospitalId)
    ) {
      hospitalId = new ObjectId(req.body.hospitalId);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing hospitalId",
      });
    }
    const doctor = {
      hospitalId, // 🔥 IMPORTANT

      fullName: safeString(req.body.fullName),
      photo: req.file ? `/uploads/${req.file.filename}` : "",

      email: safeString(req.body.email),
      password: safeString(req.body.password),
      phone: safeString(req.body.phone),
      gender: safeString(req.body.gender),
      dateOfBirth: safeString(req.body.dateOfBirth),

      bloodGroup: safeString(req.body.bloodGroup),
      address: safeString(req.body.address),
      nidNumber: safeString(req.body.nidNumber),

      specialization: safeString(req.body.specialization),
      designation: safeString(req.body.designation),
      department: safeString(req.body.department),

      qualification: safeString(req.body.qualification),
      experienceYears: safeNumber(req.body.experienceYears),

      medicalRegistrationNumber: safeString(req.body.medicalRegistrationNumber),
      licenseNumber: safeString(req.body.licenseNumber),

      consultationFee: safeNumber(req.body.consultationFee),

      availableDays: toArray(req.body.availableDays),
      startTime: safeString(req.body.startTime),
      endTime: safeString(req.body.endTime),

      maxPatientsPerDay: safeNumber(req.body.maxPatientsPerDay),

      bio: safeString(req.body.bio),
      languages: toArray(req.body.languages),

      totalPatients: 0,
      totalAppointments: 0,
      rating: 5,
      reviewsCount: 0,

      isActive: true,
      isVerified: false,
      role: "doctor",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("doctors").insertOne(doctor);

    res.status(201).json({
      success: true,
      id: result.insertedId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// ===============================
// GET ALL DOCTORS
// ===============================
export const getDoctors = async (req, res) => {
  try {
    const db = getDB();

    const doctors = await db.collection("doctors").find().toArray();

    res.json({ success: true, doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET DOCTOR BY ID
// ===============================
export const getDoctorById = async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({ success: true, doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE DOCTOR (FIXED IMAGE)
// ===============================
export const updateDoctor = async (req, res) => {
  try {
    const db = getDB();

    const { _id, ...rest } = req.body;

    const updateData = {
      ...rest,
      updatedAt: new Date(),
    };

    // ✅ IMAGE UPDATE FIX
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    await db.collection("doctors").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    res.json({
      success: true,
      message: "Updated",
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// DELETE DOCTOR
// ===============================
export const deleteDoctor = async (req, res) => {
  try {
    const db = getDB();

    await db.collection("doctors").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getDoctorsByHospital = async (req, res) => {
  try {
    const db = getDB();

    const { hospitalId } = req.params;

    const doctors = await db
      .collection("doctors")
      .find({
        hospitalId: new ObjectId(hospitalId), // 🔥 FIX
      })
      .toArray();

    res.json({
      success: true,
      doctors,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};