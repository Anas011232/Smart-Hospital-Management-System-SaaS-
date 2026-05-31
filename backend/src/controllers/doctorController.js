import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// 🔥 SAFE HELPER
const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(",").map((v) => v.trim());
};

// CREATE DOCTOR
export const createDoctor = async (req, res) => {
  try {
    const db = getDB();

    console.log("🔥 BODY:", req.body);

    const doctor = {
      hospitalId:
        ObjectId.isValid(req.body.hospitalId)
          ? new ObjectId(req.body.hospitalId)
          : null,

      fullName: req.body.fullName || "",
      photo: req.body.photo || "",

      email: req.body.email || "",
      password: req.body.password || "",

      phone: req.body.phone || "",
      gender: req.body.gender || "",
      dateOfBirth: req.body.dateOfBirth || "",

      bloodGroup: req.body.bloodGroup || "",
      address: req.body.address || "",
      nidNumber: req.body.nidNumber || "",

      specialization: req.body.specialization || "",
      designation: req.body.designation || "",
      department: req.body.department || "",

      qualification: req.body.qualification || "",
      experienceYears: Number(req.body.experienceYears) || 0,

      medicalRegistrationNumber:
        req.body.medicalRegistrationNumber || "",
      licenseNumber: req.body.licenseNumber || "",

      consultationFee: Number(req.body.consultationFee) || 0,

      availableDays: toArray(req.body.availableDays),
      startTime: req.body.startTime || "",
      endTime: req.body.endTime || "",

      maxPatientsPerDay:
        Number(req.body.maxPatientsPerDay) || 0,

      bio: req.body.bio || "",
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
    console.error("❌ CREATE DOCTOR ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL
export const getDoctors = async (req, res) => {
  try {
    const db = getDB();

    const doctors = await db
      .collection("doctors")
      .find()
      .toArray();

    res.json({ success: true, doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET BY ID
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

// UPDATE
export const updateDoctor = async (req, res) => {
  try {
    const db = getDB();

    const { _id, ...rest } = req.body; // 🔥 REMOVE _id

    await db.collection("doctors").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          ...rest,
          updatedAt: new Date(),
        },
      }
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

// DELETE
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