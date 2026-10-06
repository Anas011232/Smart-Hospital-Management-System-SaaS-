import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { emitQueueUpdate, getIO } from "../socket/queue.socket.js";

// ATOMIC serial number generation using MongoDB counters
// export const createAppointment = async (req, res) => {
//   try {
//     const db = getDB();
//     const { doctorId, patientInfo } = req.body;
//     const appointmentDate = patientInfo.appointmentDate;

//     // Find max serial for this doctor on this date
//     const lastAppointment = await db
//       .collection("appointments")
//       .findOne(
//         {
//           doctorId: new ObjectId(doctorId),
//           "patientInfo.appointmentDate": appointmentDate,
//         },
//         { sort: { serialNumber: -1 } }
//       );

//     const serialNumber = (lastAppointment?.serialNumber || 0) + 1;

//     const appointment = {
//       patientId: new ObjectId(req.user.id),
//       doctorId: new ObjectId(doctorId),
//       patientInfo,
//       serialNumber,
//       status: "pending",
//       consultationStatus: null, // Will be set to "waiting" when doctor accepts
//       consultationStartedAt: null,
//       consultationEndedAt: null,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await db.collection("appointments").insertOne(appointment);

//     res.status(201).json({
//       success: true,
//       message: "Appointment request sent",
//       appointmentId: result.insertedId,
//       serialNumber,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };





const isDayMatching = (availableDays, dateObj) => {
  if (!availableDays) return true;

  let daysArray = [];
  if (Array.isArray(availableDays)) {
    daysArray = availableDays
      .flatMap((item) => String(item).split(","))
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  } else if (typeof availableDays === "string") {
    daysArray = availableDays
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }

  if (daysArray.length === 0) return true;

  if (daysArray.some((d) => ["everyday", "daily", "all", "all days", "every day"].includes(d))) {
    return true;
  }

  const targetDayNum = dateObj.getDay();

  const dayMap = {
    0: ["sun", "sunday", "su"],
    1: ["mon", "monday", "mo"],
    2: ["tue", "tues", "tuesday", "tu"],
    3: ["wed", "wednesday", "we"],
    4: ["thu", "thur", "thurs", "thursday", "th"],
    5: ["fri", "friday", "fr"],
    6: ["sat", "saturday", "sa"],
  };

  const validRepresentations = dayMap[targetDayNum] || [];

  return daysArray.some((d) => {
    const cleanD = d.toLowerCase().trim();
    return validRepresentations.some(
      (rep) => cleanD === rep || cleanD.startsWith(rep) || rep.startsWith(cleanD)
    );
  });
};

export const createAppointment = async (req, res) => {
  try {
    const db = getDB();
    const { doctorId, patientInfo } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID required",
      });
    }

    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(doctorId),
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // HOSPITAL VERIFICATION CHECK
    if (doctor.hospitalId) {
      const hospital = await db.collection("hospitals").findOne({ _id: new ObjectId(doctor.hospitalId) });
      if (!hospital || !hospital.isVerified) {
        return res.status(403).json({
          success: false,
          message: "This doctor's hospital is unverified. Appointments cannot be booked for unverified hospitals.",
        });
      }
    }

    // DATE CHECK
    const appointmentDate = patientInfo.appointmentDate;

    const [y, m, d] = appointmentDate.split("-").map(Number);
    const selectedDate = new Date(y, m - 1, d);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past date not allowed",
      });
    }

    // DAY CHECK
    const isAvailable = isDayMatching(doctor.availableDays, selectedDate);

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Doctor unavailable on this day",
      });
    }

    // DAILY LIMIT ONLY
    const maxPatients = Number(doctor.maxPatientsPerDay || 0);
    if (maxPatients > 0) {
      const totalPatients = await db.collection("appointments").countDocuments({
        doctorId: new ObjectId(doctorId),
        "patientInfo.appointmentDate": appointmentDate,
        status: { $ne: "cancelled" },
      });

      if (totalPatients >= maxPatients) {
        return res.status(400).json({
          success: false,
          message: `Daily appointment limit (${maxPatients}) reached for this date. Please choose another date.`,
        });
      }
    }

    // SERIAL
    const lastAppointment = await db.collection("appointments").findOne(
      {
        doctorId: new ObjectId(doctorId),
        "patientInfo.appointmentDate": appointmentDate,
      },
      { sort: { serialNumber: -1 } }
    );

    const serialNumber = (lastAppointment?.serialNumber || 0) + 1;

    // CREATE
    const appointment = {
      patientId: new ObjectId(req.user.id),
      doctorId: new ObjectId(doctorId),
      patientInfo,
      serialNumber,
      status: "pending",
      consultationStatus: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("appointments").insertOne(appointment);

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointmentId: result.insertedId,
      serialNumber,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





// export const createAppointment = async (req, res) => {
//   try {
//     const db = getDB();
//     const { doctorId, patientInfo } = req.body;
//     const date = patientInfo.appointmentDate;

//     // ১. শুধুমাত্র ওই নির্দিষ্ট ডাক্তারের ওই নির্দিষ্ট দিনের সব অ্যাপয়েন্টমেন্ট খুঁজুন
//     const lastAppointment = await db.collection("appointments")
//       .find({
//         doctorId: new ObjectId(doctorId),
//         "patientInfo.appointmentDate": date
//       })
//       .sort({ serialNumber: -1 }) // সবচেয়ে বড় সিরিয়ালটি আগে আনুন
//       .limit(1)
//       .toArray();

//     // ২. যদি ওই দিনে কোনো অ্যাপয়েন্টমেন্ট না থাকে, তবে সিরিয়াল ১, নাহলে আগের সিরিয়ালের সাথে +১
//     const serialNumber = lastAppointment.length > 0 ? lastAppointment[0].serialNumber + 1 : 1;

//     const appointment = {
//       patientId: new ObjectId(req.user.id),
//       doctorId: new ObjectId(doctorId),
//       patientInfo,
//       serialNumber, // ডাইনামিক সিরিয়াল
//       status: "pending",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     await db.collection("appointments").insertOne(appointment);

//     res.status(201).json({
//       success: true,
//       message: "Appointment request sent",
//       serialNumber 
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const acceptAppointment = async (req, res) => {
  try {
    const db = getDB();
    const appointmentId = req.params.id;

    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          status: "accepted",
          consultationStatus: "waiting",
          updatedAt: new Date(),
        },
      }
    );

    // EMIT WITH DATE-BASED ROOM
    const doctorId = appointment.doctorId.toString();
    const appointmentDate = appointment.patientInfo?.appointmentDate;
    getIO()?.to(`room_${doctorId}_${appointmentDate}`).emit("appointment-accepted", {
      appointmentId,
      serialNumber: appointment.serialNumber,
    });

    res.json({
      success: true,
      message: "Appointment accepted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const db = getDB();
    const appointmentId = req.params.id;

    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          status: "rejected",
          updatedAt: new Date(),
        },
      }
    );

    res.json({
      success: true,
      message: "Appointment rejected",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getDoctorAppointments = async (req, res) => {
  try {
    const db = getDB();

    const doctorId = req.user.id;

    const appointments = await db
      .collection("appointments")
      .find({
        doctorId: new ObjectId(doctorId),
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      appointments,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// appointmentController.js এ এমন একটি ফাংশন রাখুন
// appointmentController.js
export const getMyAppointments = async (req, res) => {
  try {
    const db = getDB();
    const appointments = await db.collection("appointments").aggregate([
      { $match: { patientId: new ObjectId(req.user.id) } },
      { 
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetails"
        }
      },
      { 
        $unwind: { 
          path: "$doctorDetails", 
          preserveNullAndEmptyArrays: true // ডাক্তার না থাকলে যেন এরর না দেয়
        } 
      }
    ]).toArray();

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// নতুন এই ফাংশনটি যোগ করুন
// export const getAppointmentById = async (req, res) => {
//   try {
//     const db = getDB();
//     const appointment = await db.collection("appointments").findOne({ 
//       _id: new ObjectId(req.params.id) 
//     });
    
//     if (!appointment) {
//       return res.status(404).json({ success: false, message: "Appointment not found" });
//     }
    
//     res.json(appointment);
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const getAppointmentById = async (req, res) => {
  try {
    const db = getDB();

    const appointment = await db.collection("appointments").aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $unwind: {
          path: "$doctorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]).toArray();

    if (!appointment.length) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      appointment: appointment[0],
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const finishSession = async (req, res) => {
  try {
    const db = getDB();
    const doctorId = req.user.id;
    const { appointmentDate } = req.body;

    // ১. চেক করুন আজও কি কোনো রোগী 'accepted' অবস্থায় আছে?
    const remaining = await db.collection("appointments").countDocuments({
      doctorId: new ObjectId(doctorId),
      "patientInfo.appointmentDate": appointmentDate,
      status: "accepted"
    });

    if (remaining === 0) {
      // ২. সব রোগী শেষ, তাই আজ আর কোনো নতুন রোগী নেওয়া যাবে না
      // চাইলে এখানে সেশন স্ট্যাটাস আপডেট করতে পারেন
      return res.json({ success: true, finished: true, message: "All patients seen!" });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// SKIP PATIENT
export const skipPatient = async (req, res) => {
  try {
    const db = getDB();
    const appointmentId = req.params.id;
    const doctorId = req.user.id;

    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== doctorId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized" });
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          consultationStatus: "skipped",
          updatedAt: new Date(),
        },
      }
    );

    // EMIT WITH DATE-BASED ROOM
    const appointmentDate = appointment.patientInfo?.appointmentDate;
    getIO()
      ?.to(`room_${doctorId}_${appointmentDate}`)
      .emit("patient-skipped", {
        appointmentId,
        serialNumber: appointment.serialNumber,
        timestamp: new Date(),
      });

    res.json({
      success: true,
      message: "Patient skipped",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// RECALL PATIENT
export const recallPatient = async (req, res) => {
  try {
    const db = getDB();
    const appointmentId = req.params.id;
    const doctorId = req.user.id;

    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== doctorId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized" });
    }

    if (appointment.consultationStatus !== "skipped") {
      return res.status(400).json({
        success: false,
        message: "Only skipped patients can be recalled",
      });
    }

    const maxSerial = await db
      .collection("appointments")
      .findOne(
        {
          doctorId: new ObjectId(doctorId),
          "patientInfo.appointmentDate":
            appointment.patientInfo.appointmentDate,
          consultationStatus: { $in: ["waiting", "in_consultation"] },
        },
        { sort: { serialNumber: -1 } }
      );

    const newSerial = (maxSerial?.serialNumber || appointment.serialNumber - 1) + 1;

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          consultationStatus: "waiting",
          serialNumber: newSerial,
          updatedAt: new Date(),
        },
      }
    );

    // EMIT WITH DATE-BASED ROOM
    const appointmentDate = appointment.patientInfo?.appointmentDate;
    getIO()
      ?.to(`room_${doctorId}_${appointmentDate}`)
      .emit("patient-recalled", {
        appointmentId,
        serialNumber: newSerial,
        timestamp: new Date(),
      });

    res.json({
      success: true,
      message: "Patient recalled to queue",
      newSerial,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET QUEUE STATISTICS
export const getQueueStats = async (req, res) => {
  try {
    const db = getDB();
    const { doctorId, appointmentDate } = req.query;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "doctorId and appointmentDate are required",
      });
    }

    const query = {
      doctorId: new ObjectId(doctorId),
      "patientInfo.appointmentDate": appointmentDate,
      status: "accepted",
    };

    const waiting = await db
      .collection("appointments")
      .countDocuments({ ...query, consultationStatus: "waiting" });

    const inConsultation = await db
      .collection("appointments")
      .countDocuments({ ...query, consultationStatus: "in_consultation" });

    const completed = await db
      .collection("appointments")
      .countDocuments({ ...query, consultationStatus: "completed" });

    const skipped = await db
      .collection("appointments")
      .countDocuments({ ...query, consultationStatus: "skipped" });

    const total = waiting + inConsultation + completed + skipped;

    res.json({
      success: true,
      stats: {
        waiting,
        inConsultation,
        completed,
        skipped,
        total,
        remaining: waiting + inConsultation,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ACTIVE QUEUES FOR DISPLAY BOARD
export const getQueueBoard = async (req, res) => {
  try {
    const db = getDB();
    const { appointmentDate } = req.query;

    if (!appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "appointmentDate is required",
      });
    }

    const sessions = await db
      .collection("doctor_sessions")
      .aggregate([
        {
          $match: {
            appointmentDate,
            status: "active",
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        {
          $unwind: {
            path: "$doctorInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            doctorName: {
              $concat: ["$doctorInfo.firstName", " ", "$doctorInfo.lastName"],
            },
          },
        },
      ])
      .toArray();

    const boardData = [];

    for (const session of sessions) {
      const stats = await db.collection("appointments").aggregate([
        {
          $match: {
            doctorId: session.doctorId,
            "patientInfo.appointmentDate": appointmentDate,
            status: "accepted",
          },
        },
        {
          $group: {
            _id: null,
            waiting: {
              $sum: {
                $cond: [
                  { $eq: ["$consultationStatus", "waiting"] },
                  1,
                  0,
                ],
              },
            },
            inConsultation: {
              $sum: {
                $cond: [
                  { $eq: ["$consultationStatus", "in_consultation"] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]).toArray();

      boardData.push({
        sessionId: session._id,
        doctorId: session.doctorId,
        doctorName: session.doctorName,
        currentServing: session.currentSerial,
        waitingCount: stats[0]?.waiting || 0,
        inConsultationCount: stats[0]?.inConsultation || 0,
        isBreak: session.isBreak,
        breakReason: session.breakReason,
      });
    }

    res.json({
      success: true,
      board: boardData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// START CONSULTATION
export const startConsultation = async (req, res) => {
  try {
    const db = getDB();
    const appointmentId = req.params.id;
    const doctorId = req.user.id;

    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          consultationStatus: "in_consultation",
          consultationStartedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    getIO()
      ?.to(`room_${doctorId}_${appointment.patientInfo?.appointmentDate}`)
      .emit("consultation-started", {
        appointmentId,
        serialNumber: appointment.serialNumber,
        timestamp: new Date(),
      });

    res.json({
      success: true,
      message: "Consultation started",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// FINISH CONSULTATION
export const finishConsultation = async (req, res) => {
  try {
    const db = getDB();
    const appointmentId = req.params.id;
    const doctorId = req.user.id;

    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          consultationStatus: "completed",
          consultationEndedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    getIO()
      ?.to(`room_${doctorId}_${appointment.patientInfo?.appointmentDate}`)
      .emit("consultation-completed", {
        appointmentId,
        serialNumber: appointment.serialNumber,
        timestamp: new Date(),
      });

    res.json({
      success: true,
      message: "Consultation finished",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const db = getDB();

    const appointmentId = req.params.id;
    const patientId = req.user.id;

    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(appointmentId),
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // appointment owner check
    if (appointment.patientId.toString() !== patientId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // completed appointment cancel করা যাবে না
    if (appointment.consultationStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointment cannot be cancelled",
      });
    }

    await db.collection("appointments").updateOne(
      {
        _id: new ObjectId(appointmentId),
      },
      {
        $set: {
          status: "cancelled",
          consultationStatus: "cancelled",
          cancelledAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const checkDoctorDateAvailability = async (req, res) => {
  try {
    const db = getDB();
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId || !ObjectId.isValid(doctorId)) {
      return res.status(400).json({ success: false, message: "Invalid Doctor ID" });
    }

    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(doctorId) });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const maxPatients = Number(doctor.maxPatientsPerDay || 0);
    let bookedCount = 0;

    if (date) {
      bookedCount = await db.collection("appointments").countDocuments({
        doctorId: new ObjectId(doctorId),
        "patientInfo.appointmentDate": date,
        status: { $ne: "cancelled" },
      });
    }

    const isFull = maxPatients > 0 && bookedCount >= maxPatients;

    let chamberTime = "Chamber Schedule";
    if (doctor.startTime && doctor.endTime) {
      chamberTime = `${doctor.startTime} - ${doctor.endTime}`;
    }

    res.json({
      success: true,
      bookedCount,
      maxPatients,
      isFull,
      remaining: maxPatients > 0 ? Math.max(0, maxPatients - bookedCount) : null,
      chamberTime,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};