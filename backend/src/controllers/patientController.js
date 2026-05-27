import bcrypt from "bcryptjs";
import { getDB } from "../config/db.js";

export const registerPatient = async (req, res) => {
  try {
    const db = getDB();
    const patients = db.collection("patients");

    const {
      name,
      email,
      phone,
      password,
      gender,
      dateOfBirth,
      address,
      bloodGroup,
      allergies,
      medicalHistory,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
    } = req.body;

    // ✅ validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await patients.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Patient already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newPatient = {
      name,
      email,
      phone,
      password: hash,
      role: "patient",

      profile: {
        gender,
        dateOfBirth,
        address,
        profileImage: "",
      },

      medical: {
        bloodGroup,
        allergies: allergies ? allergies.split(",").map(a => a.trim()) : [],
        medicalHistory: medicalHistory ? medicalHistory.split(",").map(m => m.trim()) : [],
      },

      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: emergencyRelation,
      },

      isBlocked: false,
      isVerified: false,
      createdAt: new Date(),
    };

    await patients.insertOne(newPatient);

    return res.status(201).json({
      message: "Patient registered successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};