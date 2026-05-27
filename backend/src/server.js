import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/patient", patientRoutes);

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});