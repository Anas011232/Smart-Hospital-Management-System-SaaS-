import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const createAppointment = async (req, res) => {
  try {
    const db = getDB();

    const { doctorId, patientInfo } = req.body;

    const count = await db
      .collection("appointments")
      .countDocuments({
        doctorId: new ObjectId(doctorId),
        "patientInfo.appointmentDate":
          patientInfo.appointmentDate,
      });

    const serialNumber = count + 1;

    const appointment = {
      patientId: new ObjectId(req.user.id),

      doctorId: new ObjectId(doctorId),

      patientInfo,

      serialNumber,

      status: "pending",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db
      .collection("appointments")
      .insertOne(appointment);

    res.status(201).json({
      success: true,
      message: "Appointment request sent",
    });
  } catch (err) {
    res.status(500).json({
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
export const acceptAppointment = async (
  req,
  res
) => {
  try {
    const db = getDB();

    await db
      .collection("appointments")
      .updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          $set: {
            status: "accepted",
            updatedAt: new Date(),
          },
        }
      );

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

export const rejectAppointment = async (
  req,
  res
) => {
  try {
    const db = getDB();

    await db
      .collection("appointments")
      .updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
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
export const getAppointmentById = async (req, res) => {
  try {
    const db = getDB();
    const appointment = await db.collection("appointments").findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    res.json(appointment);
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

    return res.json({ success: true, finished: false, remaining });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};