"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/appointments/my-appointments");

      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await api.patch(`/appointments/cancel/${id}`);

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id
            ? { ...a, status: "cancelled", consultationStatus: "cancelled" }
            : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "rejected":
        return "bg-gray-200 text-gray-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          My Appointments
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your booked doctor appointments
        </p>
      </div>

      {/* EMPTY */}
      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No appointments found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 border border-gray-100"
            >
              {/* DOCTOR */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUserMd className="text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    {a.doctorDetails?.fullName || "Doctor"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {a.doctorDetails?.specialization}
                  </p>
                </div>
              </div>

              {/* INFO */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FaCalendarAlt />
                  {a.patientInfo?.appointmentDate}
                </p>

                <p className="flex items-center gap-2">
                  <FaClock />
                  Serial: <b>{a.serialNumber}</b>
                </p>

                <p>
                  Fee: <b>{a.doctorDetails?.consultationFee || 0} BDT</b>
                </p>
              </div>

              {/* STATUS + CANCEL */}
              <div className="mt-5 flex items-center justify-between">
                
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadge(
                    a.status
                  )}`}
                >
                  {a.status}
                </span>

                {a.status !== "cancelled" &&
                  a.status !== "completed" && (
                    <button
                      onClick={() => cancelAppointment(a._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  )}
              </div>

              {/* EXTRA */}
              {a.consultationStatus && (
                <div className="mt-3 text-xs text-gray-500">
                  Queue status: {a.consultationStatus}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}