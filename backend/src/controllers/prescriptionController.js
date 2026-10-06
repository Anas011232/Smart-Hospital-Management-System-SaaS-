import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const THEME = {
  primary: "#0f766e",       
  primaryDark: "#0b5a54",
  accent: "#0ea5e9",        
  gold: "#b45309",         
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

   
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(doctorId) });
    if (!doctor)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    let hospital = null;
    if (doctor.hospitalId) {
      hospital = await db
        .collection("hospitals")
        .findOne({ _id: new ObjectId(doctor.hospitalId) });
    }

   
    const prescription = {
      appointmentId: new ObjectId(appointmentId),
      doctorId: new ObjectId(doctorId),
      patientId: appointment.patientId,
      diagnosis,
      medicines, 
      tests,     
      advice,
      createdAt: new Date(),
    };

    const result = await db.collection("prescriptions").insertOne(prescription);
    const prescriptionId = result.insertedId;

   
    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      { $set: { consultationStatus: "completed", status: "completed", prescriptionId } }
    );

   
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

   
    const pdfUrl = `/uploads/prescriptions/${filename}`;
    await db.collection("prescriptions").updateOne({ _id: prescriptionId }, { $set: { pdfUrl } });

    res.status(201).json({ success: true, message: "Prescription sent to patient successfully", pdfUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

    
    const headerHeight = 96;
    doc.rect(frameInset, frameInset, pageWidth - frameInset * 2, headerHeight).fill(THEME.primary);

    let textStartX = marginX;
    if (hospital?.hospitalImage && fs.existsSync(hospital.hospitalImage)) {
      try {
        doc.image(hospital.hospitalImage, marginX, frameInset + 16, { width: 56, height: 56, fit: [56, 56] });
        textStartX = marginX + 70;
      } catch (e) {
       
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