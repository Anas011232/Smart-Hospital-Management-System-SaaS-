"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import useSocket from "@/hooks/useSocket";

export default function PatientQueueStatus({
  appointmentId,
  patientId,
  doctorId,
  appointmentDate,
}) {
  const [appointment, setAppointment] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // NORMALIZE DATE for room ID
  const normalizedDate = appointmentDate
    ? new Date(appointmentDate).toISOString().split("T")[0]
    : null;

  // Use DATE-BASED ROOM (room_${doctorId}_${date})
  const roomId = normalizedDate ? `room_${doctorId}_${normalizedDate}` : null;
  const { on, off, isConnected } = useSocket(roomId);

  // --------------------------
  // FETCH APPOINTMENT
  // --------------------------
  const fetchAppointmentStatus = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/appointments/${appointmentId}`);

      const data = res.data?.appointment || res.data;

      setAppointment(data);
    } catch (err) {
      console.error("Error fetching appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentStatus();
    }
  }, [appointmentId]);

  // --------------------------
  // SOCKET LISTENERS
  // --------------------------
  useEffect(() => {
    const handleQueueUpdate = (data) => {
      if (!data) return;

      if (data.appointment?._id === appointmentId) {
        setAppointment(data.appointment);
      }

      if (data.stats) {
        setStats(data.stats);
      }
    };

    const handlePatientSkipped = (data) => {
      if (data?.appointmentId === appointmentId) {
        setAppointment((prev) =>
          prev
            ? { ...prev, consultationStatus: "skipped" }
            : prev
        );
      }
    };

    const handleConsultationStarted = (data) => {
      if (data?.appointment?._id === appointmentId) {
        setAppointment((prev) =>
          prev
            ? { ...prev, consultationStatus: "in_consultation" }
            : prev
        );
      }
    };

    const handleConsultationCompleted = (data) => {
      if (data?.appointment?._id === appointmentId) {
        setAppointment((prev) =>
          prev
            ? { ...prev, consultationStatus: "completed" }
            : prev
        );
      }
    };

    on("queue-update", handleQueueUpdate);
    on("patient-skipped", handlePatientSkipped);
    on("consultation-started", handleConsultationStarted);
    on("consultation-completed", handleConsultationCompleted);

    return () => {
      off("queue-update", handleQueueUpdate);
      off("patient-skipped", handlePatientSkipped);
      off("consultation-started", handleConsultationStarted);
      off("consultation-completed", handleConsultationCompleted);
    };
  }, [appointmentId, on, off]);

  // --------------------------
  // LOADING
  // --------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <p>Appointment not found</p>
      </div>
    );
  }

  // --------------------------
  // STATUS HELPERS
  // --------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "bg-amber-100 text-amber-700";
      case "in_consultation":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "skipped":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "waiting":
        return "⏳";
      case "in_consultation":
        return "🏥";
      case "completed":
        return "✅";
      case "skipped":
        return "⏭️";
      default:
        return "❓";
    }
  };

  // --------------------------
  // RECALL ACTION
  // --------------------------
  const handleRecall = async () => {
    try {
      await api.patch(`/appointments/${appointmentId}/recall`);
      fetchAppointmentStatus();
    } catch (err) {
      console.error("Recall failed:", err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      
      {/* STATUS CARD */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Your Serial</p>

            <p className="text-4xl font-bold text-blue-600 mb-4">
              {appointment.serialNumber ?? "-"}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Doctor:</span>{" "}
              {appointment.doctorName || "Doctor"}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Date:</span>{" "}
              {appointmentDate}
            </p>
          </div>

          <div className="text-right">
            <div className="text-5xl mb-2">
              {getStatusIcon(appointment.consultationStatus)}
            </div>

            <span
              className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(
                appointment.consultationStatus
              )}`}
            >
              {appointment.consultationStatus || "waiting"}
            </span>
          </div>
        </div>
      </div>

      {/* STATUS MESSAGES */}
      {appointment.consultationStatus === "waiting" && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
          <p className="font-semibold text-amber-700">
            Please wait for your turn
          </p>
        </div>
      )}

      {appointment.consultationStatus === "in_consultation" && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg animate-pulse">
          <p className="font-semibold text-blue-700">
            You are being consulted
          </p>
        </div>
      )}

      {appointment.consultationStatus === "completed" && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <p className="font-semibold text-green-700">
            Consultation completed
          </p>
        </div>
      )}

      {appointment.consultationStatus === "skipped" && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <p className="font-semibold text-red-700 mb-3">
            You were skipped
          </p>

          <button
            onClick={handleRecall}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Request Recall
          </button>
        </div>
      )}

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-600">Waiting</p>
            <p className="text-2xl font-bold text-amber-600">
              {stats.waiting}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
        </div>
      )}

      {/* SOCKET STATUS */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <p>{isConnected ? "Live connected" : "Connecting..."}</p>
      </div>
    </div>
  );
}