import axios from "axios";
import { getDB } from "../config/db.js";

export const askDoctorAI = async (req, res) => {
  try {
    const { message } = req.body;

    // 🧠 1. CALL OLLAMA AI
    const aiResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: `
তুমি একজন হাসপাতালের ট্রায়াজ AI।

রোগীর উপসর্গ দেখে নিচের একটি বিভাগ বেছে নাও:

Cardiology
Neurology
Orthopedics
Medicine
Dermatology
Pediatrics
Emergency

নিয়ম:
- শুধু একটি শব্দ লিখবে
- কোনো ব্যাখ্যা দিবে না

যদি নিচের সমস্যা থাকে তাহলে Emergency:
- শ্বাসকষ্ট
- বুক ব্যথা
- অজ্ঞান
- অতিরিক্ত দুর্বলতা

রোগীর উপসর্গ:
${message}
        `,
        stream: false,
      }
    );

    let department = aiResponse.data.response.trim();

    // 🧹 CLEAN OUTPUT
    const validDepartments = [
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "Medicine",
      "Dermatology",
      "Pediatrics",
      "Emergency",
    ];

    const cleanDept =
      validDepartments.find((d) =>
        department.toLowerCase().includes(d.toLowerCase())
      ) || "Medicine";

    // 🗄️ 2. DATABASE CONNECTION
    const db = getDB();

    let doctors = [];

    // 🚨 Emergency case handling
    if (cleanDept === "Emergency") {
      doctors = await db
        .collection("doctors")
        .find({
          $or: [
            { department: { $regex: "Cardiology|Medicine|Neurology", $options: "i" } },
            { specialization: { $regex: "critical|emergency|icu", $options: "i" } },
          ],
        })
        .toArray();
    } else {
      // 👨‍⚕️ NORMAL CASE
      doctors = await db
        .collection("doctors")
        .find({
          $or: [
            { department: { $regex: cleanDept, $options: "i" } },
            { specialization: { $regex: cleanDept, $options: "i" } },
          ],
        })
        .toArray();
    }

    // 📤 RESPONSE
    res.json({
      success: true,
      input: message,
      department: cleanDept,
      totalDoctors: doctors.length,
      doctors,
      reply:
        doctors.length > 0
          ? `Found ${doctors.length} ${cleanDept} doctors`
          : `No doctors found. Please contact hospital reception.`,
    });
  } catch (err) {
    console.log("AI ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};