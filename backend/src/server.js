
import path from "path";
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
import medicineRoutes from "./routes/medicineRoutes.js";
import testRoutes from "./routes/testRoutes.js";
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
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
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

app.use("/api/medicines", medicineRoutes);
app.use("/api/tests", testRoutes);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import http from "http";
// import cors from "cors";
// import cookieParser from "cookie-parser"; // 1. cookie-parser ইমপোর্ট করুন
// import { connectDB } from "./config/db.js";
// import { initSocket } from "./socket/queue.socket.js";

// // রাউটস ইমপোর্ট
// import authRoutes from "./routes/authRoutes.js";
// import hospitalRoutes from "./routes/hospitalRoutes.js";
// import patientRoutes from "./routes/patientRoutes.js";
// import doctorRoutes from "./routes/doctorRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
// import doctorSessionRoutes from "./routes/doctorSessionRoutes.js";
// import prescriptionRoutes from "./routes/prescriptionRoutes.js";
// import medicineRoutes from "./routes/medicineRoutes.js";
// import testRoutes from "./routes/testRoutes.js";

// connectDB();

// const app = express();
// const server = http.createServer(app);

// initSocket(server);

// // 2. CORS কনফিগারেশনে X-CSRF-Token হেডারটি যোগ করুন
// app.use(cors({
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"] // এখানে X-CSRF-Token যোগ করা জরুরি
// }));

// app.use(express.json());
// app.use(cookieParser()); // 3. cookie-parser মিডলওয়্যারটি অবশ্যই এখানে (অন্যান্য রাউটের আগে) যুক্ত করুন!
// app.use("/uploads", express.static("uploads"));

// // রাউটস রেজিস্টার করুন
// app.use("/api/auth", authRoutes);
// app.use("/api/hospital", hospitalRoutes);
// app.use("/api/patient", patientRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/session", doctorSessionRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);
// app.use("/api/medicines", medicineRoutes);
// app.use("/api/tests", testRoutes);

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });