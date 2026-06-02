import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const createAppointment = async (req, res) => {
  try {
    const db = getDB();
    const { doctorId, patientInfo } = req.body;
    
    const appointment = {
      patientId: new ObjectId(req.user.id), // AuthMiddleware থেকে আইডি আসছে
      doctorId: new ObjectId(doctorId),
      patientInfo,
      status: 'pending',
      canChat: false,
      createdAt: new Date()
    };
    
    await db.collection("appointments").insertOne(appointment);
    res.status(201).json({ success: true, message: "Request sent!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const acceptAppointment = async (req, res) => {
  try {
    const db = getDB();
    await db.collection("appointments").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: 'accepted', canChat: true } }
    );
    res.json({ success: true, message: "Appointment accepted, Chat unlocked!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};