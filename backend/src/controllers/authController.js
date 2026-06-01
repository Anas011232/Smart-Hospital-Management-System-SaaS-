import bcrypt from "bcryptjs";
import { getDB } from "../config/db.js";
import { generateToken } from "../utils/token.js";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const db = getDB();

    // ================= ADMIN =================

    if (role === "admin") {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return res.json({
          token: generateToken("admin", "admin"),
          user: {
            name: process.env.ADMIN_NAME,
            email,
            role: "admin",
          },
        });
      }

      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    // ================= COLLECTION =================

    let collection;

    if (role === "hospital") {
      collection = db.collection("hospitals");
    } else if (role === "patient") {
      collection = db.collection("patients");
    } else if (role === "doctor") {
      collection = db.collection("doctors");
    } else {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ================= PASSWORD =================

    let match = false;

    // doctor password plain text hole
    if (role === "doctor") {
      match = password === user.password;
    } else {
      match = await bcrypt.compare(
        password,
        user.password
      );
    }

    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    return res.json({
      token: generateToken(
        user._id.toString(),
        user.role
      ),
      user,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};