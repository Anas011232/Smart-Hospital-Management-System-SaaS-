// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";

// import { connectDB } from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import hospitalRoutes from "./routes/hospitalRoutes.js";
// import patientRoutes from "./routes/patientRoutes.js";
// import doctorRoutes from "./routes/doctorRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
// import { startSession, nextPatient, toggleBreak, getActiveSession } from "./controllers/doctorSessionController.js";
// import { authMiddleware } from "./middlewares/auth.middleware.js";

// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/uploads", express.static("uploads"));

// app.use("/api/auth", authRoutes);
// app.use("/api/hospital", hospitalRoutes);
// app.use("/api/patient", patientRoutes);
// app.use("/api/doctors", doctorRoutes);

// // AI ROUTE
// app.use("/api/ai", aiRoutes);

// app.use("/api/appointments", appointmentRoutes);

// router.post("/start", authMiddleware, startSession);
// router.post("/next", authMiddleware, nextPatient);
// router.patch("/break", authMiddleware, toggleBreak);
// router.get("/active/:doctorId", getActiveSession);


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http"; // Socket.io এর জন্য এটি প্রয়োজন
import cors from "cors";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/queue.socket.js"; // আপনার সকেট ফাইল

// রাউটস ইমপোর্ট
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorSessionRoutes from "./routes/doctorSessionRoutes.js"; // নতুন রাউট ফাইলটি ইমপোর্ট করুন
import prescriptionRoutes from "./routes/prescriptionRoutes.js"; // এটিও তৈরি করবেন

connectDB();

const app = express();
const server = http.createServer(app); // সকেট সার্ভার তৈরি

// সকেট ইনিশিয়েট করুন
initSocket(server);

// server.js এ এটি আপডেট করুন
app.use(cors({
  origin: "http://localhost:3000", // আপনার ফ্রন্টএন্ডের ইউআরএল
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] // এই লাইনটি না থাকলে টোকেন হেডার ড্রপ হয়ে যায়
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// রাউটস রেজিস্টার করুন
app.use("/api/auth", authRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/appointments", appointmentRoutes);

// নতুন সেশন এবং প্রেসক্রিপশন রাউটস এখানে ব্যবহার করুন
app.use("/api/session", doctorSessionRoutes);
app.use("/api/prescriptions", prescriptionRoutes);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});