// src/controllers/prescriptionController.js
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const createPrescription = async (req, res) => {
  try {
    const db = getDB();
    const { appointmentId, diagnosis, medicines, tests, advice } = req.body;
    const doctorId = req.user.id;

    const appointment = await db.collection("appointments").findOne({ _id: new ObjectId(appointmentId) });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    // ১. ডাটাবেজে প্রেসক্রিপশন অবজেক্ট তৈরি
    const prescription = {
      appointmentId: new ObjectId(appointmentId),
      doctorId: new ObjectId(doctorId),
      patientId: appointment.patientId,
      diagnosis,
      medicines, // Array of { name, dosage, duration, instruction }
      tests,     // Array of strings
      advice,
      createdAt: new Date(),
    };

    const result = await db.collection("prescriptions").insertOne(prescription);
    const prescriptionId = result.insertedId;

    // ২. অ্যাপয়েন্টমেন্ট আপডেট (consultationStatus = completed)
    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      { $set: { consultationStatus: "completed", status: "completed", prescriptionId } }
    );

    // ৩. PDF জেনারেশন লজিক
    const doc = new PDFDocument({ margin: 50 });
    const filename = `prescription_${prescriptionId}.pdf`;
    const uploadDir = path.join(process.cwd(), "uploads", "prescriptions");
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // PDF ডিজাইন এবং কন্টেন্ট
    doc.fontSize(20).text("HEALTHCARE HOSPITAL", { align: "center" }).moveDown(0.5);
    doc.fontSize(12).text(`Prescription ID: ${prescriptionId}`, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`).moveDown(2);

    doc.fontSize(14).text(`Patient Name: ${appointment.patientInfo.fullName}`);
    doc.text(`Age: ${appointment.patientInfo.age || "N/A"} | Gender: ${appointment.patientInfo.gender || "N/A"}`);
    doc.moveDown(1).text("--------------------------------------------------").moveDown(1);

    doc.fontSize(14).text(`Diagnosis: ${diagnosis}`).moveDown(1);

    doc.fontSize(14).text("Medicines:", { underline: true }).moveDown(0.5);
    medicines.forEach((med, idx) => {
      doc.fontSize(12).text(`${idx + 1}. ${med.name} -- ${med.dosage} -- ${med.duration} (${med.instruction})`);
    });

    doc.moveDown(1).fontSize(14).text("Tests Advised:", { underline: true }).moveDown(0.5);
    tests.forEach((test, idx) => {
      doc.fontSize(12).text(`- ${test}`);
    });

    doc.moveDown(1).fontSize(14).text(`Advice: ${advice}`);

    doc.end();

    // PDF URL ডাটাবেজে আপডেট
    const pdfUrl = `/uploads/prescriptions/${filename}`;
    await db.collection("prescriptions").updateOne({ _id: prescriptionId }, { $set: { pdfUrl } });

    res.status(201).json({ success: true, message: "Prescription sent to patient successfully", pdfUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const db = getDB();
    const patientId = req.user.id;

    const prescriptions = await db.collection("prescriptions").aggregate([
      { $match: { patientId: new ObjectId(patientId) } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetails"
        }
      },
      { $unwind: "$doctorDetails" }
    ]).toArray();

    res.json({ success: true, prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};