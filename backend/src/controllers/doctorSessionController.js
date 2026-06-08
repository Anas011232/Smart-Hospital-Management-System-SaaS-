// src/controllers/doctorSessionController.js
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { emitQueueUpdate, getIO, emitSessionEnded } from "../socket/queue.socket.js";

// ১. সেশন শুরু করা
export const startSession = async (req, res) => {
  try {
    const db = getDB();
    const { appointmentDate } = req.body;
    const doctorId = req.user.id;

    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    // অলরেডি সেশন একটিভ আছে কিনা চেক করা
    const existingSession = await db.collection("doctor_sessions").findOne({
      doctorId: new ObjectId(doctorId),
      appointmentDate,
      status: "active",
    });

    if (existingSession) {
      return res.json({ success: true, message: "Session already active", session: existingSession });
    }

    // ঐ তারিখের সব Accepted অ্যাপয়েন্টমেন্টের consultationStatus 'waiting' করা
    await db.collection("appointments").updateMany(
      {
        doctorId: new ObjectId(doctorId),
        "patientInfo.appointmentDate": appointmentDate,
        status: "accepted",
        consultationStatus: { $exists: false }
      },
      { $set: { consultationStatus: "waiting" } }
    );

    const newSession = {
      doctorId: new ObjectId(doctorId),
      appointmentDate,
      status: "active",
      currentSerial: 1,
      isBreak: false,
      breakReason: "",
      startedAt: new Date(),
    };

    const result = await db.collection("doctor_sessions").insertOne(newSession);
    newSession._id = result.insertedId;

    // সকেট লাইভ আপডেট (DATE-BASED ROOM)
    emitQueueUpdate(`room_${doctorId}_${appointmentDate}`, { currentSerial: 1, isBreak: false, breakReason: "" });

    res.status(201).json({ success: true, message: "Session started successfully", session: newSession });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ২. নেক্সট পেশেন্ট কল করা
export const nextPatient = async (req, res) => {
  try {
    const db = getDB();
    const doctorId = req.user.id;
    const { sessionId } = req.body;

    const session = await db.collection("doctor_sessions").findOne({ _id: new ObjectId(sessionId) });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    const nextSerial = session.currentSerial + 1;

    await db.collection("doctor_sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { currentSerial: nextSerial, isBreak: false, breakReason: "" } }
    );

    // EMIT WITH DATE-BASED ROOM
    emitQueueUpdate(`room_${doctorId}_${session.appointmentDate}`, { currentSerial: nextSerial, isBreak: false, breakReason: "" });

    // Check auto-end after advancing
    await checkSessionAutoEnd(sessionId, session.appointmentDate, doctorId);

    res.json({ success: true, message: "Moved to next patient", currentSerial: nextSerial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// controllers/doctorSessionController.js
// export const nextPatient = async (req, res) => {
//   try {
//     const db = getDB();
//     const doctorId = req.user.id;
//     const { sessionId } = req.body;

//     const session = await db.collection("doctor_sessions").findOne({ _id: new ObjectId(sessionId) });
    
//     // ঐ দিনের সব 'accepted' রোগী খুঁজে বের করা
//     const patients = await db.collection("appointments").find({
//       doctorId: new ObjectId(doctorId),
//       "patientInfo.appointmentDate": session.appointmentDate,
//       status: "accepted"
//     }).sort({ serialNumber: 1 }).toArray();

//     const nextSerial = session.currentSerial + 1;

//     // যদি আর রোগী না থাকে, সেশন ক্লোজ করুন
//     if (nextSerial > patients.length) {
//       await db.collection("doctor_sessions").updateOne({ _id: new ObjectId(sessionId) }, { $set: { status: "completed" } });
//       return res.json({ success: true, finished: true });
//     }

//     await db.collection("doctor_sessions").updateOne({ _id: new ObjectId(sessionId) }, { $set: { currentSerial: nextSerial } });
//     emitQueueUpdate(`room_${doctorId}`, { currentSerial: nextSerial, isBreak: false });
    
//     res.json({ success: true, currentSerial: nextSerial });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };





// ৩. ব্রেক নেওয়া বা ব্রেক শেষ করা
export const toggleBreak = async (req, res) => {
  try {
    const db = getDB();
    const doctorId = req.user.id;
    const { sessionId, isBreak, breakReason } = req.body;

    await db.collection("doctor_sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { isBreak, breakReason: breakReason || "" } }
    );

    const session = await db.collection("doctor_sessions").findOne({ _id: new ObjectId(sessionId) });

    // EMIT WITH DATE-BASED ROOM
    emitQueueUpdate(`room_${doctorId}_${session.appointmentDate}`, {
      currentSerial: session.currentSerial,
      isBreak,
      breakReason: breakReason || "",
    });

    res.json({ success: true, message: "Break status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ৪. রানিং সেশন গেট করা
export const getActiveSession = async (req, res) => {
  try {
    const db = getDB();
    const doctorId = req.params.doctorId;
    const date = req.query.date; // DATE FILTER FROM QUERY
    
    // Build query filter
    const query = {
      doctorId: new ObjectId(doctorId),
      status: "active"
    };

    // If date provided, filter by date
    if (date) {
      query.appointmentDate = date;
    }

    const session = await db.collection("doctor_sessions").findOne(query);

    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// FINISH SESSION
export const finishSession = async (req, res) => {
  try {
    const db = getDB();
    const doctorId = req.user.id;
    const { sessionId, appointmentDate } = req.body;

    const session = await db.collection("doctor_sessions").findOne({
      _id: new ObjectId(sessionId),
      doctorId: new ObjectId(doctorId),
    });

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const waitingOrInProgress = await db.collection("appointments").countDocuments({
      doctorId: new ObjectId(doctorId),
      "patientInfo.appointmentDate": appointmentDate,
      status: "accepted",
      consultationStatus: { $in: ["waiting", "in_consultation"] },
    });

    if (waitingOrInProgress > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot end session. Still have waiting or in-progress patients.",
        remainingCount: waitingOrInProgress,
      });
    }

    await db.collection("doctor_sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      {
        $set: {
          status: "completed",
          endedAt: new Date(),
        },
      }
    );

    emitSessionEnded(`room_${doctorId}`, {
      sessionId,
      status: "completed",
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Session finished successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// AUTO-CHECK FOR SESSION END
export const checkSessionAutoEnd = async (sessionId, appointmentDate, doctorId) => {
  try {
    const db = getDB();

    const remaining = await db.collection("appointments").countDocuments({
      doctorId: new ObjectId(doctorId),
      "patientInfo.appointmentDate": appointmentDate,
      status: "accepted",
      consultationStatus: { $in: ["waiting", "in_consultation"] },
    });

    if (remaining === 0) {
      await db.collection("doctor_sessions").updateOne(
        { _id: new ObjectId(sessionId) },
        {
          $set: {
            status: "completed",
            endedAt: new Date(),
          },
        }
      );

      emitSessionEnded(`room_${doctorId}`, {
        sessionId,
        status: "completed",
        automatic: true,
        timestamp: new Date(),
      });

      return true;
    }

    return false;
  } catch (err) {
    console.error("Error in checkSessionAutoEnd:", err.message);
    return false;
  }
};
