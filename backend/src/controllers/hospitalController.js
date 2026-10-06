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

export const updateMyHospital = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const db = getDB();
    const hospitalId = new ObjectId(req.user.id);

    const existing = await db.collection("hospitals").findOne({ _id: hospitalId });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    const {
      hospitalName,
      ownerName,
      phone,
      emergencyPhone,
      website,
      address,
      city,
      state,
      postalCode,
      country,
      hospitalType,
      licenseNumber,
      establishedYear,
      totalBeds,
    } = req.body;

    const updateFields = {
      hospitalName: hospitalName ?? existing.hospitalName,
      slug: hospitalName ? slugify(hospitalName) : existing.slug,
      ownerName: ownerName ?? existing.ownerName,
      phone: phone ?? existing.phone,
      emergencyPhone: emergencyPhone ?? existing.emergencyPhone,
      website: website ?? existing.website,
      address: address ?? existing.address,
      city: city ?? existing.city,
      state: state ?? existing.state,
      postalCode: postalCode ?? existing.postalCode,
      country: country ?? existing.country,
      hospitalType: hospitalType ?? existing.hospitalType,
      licenseNumber: licenseNumber ?? existing.licenseNumber,
      establishedYear: establishedYear ? Number(establishedYear) : existing.establishedYear,
      totalBeds: totalBeds !== undefined ? Number(totalBeds) : existing.totalBeds,
      updatedAt: new Date(),
    };

    if (req.file) {
      updateFields.hospitalImage = req.file.path;
    }

    await db.collection("hospitals").updateOne(
      { _id: hospitalId },
      { $set: updateFields }
    );

    const updatedHospital = await db.collection("hospitals").findOne({ _id: hospitalId });

    res.json({
      success: true,
      message: "Hospital profile updated successfully",
      hospital: updatedHospital,
    });
  } catch (err) {
    console.error("UPDATE MY HOSPITAL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
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

    // Only return verified hospitals to patients/public search
    const hospitals = await db.collection("hospitals").find({ isVerified: true }).toArray();

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




