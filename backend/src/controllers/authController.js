import bcrypt from "bcryptjs";
import { getDB } from "../config/db.js";
import { generateToken } from "../utils/token.js";

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  const db = getDB();

  // ---------------- ADMIN ----------------
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

    return res.status(401).json({ message: "Invalid admin" });
  }

  // ---------------- HOSPITAL / PATIENT ----------------
  const collection =
    role === "hospital"
      ? db.collection("hospitals")
      : db.collection("patients");

  const user = await collection.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).json({ message: "Wrong password" });

  return res.json({
    token: generateToken(user._id.toString(), user.role),
    user,
  });
};