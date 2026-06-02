import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { generateToken } from "../utils/token.js";
import { slugify } from "../utils/slug.js";

export const getMyHospital = async (req, res) => {
  try {
    console.log("REQ USER =", req.user);

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const db = getDB();

    const hospital = await db.collection("hospitals").findOne({
      _id: new ObjectId(req.user.id),
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.json({
      success: true,
      hospital,
    });
  } catch (err) {
    console.error("GET MY HOSPITAL ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

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

export const getAllHospitals = async (req, res) => {
  try {
    const db = getDB();

    const hospitals = await db.collection("hospitals").find().toArray();

    res.json({
      success: true,
      hospitals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




