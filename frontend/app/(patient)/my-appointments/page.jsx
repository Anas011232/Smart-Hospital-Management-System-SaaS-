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
        return {
          bg: "bg-emerald-500/15",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          icon: "text-emerald-400",
        };
      case "pending":
        return {
          bg: "bg-violet-500/15",
          border: "border-violet-500/20",
          text: "text-violet-400",
          icon: "text-violet-400",
        };
      case "cancelled":
        return {
          bg: "bg-red-500/15",
          border: "border-red-500/20",
          text: "text-red-400",
          icon: "text-red-400",
        };
      case "rejected":
        return {
          bg: "bg-slate-500/15",
          border: "border-slate-500/20",
          text: "text-slate-400",
          icon: "text-slate-400",
        };
      case "completed":
        return {
          bg: "bg-blue-500/15",
          border: "border-blue-500/20",
          text: "text-blue-400",
          icon: "text-blue-400",
        };
      default:
        return {
          bg: "bg-slate-500/15",
          border: "border-slate-500/20",
          text: "text-slate-400",
          icon: "text-slate-400",
        };
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4">
          <FaSpinner className="animate-spin text-blue-400 w-5 h-5" />
          <span className="text-slate-300 font-semibold">Loading appointments...</span>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-70 h-70 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Appointments</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">My Appointments</h1>
              <p className="text-slate-400 mt-1 text-sm">Manage your booked doctor appointments</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold">
                {appointments.length} Total
              </span>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-slate-400 w-8 h-8" />
            </div>
            <p className="text-slate-300 font-semibold mb-2">No appointments found</p>
            <p className="text-slate-500 text-sm">You haven't booked any appointments yet</p>
          </div>
        ) : (
          /* APPOINTMENTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((a) => {
              const badge = getBadge(a.status);
              return (
                <div
                  key={a._id}
                  className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 group hover:border-opacity-40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.bg} opacity-40`} />
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* DOCTOR */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500/15 rounded-xl flex items-center justify-center">
                        <FaUserMd className="text-blue-400 w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <h2 className="font-bold text-white text-sm">
                          {a.doctorDetails?.fullName || "Doctor"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {a.doctorDetails?.specialization}
                        </p>
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 bg-slate-500/15 rounded-lg flex items-center justify-center">
                          <FaCalendarAlt className="text-slate-400 w-3 h-3" />
                        </div>
                        <span className="text-slate-400">Date:</span>
                        <span className="text-slate-200 font-semibold">{a.patientInfo?.appointmentDate}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 bg-slate-500/15 rounded-lg flex items-center justify-center">
                          <FaClock className="text-slate-400 w-3 h-3" />
                        </div>
                        <span className="text-slate-400">Serial:</span>
                        <span className="text-slate-200 font-semibold">{a.serialNumber}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 bg-slate-500/15 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H9V7h6v1z"/>
                          </svg>
                        </div>
                        <span className="text-slate-400">Fee:</span>
                        <span className="text-slate-200 font-semibold">{a.doctorDetails?.consultationFee || 0} BDT</span>
                      </div>
                    </div>

                    {/* STATUS + CANCEL */}
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <span
                        className={`px-3 py-1.5 rounded-xl border ${badge.border} ${badge.bg} ${badge.text} text-xs font-semibold`}
                      >
                        {a.status}
                      </span>

                      {a.status !== "cancelled" &&
                        a.status !== "completed" && (
                          <button
                            onClick={() => cancelAppointment(a._id)}
                            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all duration-200 text-xs font-semibold"
                          >
                            <FaTimes className="w-3 h-3" />
                            Cancel
                          </button>
                        )}
                    </div>

                    {/* EXTRA */}
                    {a.consultationStatus && (
                      <div className="mt-2 text-xs text-slate-500">
                        Queue status: <span className="text-slate-400">{a.consultationStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        
      </div>
    </div>
  );
}