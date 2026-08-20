// // src/controllers/prescriptionController.js
// import { ObjectId } from "mongodb";
// import { getDB } from "../config/db.js";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// export const createPrescription = async (req, res) => {
//   try {
//     const db = getDB();
//     const { appointmentId, diagnosis, medicines, tests, advice } = req.body;
//     const doctorId = req.user.id;

//     const appointment = await db.collection("appointments").findOne({ _id: new ObjectId(appointmentId) });
//     if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

//     // ১. ডাটাবেজে প্রেসক্রিপশন অবজেক্ট তৈরি
//     const prescription = {
//       appointmentId: new ObjectId(appointmentId),
//       doctorId: new ObjectId(doctorId),
//       patientId: appointment.patientId,
//       diagnosis,
//       medicines, // Array of { name, dosage, duration, instruction }
//       tests,     // Array of strings
//       advice,
//       createdAt: new Date(),
//     };

//     const result = await db.collection("prescriptions").insertOne(prescription);
//     const prescriptionId = result.insertedId;

//     // ২. অ্যাপয়েন্টমেন্ট আপডেট (consultationStatus = completed)
//     await db.collection("appointments").updateOne(
//       { _id: new ObjectId(appointmentId) },
//       { $set: { consultationStatus: "completed", status: "completed", prescriptionId } }
//     );

//     // ৩. PDF জেনারেশন লজিক
//     const doc = new PDFDocument({ margin: 50 });
//     const filename = `prescription_${prescriptionId}.pdf`;
//     const uploadDir = path.join(process.cwd(), "uploads", "prescriptions");
    
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     const filePath = path.join(uploadDir, filename);
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // PDF ডিজাইন এবং কন্টেন্ট
//     doc.fontSize(20).text("HEALTHCARE HOSPITAL", { align: "center" }).moveDown(0.5);
//     doc.fontSize(12).text(`Prescription ID: ${prescriptionId}`, { align: "right" });
//     doc.text(`Date: ${new Date().toLocaleDateString()}`).moveDown(2);

//     doc.fontSize(14).text(`Patient Name: ${appointment.patientInfo.fullName}`);
//     doc.text(`Age: ${appointment.patientInfo.age || "N/A"} | Gender: ${appointment.patientInfo.gender || "N/A"}`);
//     doc.moveDown(1).text("--------------------------------------------------").moveDown(1);

//     doc.fontSize(14).text(`Diagnosis: ${diagnosis}`).moveDown(1);

//     doc.fontSize(14).text("Medicines:", { underline: true }).moveDown(0.5);
//     medicines.forEach((med, idx) => {
//       doc.fontSize(12).text(`${idx + 1}. ${med.name} -- ${med.dosage} -- ${med.duration} (${med.instruction})`);
//     });

//     doc.moveDown(1).fontSize(14).text("Tests Advised:", { underline: true }).moveDown(0.5);
//     tests.forEach((test, idx) => {
//       doc.fontSize(12).text(`- ${test}`);
//     });

//     doc.moveDown(1).fontSize(14).text(`Advice: ${advice}`);

//     doc.end();

//     // PDF URL ডাটাবেজে আপডেট
//     const pdfUrl = `/uploads/prescriptions/${filename}`;
//     await db.collection("prescriptions").updateOne({ _id: prescriptionId }, { $set: { pdfUrl } });

//     res.status(201).json({ success: true, message: "Prescription sent to patient successfully", pdfUrl });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getPatientPrescriptions = async (req, res) => {
//   try {
//     const db = getDB();
//     const patientId = req.user.id;

//     const prescriptions = await db.collection("prescriptions").aggregate([
//       { $match: { patientId: new ObjectId(patientId) } },
//       {
//         $lookup: {
//           from: "doctors",
//           localField: "doctorId",
//           foreignField: "_id",
//           as: "doctorDetails"
//         }
//       },
//       { $unwind: "$doctorDetails" }
//     ]).toArray();

//     res.json({ success: true, prescriptions });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




// // src/controllers/prescriptionController.js
// import { ObjectId } from "mongodb";
// import { getDB } from "../config/db.js";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// // ============================================================
// // রঙ ও ফন্ট থিম — এক জায়গায় রাখা হলো, চাইলে সহজে বদলানো যাবে
// // ============================================================
// const THEME = {
//   primary: "#0f766e",      // hospital header ব্যান্ড
//   primaryDark: "#0b5a54",
//   accent: "#0ea5e9",       // Rx সিম্বল / হাইলাইট
//   text: "#1e293b",
//   muted: "#64748b",
//   border: "#cbd5e1",
//   tableHeaderBg: "#f0fdfa",
//   rowAltBg: "#f8fafc",
//   white: "#ffffff",
// };

// export const createPrescription = async (req, res) => {
//   try {
//     const db = getDB();
//     const { appointmentId, diagnosis, medicines, tests, advice } = req.body;
//     const doctorId = req.user.id;

//     const appointment = await db
//       .collection("appointments")
//       .findOne({ _id: new ObjectId(appointmentId) });
//     if (!appointment)
//       return res.status(404).json({ success: false, message: "Appointment not found" });

//     // ডাক্তার ও হাসপাতাল — dynamic prescription branding-এর জন্য
//     const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(doctorId) });
//     if (!doctor)
//       return res.status(404).json({ success: false, message: "Doctor not found" });

//     let hospital = null;
//     if (doctor.hospitalId) {
//       hospital = await db
//         .collection("hospitals")
//         .findOne({ _id: new ObjectId(doctor.hospitalId) });
//     }

//     // ১. ডাটাবেজে প্রেসক্রিপশন অবজেক্ট তৈরি
//     const prescription = {
//       appointmentId: new ObjectId(appointmentId),
//       doctorId: new ObjectId(doctorId),
//       patientId: appointment.patientId,
//       diagnosis,
//       medicines, // Array of { name, dosage, duration, instruction }
//       tests,     // Array of strings
//       advice,
//       createdAt: new Date(),
//     };

//     const result = await db.collection("prescriptions").insertOne(prescription);
//     const prescriptionId = result.insertedId;

//     // ২. অ্যাপয়েন্টমেন্ট আপডেট (consultationStatus = completed)
//     await db.collection("appointments").updateOne(
//       { _id: new ObjectId(appointmentId) },
//       { $set: { consultationStatus: "completed", status: "completed", prescriptionId } }
//     );

//     // ৩. PDF জেনারেশন — মডার্ন, ব্র্যান্ডেড লেআউট
//     const filename = `prescription_${prescriptionId}.pdf`;
//     const uploadDir = path.join(process.cwd(), "uploads", "prescriptions");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     const filePath = path.join(uploadDir, filename);

//     await generatePrescriptionPDF(filePath, {
//       prescriptionId,
//       doctor,
//       hospital,
//       appointment,
//       diagnosis,
//       medicines,
//       tests,
//       advice,
//     });

//     // PDF URL ডাটাবেজে আপডেট
//     const pdfUrl = `/uploads/prescriptions/${filename}`;
//     await db.collection("prescriptions").updateOne({ _id: prescriptionId }, { $set: { pdfUrl } });

//     res.status(201).json({ success: true, message: "Prescription sent to patient successfully", pdfUrl });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ============================================================
// // PDF বিল্ডার — pdfkit দিয়ে হাতে আঁকা মডার্ন প্রেসক্রিপশন লেআউট
// // ============================================================
// function generatePrescriptionPDF(filePath, data) {
//   const { prescriptionId, doctor, hospital, appointment, diagnosis, medicines, tests, advice } = data;

//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ size: "A4", margin: 0 });
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     writeStream.on("finish", resolve);
//     writeStream.on("error", reject);

//     const pageWidth = doc.page.width;
//     const marginX = 45;
//     const contentWidth = pageWidth - marginX * 2;

//     const hospitalName = hospital?.hospitalName || "Healthcare Hospital";
//     const hospitalAddress = [hospital?.address, hospital?.city, hospital?.state]
//       .filter(Boolean)
//       .join(", ");
//     const hospitalPhone = hospital?.phone || "";
//     const hospitalEmail = hospital?.email || "";

//     // ---------- ১. হেডার ব্যান্ড (হাসপাতাল ব্র্যান্ডিং) ----------
//     const headerHeight = 100;
//     doc.rect(0, 0, pageWidth, headerHeight).fill(THEME.primary);

//     // হাসপাতাল লোগো (থাকলে)
//     let textStartX = marginX;
//     if (hospital?.hospitalImage && fs.existsSync(hospital.hospitalImage)) {
//       try {
//         doc.image(hospital.hospitalImage, marginX, 20, { width: 60, height: 60, fit: [60, 60] });
//         textStartX = marginX + 75;
//       } catch (e) {
//         // ইমেজ করাপ্ট হলেও PDF জেনারেশন যেন না আটকায়
//       }
//     }

//     doc
//       .fillColor(THEME.white)
//       .font("Helvetica-Bold")
//       .fontSize(22)
//       .text(hospitalName.toUpperCase(), textStartX, 24, { width: contentWidth - (textStartX - marginX) });

//     doc
//       .font("Helvetica")
//       .fontSize(9)
//       .fillColor("#d1fae5")
//       .text(
//         [hospitalAddress, hospitalPhone, hospitalEmail].filter(Boolean).join("   |   "),
//         textStartX,
//         52,
//         { width: contentWidth - (textStartX - marginX) }
//       );

//     // ডানপাশে প্রেসক্রিপশন আইডি / তারিখ
//     doc
//       .font("Helvetica")
//       .fontSize(9)
//       .fillColor(THEME.white)
//       .text(`Prescription ID: ${prescriptionId}`, marginX, 26, { width: contentWidth, align: "right" })
//       .text(`Date: ${new Date().toLocaleDateString("en-GB")}`, marginX, 40, {
//         width: contentWidth,
//         align: "right",
//       });

//     let y = headerHeight + 20;

//     // ---------- ২. ডাক্তার তথ্য (বামে) + রোগী তথ্য (ডানে) ----------
//     const colWidth = contentWidth / 2 - 10;

//     doc.font("Helvetica-Bold").fontSize(13).fillColor(THEME.text).text(`Dr. ${doctor.fullName || ""}`, marginX, y);
//     let dy = y + 18;
//     const doctorLine2 = [doctor.qualification].filter(Boolean).join(", ");
//     if (doctorLine2) {
//       doc.font("Helvetica-Oblique").fontSize(9.5).fillColor(THEME.muted).text(doctorLine2, marginX, dy);
//       dy += 13;
//     }
//     const doctorLine3 = [doctor.designation, doctor.specialization].filter(Boolean).join(" — ");
//     if (doctorLine3) {
//       doc.font("Helvetica").fontSize(9.5).fillColor(THEME.primaryDark).text(doctorLine3, marginX, dy);
//       dy += 13;
//     }
//     if (doctor.medicalRegistrationNumber) {
//       doc
//         .font("Helvetica")
//         .fontSize(9)
//         .fillColor(THEME.muted)
//         .text(`Reg. No: ${doctor.medicalRegistrationNumber}`, marginX, dy);
//       dy += 13;
//     }

//     const patientX = marginX + colWidth + 20;
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(11)
//       .fillColor(THEME.text)
//       .text("Patient", patientX, y, { width: colWidth, align: "right" });
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(12)
//       .fillColor(THEME.text)
//       .text(appointment.patientInfo?.fullName || "N/A", patientX, y + 16, { width: colWidth, align: "right" });
//     doc
//       .font("Helvetica")
//       .fontSize(9.5)
//       .fillColor(THEME.muted)
//       .text(
//         `Age: ${appointment.patientInfo?.age || "N/A"}   |   Gender: ${appointment.patientInfo?.gender || "N/A"}`,
//         patientX,
//         y + 32,
//         { width: colWidth, align: "right" }
//       );

//     y = Math.max(dy, y + 50) + 10;

//     // ডিভাইডার
//     doc.moveTo(marginX, y).lineTo(marginX + contentWidth, y).lineWidth(1).strokeColor(THEME.border).stroke();
//     y += 18;

//     // ---------- ৩. ডায়াগনোসিস ----------
//     if (diagnosis) {
//       doc.font("Helvetica-Bold").fontSize(10.5).fillColor(THEME.primaryDark).text("Diagnosis", marginX, y);
//       doc.font("Helvetica").fontSize(10.5).fillColor(THEME.text).text(diagnosis, marginX, y + 14, {
//         width: contentWidth,
//       });
//       y = doc.y + 16;
//     }

//     // ---------- ৪. Rx চিহ্ন ----------
//     doc.font("Helvetica-Bold").fontSize(26).fillColor(THEME.accent).text("Rx", marginX, y);
//     y += 34;

//     // ---------- ৫. মেডিসিন টেবিল ----------
//     if (medicines?.length) {
//       const cols = [
//         { key: "sl", label: "#", width: 22 },
//         { key: "name", label: "Medicine", width: contentWidth * 0.34 },
//         { key: "dosage", label: "Dosage", width: contentWidth * 0.18 },
//         { key: "duration", label: "Duration", width: contentWidth * 0.16 },
//         { key: "instruction", label: "Instruction", width: contentWidth - 22 - contentWidth * 0.68 },
//       ];

//       const drawTableHeader = (rowY) => {
//         doc.rect(marginX, rowY, contentWidth, 22).fill(THEME.tableHeaderBg);
//         let cx = marginX;
//         doc.font("Helvetica-Bold").fontSize(9).fillColor(THEME.primaryDark);
//         cols.forEach((col) => {
//           doc.text(col.label, cx + 6, rowY + 6, { width: col.width - 8 });
//           cx += col.width;
//         });
//         return rowY + 22;
//       };

//       y = drawTableHeader(y);

//       medicines.forEach((med, idx) => {
//         const rowHeight = 24;

//         // পেজের নিচে জায়গা না থাকলে নতুন পেজে টেবিল হেডার-সহ চালিয়ে যাওয়া
//         if (y + rowHeight > doc.page.height - 100) {
//           doc.addPage();
//           y = 40;
//           y = drawTableHeader(y);
//         }

//         if (idx % 2 === 1) {
//           doc.rect(marginX, y, contentWidth, rowHeight).fill(THEME.rowAltBg);
//         }

//         let cx = marginX;
//         const rowValues = [String(idx + 1), med.name, med.dosage, med.duration, med.instruction];
//         doc.font("Helvetica").fontSize(9.5).fillColor(THEME.text);
//         cols.forEach((col, i) => {
//           doc.text(rowValues[i] || "-", cx + 6, y + 7, { width: col.width - 8 });
//           cx += col.width;
//         });

//         // সারির বর্ডার
//         doc
//           .moveTo(marginX, y + rowHeight)
//           .lineTo(marginX + contentWidth, y + rowHeight)
//           .strokeColor(THEME.border)
//           .lineWidth(0.5)
//           .stroke();

//         y += rowHeight;
//       });

//       y += 2;
//     }

//     y += 22;

//     // ---------- ৬. টেস্ট এডভাইসড ----------
//     if (tests?.filter(Boolean).length) {
//       if (y > doc.page.height - 130) {
//         doc.addPage();
//         y = 40;
//       }
//       doc.font("Helvetica-Bold").fontSize(10.5).fillColor(THEME.primaryDark).text("Tests Advised", marginX, y);
//       y = doc.y + 6;
//       tests.filter(Boolean).forEach((test) => {
//         doc.font("Helvetica").fontSize(9.5).fillColor(THEME.text).text(`•  ${test}`, marginX + 6, y);
//         y = doc.y + 4;
//       });
//       y += 12;
//     }

//     // ---------- ৭. উপদেশ ----------
//     if (advice) {
//       if (y > doc.page.height - 130) {
//         doc.addPage();
//         y = 40;
//       }
//       doc.font("Helvetica-Bold").fontSize(10.5).fillColor(THEME.primaryDark).text("Advice", marginX, y);
//       doc.font("Helvetica").fontSize(9.5).fillColor(THEME.text).text(advice, marginX, y + 14, {
//         width: contentWidth,
//       });
//       y = doc.y + 20;
//     }

//     // ---------- ৮. ফুটার — স্বাক্ষর ও নোট ----------
//     const footerY = doc.page.height - 90;
//     doc
//       .moveTo(marginX + contentWidth - 180, footerY)
//       .lineTo(marginX + contentWidth, footerY)
//       .strokeColor(THEME.border)
//       .lineWidth(1)
//       .stroke();
//     doc
//       .font("Helvetica")
//       .fontSize(9)
//       .fillColor(THEME.muted)
//       .text("Doctor's Signature", marginX + contentWidth - 180, footerY + 4, { width: 180, align: "center" });

//     doc
//       .font("Helvetica-Oblique")
//       .fontSize(8)
//       .fillColor(THEME.muted)
//       .text(
//         "This is a computer-generated prescription and does not require a physical stamp for validity.",
//         marginX,
//         doc.page.height - 40,
//         { width: contentWidth, align: "center" }
//       );

//     doc.end();
//   });
// }

// export const getPatientPrescriptions = async (req, res) => {
//   try {
//     const db = getDB();
//     const patientId = req.user.id;

//     const prescriptions = await db.collection("prescriptions").aggregate([
//       { $match: { patientId: new ObjectId(patientId) } },
//       {
//         $lookup: {
//           from: "doctors",
//           localField: "doctorId",
//           foreignField: "_id",
//           as: "doctorDetails"
//         }
//       },
//       { $unwind: "$doctorDetails" }
//     ]).toArray();

//     res.json({ success: true, prescriptions });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };






// src/controllers/prescriptionController.js
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// ============================================================
// রঙ ও ফন্ট থিম — এক জায়গায় রাখা হলো, চাইলে সহজে বদলানো যাবে
// ============================================================
const THEME = {
  primary: "#0f766e",       // হেডার ব্যান্ড / মূল রঙ
  primaryDark: "#0b5a54",
  accent: "#0ea5e9",        // Rx হাইলাইট
  gold: "#b45309",          // ডাক্তারের নাম/ডিগ্রি হাইলাইট (চেম্বার প্যাডের ক্লাসিক টাচ)
  text: "#1e293b",
  muted: "#64748b",
  border: "#cbd5e1",
  frame: "#0f766e",
  tableHeaderBg: "#f0fdfa",
  rowAltBg: "#f8fafc",
  boxBg: "#f8fafc",
  white: "#ffffff",
};

export const createPrescription = async (req, res) => {
  try {
    const db = getDB();
    const { appointmentId, diagnosis, medicines, tests, advice } = req.body;
    const doctorId = req.user.id;

    const appointment = await db
      .collection("appointments")
      .findOne({ _id: new ObjectId(appointmentId) });
    if (!appointment)
      return res.status(404).json({ success: false, message: "Appointment not found" });

    // ডাক্তার ও হাসপাতাল — dynamic prescription branding-এর জন্য
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(doctorId) });
    if (!doctor)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    let hospital = null;
    if (doctor.hospitalId) {
      hospital = await db
        .collection("hospitals")
        .findOne({ _id: new ObjectId(doctor.hospitalId) });
    }

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

    // ৩. PDF জেনারেশন — ক্লাসিক বাংলাদেশি চেম্বার-স্টাইল লেআউট
    const filename = `prescription_${prescriptionId}.pdf`;
    const uploadDir = path.join(process.cwd(), "uploads", "prescriptions");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);

    await generatePrescriptionPDF(filePath, {
      prescriptionId,
      doctor,
      hospital,
      appointment,
      diagnosis,
      medicines,
      tests,
      advice,
    });

    // PDF URL ডাটাবেজে আপডেট
    const pdfUrl = `/uploads/prescriptions/${filename}`;
    await db.collection("prescriptions").updateOne({ _id: prescriptionId }, { $set: { pdfUrl } });

    res.status(201).json({ success: true, message: "Prescription sent to patient successfully", pdfUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// PDF বিল্ডার — pdfkit দিয়ে হাতে আঁকা ক্লাসিক চেম্বার-প্যাড লেআউট
//   • সাজানো ডবল বর্ডার ফ্রেম
//   • হাসপাতাল হেডার ব্যান্ড
//   • ডাক্তারের লেটারহেড ব্লক (নাম, ডিগ্রি, রেজি. নং, চেম্বার টাইম)
//   • পেশেন্ট ইনফো বার
//   • দুই-কলাম বডি: বামে Chief Complaints/Diagnosis, ডানে Rx + মেডিসিন
//   • ফুটার: স্বাক্ষর লাইন
// ============================================================
function generatePrescriptionPDF(filePath, data) {
  const { prescriptionId, doctor, hospital, appointment, diagnosis, medicines, tests, advice } = data;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    writeStream.on("finish", resolve);
    writeStream.on("error", reject);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const frameInset = 16;
    const marginX = 42;
    const contentWidth = pageWidth - marginX * 2;

    const hospitalName = hospital?.hospitalName || "Healthcare Hospital";
    const hospitalAddress = [hospital?.address, hospital?.city, hospital?.state]
      .filter(Boolean)
      .join(", ");
    const hospitalPhone = hospital?.phone || "";
    const hospitalEmail = hospital?.email || "";

    // ---------- ০. ডেকোরেটিভ আউটার ফ্রেম (ক্লাসিক প্যাড বর্ডার) ----------
    doc
      .rect(frameInset, frameInset, pageWidth - frameInset * 2, pageHeight - frameInset * 2)
      .lineWidth(1.4)
      .strokeColor(THEME.frame)
      .stroke();
    doc
      .rect(frameInset + 4, frameInset + 4, pageWidth - (frameInset + 4) * 2, pageHeight - (frameInset + 4) * 2)
      .lineWidth(0.6)
      .strokeColor(THEME.frame)
      .stroke();

    // ---------- ১. হেডার ব্যান্ড (হাসপাতাল ব্র্যান্ডিং) ----------
    const headerHeight = 96;
    doc.rect(frameInset, frameInset, pageWidth - frameInset * 2, headerHeight).fill(THEME.primary);

    let textStartX = marginX;
    if (hospital?.hospitalImage && fs.existsSync(hospital.hospitalImage)) {
      try {
        doc.image(hospital.hospitalImage, marginX, frameInset + 16, { width: 56, height: 56, fit: [56, 56] });
        textStartX = marginX + 70;
      } catch (e) {
        // ইমেজ করাপ্ট হলেও PDF জেনারেশন যেন না আটকায়
      }
    }

    doc
      .fillColor(THEME.white)
      .font("Helvetica-Bold")
      .fontSize(21)
      .text(hospitalName.toUpperCase(), textStartX, frameInset + 18, {
        width: contentWidth - (textStartX - marginX) - 120,
      });

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#d1fae5")
      .text(
        [hospitalAddress, hospitalPhone, hospitalEmail].filter(Boolean).join("   |   "),
        textStartX,
        frameInset + 44,
        { width: contentWidth - (textStartX - marginX) - 120 }
      );

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(THEME.white)
      .text(`Prescription No.`, marginX, frameInset + 18, { width: contentWidth, align: "right" })
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .text(`${prescriptionId}`, marginX, frameInset + 30, { width: contentWidth, align: "right" });

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(THEME.white)
      .text(`Date: ${new Date().toLocaleDateString("en-GB")}`, marginX, frameInset + 50, {
        width: contentWidth,
        align: "right",
      });

    let y = frameInset + headerHeight + 16;

    // ---------- ২. ডাক্তারের লেটারহেড ব্লক (কেন্দ্রে, চেম্বার-প্যাড স্টাইল) ----------
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(THEME.gold)
      .text(`Dr. ${doctor.fullName || ""}`, marginX, y, { width: contentWidth, align: "center" });
    y = doc.y + 2;

    const doctorLine2 = [doctor.qualification].filter(Boolean).join(", ");
    if (doctorLine2) {
      doc
        .font("Helvetica-Oblique")
        .fontSize(9.5)
        .fillColor(THEME.text)
        .text(doctorLine2, marginX, y, { width: contentWidth, align: "center" });
      y = doc.y + 1;
    }

    const doctorLine3 = [doctor.designation, doctor.specialization, doctor.department]
      .filter(Boolean)
      .join(" · ");
    if (doctorLine3) {
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(THEME.primaryDark)
        .text(doctorLine3, marginX, y, { width: contentWidth, align: "center" });
      y = doc.y + 1;
    }

    const regLine = [
      doctor.medicalRegistrationNumber ? `BMDC Reg. No: ${doctor.medicalRegistrationNumber}` : null,
      doctor.availableDays?.length
        ? `Chamber: ${doctor.availableDays.join(", ")}${
            doctor.startTime && doctor.endTime ? ` (${doctor.startTime} - ${doctor.endTime})` : ""
          }`
        : null,
    ]
      .filter(Boolean)
      .join("      ");
    if (regLine) {
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(THEME.muted)
        .text(regLine, marginX, y, { width: contentWidth, align: "center" });
      y = doc.y + 4;
    }

    // লেটারহেড আন্ডারলাইন (ডাবল রুল)
    y += 6;
    doc.moveTo(marginX, y).lineTo(marginX + contentWidth, y).lineWidth(1.2).strokeColor(THEME.primary).stroke();
    doc
      .moveTo(marginX, y + 3)
      .lineTo(marginX + contentWidth, y + 3)
      .lineWidth(0.5)
      .strokeColor(THEME.border)
      .stroke();
    y += 16;

    // ---------- ৩. পেশেন্ট ইনফো বার (বক্সড) ----------
    const patientBarHeight = 34;
    doc.rect(marginX, y, contentWidth, patientBarHeight).fill(THEME.boxBg);
    doc.rect(marginX, y, contentWidth, patientBarHeight).lineWidth(0.6).strokeColor(THEME.border).stroke();

    const patientColW = contentWidth / 3;
    const patientFields = [
      { label: "PATIENT NAME", value: appointment.patientInfo?.fullName || "N/A" },
      { label: "AGE / GENDER", value: `${appointment.patientInfo?.age || "N/A"} yrs / ${appointment.patientInfo?.gender || "N/A"}` },
      { label: "APPOINTMENT DATE", value: appointment.date || new Date(appointment.createdAt || Date.now()).toLocaleDateString("en-GB") },
    ];
    patientFields.forEach((field, i) => {
      const fx = marginX + i * patientColW + 10;
      doc.font("Helvetica").fontSize(7).fillColor(THEME.muted).text(field.label, fx, y + 6, { width: patientColW - 16 });
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(THEME.text)
        .text(field.value, fx, y + 17, { width: patientColW - 16 });
    });

    y += patientBarHeight + 18;

    // ---------- ৪. দুই-কলাম বডি ----------
    const bodyTopY = y;
    const leftColWidth = contentWidth * 0.3;
    const gap = 16;
    const rightColX = marginX + leftColWidth + gap;
    const rightColWidth = contentWidth - leftColWidth - gap;
    const dividerX = marginX + leftColWidth + gap / 2;

    // -- বাম কলাম: Chief Complaints + Diagnosis --
    let leftY = bodyTopY;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(THEME.primaryDark).text("C/C (Complaints)", marginX, leftY);
    leftY = doc.y + 4;
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(THEME.text)
      .text(appointment.patientInfo?.symptoms || "Not recorded", marginX, leftY, { width: leftColWidth });
    leftY = doc.y + 16;

    if (diagnosis) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(THEME.primaryDark).text("Diagnosis", marginX, leftY);
      leftY = doc.y + 4;
      doc.font("Helvetica").fontSize(9).fillColor(THEME.text).text(diagnosis, marginX, leftY, { width: leftColWidth });
      leftY = doc.y + 16;
    }

    // -- ডান কলাম: Rx + মেডিসিন টেবিল --
    let rightY = bodyTopY;
    doc.font("Helvetica-BoldOblique").fontSize(24).fillColor(THEME.accent).text("Rx", rightColX, rightY);
    doc
      .moveTo(rightColX + 34, rightY + 18)
      .lineTo(rightColX + rightColWidth, rightY + 18)
      .lineWidth(0.6)
      .strokeColor(THEME.border)
      .stroke();
    rightY += 34;

    if (medicines?.length) {
      const cols = [
        { key: "sl", label: "#", width: 18 },
        { key: "name", label: "Medicine", width: rightColWidth * 0.36 },
        { key: "dosage", label: "Dosage", width: rightColWidth * 0.18 },
        { key: "duration", label: "Duration", width: rightColWidth * 0.16 },
        { key: "instruction", label: "Instruction", width: rightColWidth - 18 - rightColWidth * 0.7 },
      ];

      const drawTableHeader = (rowY, xStart, tableWidth, tableCols) => {
        doc.rect(xStart, rowY, tableWidth, 20).fill(THEME.tableHeaderBg);
        let cx = xStart;
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(THEME.primaryDark);
        tableCols.forEach((col) => {
          doc.text(col.label, cx + 5, rowY + 6, { width: col.width - 6 });
          cx += col.width;
        });
        return rowY + 20;
      };

      rightY = drawTableHeader(rightY, rightColX, rightColWidth, cols);

      medicines.forEach((med, idx) => {
        const rowHeight = 26;
        let xStart = rightColX;
        let tableWidth = rightColWidth;
        let activeCols = cols;

        // পেজের নিচে জায়গা না থাকলে নতুন পেজে (ফুল-উইডথ কন্টিনিউয়েশন টেবিল হিসেবে)
        if (rightY + rowHeight > pageHeight - frameInset - 90) {
          doc.addPage();
          doc
            .rect(frameInset, frameInset, pageWidth - frameInset * 2, pageHeight - frameInset * 2)
            .lineWidth(1.4)
            .strokeColor(THEME.frame)
            .stroke();
          rightY = frameInset + 30;
          xStart = marginX;
          tableWidth = contentWidth;
          activeCols = [
            { key: "sl", label: "#", width: 24 },
            { key: "name", label: "Medicine", width: contentWidth * 0.34 },
            { key: "dosage", label: "Dosage", width: contentWidth * 0.18 },
            { key: "duration", label: "Duration", width: contentWidth * 0.16 },
            { key: "instruction", label: "Instruction", width: contentWidth - 24 - contentWidth * 0.68 },
          ];
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(THEME.primaryDark)
            .text("Medicines (continued)", marginX, frameInset + 10);
          rightY = drawTableHeader(rightY, xStart, tableWidth, activeCols);
        }

        if (idx % 2 === 1) {
          doc.rect(xStart, rightY, tableWidth, rowHeight).fill(THEME.rowAltBg);
        }

        let cx = xStart;
        const rowValues = [String(idx + 1), med.name, med.dosage, med.duration, med.instruction];
        doc.font("Helvetica-Bold").fontSize(9).fillColor(THEME.text);
        doc.text(rowValues[0], cx + 5, rightY + 8, { width: activeCols[0].width - 6 });
        cx += activeCols[0].width;
        doc.text(rowValues[1] || "-", cx + 5, rightY + 8, { width: activeCols[1].width - 6 });
        cx += activeCols[1].width;
        doc.font("Helvetica").fontSize(9);
        doc.text(rowValues[2] || "-", cx + 5, rightY + 8, { width: activeCols[2].width - 6 });
        cx += activeCols[2].width;
        doc.text(rowValues[3] || "-", cx + 5, rightY + 8, { width: activeCols[3].width - 6 });
        cx += activeCols[3].width;
        doc.text(rowValues[4] || "-", cx + 5, rightY + 8, { width: activeCols[4].width - 6 });

        doc
          .moveTo(xStart, rightY + rowHeight)
          .lineTo(xStart + tableWidth, rightY + rowHeight)
          .strokeColor(THEME.border)
          .lineWidth(0.4)
          .stroke();

        rightY += rowHeight;
      });
    }
    rightY += 10;

    // -- দুই-কলামের মাঝে ভার্টিকাল ডিভাইডার (একই পেজের অংশটুকুতে) --
    const columnBottomY = Math.min(Math.max(leftY, bodyTopY + 40), pageHeight - frameInset - 60);
    doc
      .moveTo(dividerX, bodyTopY)
      .lineTo(dividerX, columnBottomY)
      .lineWidth(0.6)
      .strokeColor(THEME.border)
      .stroke();

    y = Math.max(leftY, rightY) + 14;
    if (y > pageHeight - frameInset - 140) {
      doc.addPage();
      doc
        .rect(frameInset, frameInset, pageWidth - frameInset * 2, pageHeight - frameInset * 2)
        .lineWidth(1.4)
        .strokeColor(THEME.frame)
        .stroke();
      y = frameInset + 24;
    }

    // ---------- ৫. টেস্ট এডভাইসড (ফুল-উইডথ) ----------
    if (tests?.filter(Boolean).length) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(THEME.primaryDark).text("Investigations Advised", marginX, y);
      y = doc.y + 5;
      tests.filter(Boolean).forEach((test) => {
        doc.font("Helvetica").fontSize(9).fillColor(THEME.text).text(`•  ${test}`, marginX + 6, y);
        y = doc.y + 3;
      });
      y += 10;
    }

    // ---------- ৬. উপদেশ (ফুল-উইডথ) ----------
    if (advice) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(THEME.primaryDark).text("Advice", marginX, y);
      doc.font("Helvetica").fontSize(9).fillColor(THEME.text).text(advice, marginX, y + 13, { width: contentWidth });
      y = doc.y + 18;
    }

    // ---------- ৭. ফুটার — স্বাক্ষর ও নোট ----------
    const footerY = pageHeight - frameInset - 70;
    doc
      .moveTo(marginX + contentWidth - 190, footerY)
      .lineTo(marginX + contentWidth, footerY)
      .strokeColor(THEME.border)
      .lineWidth(1)
      .stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .fillColor(THEME.text)
      .text(`Dr. ${doctor.fullName || ""}`, marginX + contentWidth - 190, footerY + 4, {
        width: 190,
        align: "center",
      });
    if (doctor.medicalRegistrationNumber) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(THEME.muted)
        .text(`Reg. No: ${doctor.medicalRegistrationNumber}`, marginX + contentWidth - 190, footerY + 17, {
          width: 190,
          align: "center",
        });
    }

    doc
      .font("Helvetica-Oblique")
      .fontSize(7.5)
      .fillColor(THEME.muted)
      .text(
        "This is a computer-generated prescription and does not require a physical stamp for validity.",
        marginX,
        pageHeight - frameInset - 22,
        { width: contentWidth, align: "center" }
      );

    doc.end();
  });
}

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