import bcrypt from "bcryptjs";
import { getDB } from "../config/db.js";
import { generateToken } from "../utils/token.js";
import { slugify } from "../utils/slug.js";

export const registerHospital = async (req, res) => {
  try {
    const db = await getDB();
    const hospitals = db.collection("hospitals");

    const {
      hospitalName,
      ownerName,
      email,
      phone,
      emergencyPhone,
      password,
      website,
      address,
      city,
      state,
      postalCode,
      country,
      hospitalType,
      licenseNumber,
      establishedYear,
      totalDoctors,
      totalBeds,
      subscriptionPlan,
      subscriptionMonths,
    } = req.body;

    const exists = await hospitals.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Hospital already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const months = Number(subscriptionMonths || 1);

    const hospital = {
      hospitalName,
      slug: slugify(hospitalName),
      hospitalImage: req.file ? req.file.path : "",
      ownerName,
      email,
      phone,
      emergencyPhone,
      password: hashed,
      website,
      address,
      city,
      state,
      postalCode,
      country,
      hospitalType,
      licenseNumber,
      establishedYear: Number(establishedYear),
      totalDoctors: Number(totalDoctors || 0),
      totalBeds: Number(totalBeds || 0),
      subscriptionPlan,
      subscriptionMonths: months,
      subscriptionAmount: months * 1000,
      subscriptionStatus: "active",
      expiresAt: new Date(
        Date.now() + months * 30 * 24 * 60 * 60 * 1000
      ),
      role: "hospital",
      isVerified: false,
      isBlocked: false,
      createdAt: new Date(),
    };

    const result = await hospitals.insertOne(hospital);

    const token = generateToken(result.insertedId, "hospital");

    res.json({
      success: true,
      token,
      hospital,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};