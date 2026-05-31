import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// CREATE DOCTOR
export const createDoctor = async (req, res) => {
  try {
    const db = getDB();

    const doctor = {
      hospitalId: req.body.hospitalId
        ? new ObjectId(req.body.hospitalId)
        : null,

      fullName: req.body.fullName,
      photo: req.body.photo || "",

      email: req.body.email,
      password: req.body.password,

      phone: req.body.phone,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,

      bloodGroup: req.body.bloodGroup,
      address: req.body.address,
      nidNumber: req.body.nidNumber,

      specialization: req.body.specialization,
      designation: req.body.designation,
      department: req.body.department,

      qualification: req.body.qualification,
      experienceYears: Number(req.body.experienceYears),

      medicalRegistrationNumber: req.body.medicalRegistrationNumber,
      licenseNumber: req.body.licenseNumber,

      consultationFee: Number(req.body.consultationFee),

      availableDays: req.body.availableDays || [],
      startTime: req.body.startTime,
      endTime: req.body.endTime,

      maxPatientsPerDay: Number(req.body.maxPatientsPerDay),

      bio: req.body.bio,
      languages: req.body.languages || [],

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

    res.json({
      success: true,
      id: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL
export const getDoctors = async (req, res) => {
  try {
    const db = getDB();
    const doctors = await db.collection("doctors").find().toArray();

    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET BY ID
export const getDoctorById = async (req, res) => {
  try {
    const db = getDB();

    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateDoctor = async (req, res) => {
  try {
    const db = getDB();

    await db.collection("doctors").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    res.json({ success: true, message: "Updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
export const deleteDoctor = async (req, res) => {
  try {
    const db = getDB();

    await db.collection("doctors").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};