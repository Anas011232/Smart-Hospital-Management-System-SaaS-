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