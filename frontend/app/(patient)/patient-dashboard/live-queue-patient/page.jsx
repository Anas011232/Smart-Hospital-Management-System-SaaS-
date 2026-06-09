"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { initSocket, joinQueueRoom, leaveQueueRoom } from "@/lib/socket";
import { FiRefreshCw, FiClock, FiUser, FiAlertTriangle, FiCheckCircle, FiSkipForward } from "react-icons/fi";

export default function PatientLiveQueue() {
  const [session, setSession] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let socket;
    let roomId = null;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const appointmentRes = await api.get("/appointments/my-appointments");
        const appointments = appointmentRes.data.appointments || [];

        if (!appointments.length) {
          setError("No appointments found");
          setLoading(false);
          return;
        }

        const currentAppointment = appointments.find(
          (apt) => apt.status === "pending" || apt.status === "accepted"
        );

        if (!currentAppointment) {
          setError("No active appointment");
          setLoading(false);
          return;
        }

        setAppointment(currentAppointment);

        const doctorId = currentAppointment.doctorId;
        const appointmentDate = currentAppointment.patientInfo?.appointmentDate;

        if (!appointmentDate) {
          setError("Appointment date missing");
          setLoading(false);
          return;
        }

        const normalizedDate = new Date(appointmentDate).toISOString().split("T")[0];

        const sessionRes = await api.get(`/session/active/${doctorId}?date=${normalizedDate}`);
        const activeSession = sessionRes.data.session;

        if (!activeSession) {
          setError("Doctor session not active yet");
          setLoading(false);
          return;
        }

        setSession(activeSession);

        socket = initSocket();
        roomId = `room_${doctorId}_${normalizedDate}`;
        joinQueueRoom(roomId);

        socket.on("queue-update", (data) => {
          setSession((prev) =>
            prev
              ? { ...prev, currentSerial: data.currentSerial, isBreak: data.isBreak, breakReason: data.breakReason }
              : prev
          );
        });

        socket.on("patient-skipped", (data) => {
          if (data.appointmentId === currentAppointment._id || data.serialNumber === currentAppointment.serialNumber) {
            setAppointment((prev) => prev ? { ...prev, consultationStatus: "skipped" } : prev);
          }
        });

        socket.on("consultation-started", (data) => {
          if (data.appointmentId === currentAppointment._id || data.serialNumber === currentAppointment.serialNumber) {
            setAppointment((prev) => prev ? { ...prev, consultationStatus: "in_consultation" } : prev);
          }
        });

        socket.on("consultation-completed", (data) => {
          if (data.appointmentId === currentAppointment._id || data.serialNumber === currentAppointment.serialNumber) {
            setAppointment((prev) => prev ? { ...prev, consultationStatus: "completed" } : prev);
          }
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (socket && roomId) {
        leaveQueueRoom(roomId);
        socket.disconnect();
      }
    };
  }, []);

  const getQueueStatus = () => {
    if (!session || !appointment) return "loading";
    if (appointment.consultationStatus === "skipped") return "skipped";
    if (appointment.consultationStatus === "in_consultation") return "in_consultation";
    if (appointment.consultationStatus === "completed") return "completed";
    const mySerial = appointment.serialNumber;
    const current = session.currentSerial;
    if (current < mySerial) return "waiting";
    if (current === mySerial) return "your_turn";
    return "completed";
  };

  const status = getQueueStatus();
  const remainingPatients = session && appointment ? appointment.serialNumber - session.currentSerial : 0;

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-3 w-24 bg-slate-800 rounded animate-pulse mb-2" />
          <div className="h-8 w-56 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-28 bg-slate-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-16 bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const isNoSession = error.includes("session") || error.includes("appointment");
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Live Tracker</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">OPD Queue</h1>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
            <FiClock className="text-slate-500 w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="text-slate-200 font-semibold text-base">{isNoSession ? "No active session" : "Something went wrong"}</p>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
          >
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>
    );
  }

  // Status config
  const statusConfig = {
    in_consultation: {
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-300",
      dot: "bg-blue-400",
      label: "In Consultation",
      desc: "You are currently with the doctor.",
      pulse: true,
    },
    your_turn: {
      bg: "bg-emerald-500/10 border-emerald-500/30",
      text: "text-emerald-300",
      dot: "bg-emerald-400",
      label: "Your Turn Now!",
      desc: "Please proceed to the consultation room.",
      pulse: true,
    },
    waiting: {
      bg: "bg-slate-800/60 border-slate-700/50",
      text: "text-slate-300",
      dot: "bg-amber-400",
      label: `${remainingPatients} patient${remainingPatients !== 1 ? "s" : ""} ahead`,
      desc: "Please stay nearby. We'll notify you when it's your turn.",
      pulse: false,
    },
    completed: {
      bg: "bg-slate-800/60 border-slate-700/50",
      text: "text-slate-400",
      dot: "bg-slate-500",
      label: "Consultation Complete",
      desc: "Your appointment has been completed.",
      pulse: false,
    },
    skipped: {
      bg: "bg-red-500/10 border-red-500/30",
      text: "text-red-300",
      dot: "bg-red-400",
      label: "Skipped",
      desc: "You were skipped. Please check with reception.",
      pulse: false,
    },
  };

  const cfg = statusConfig[status] || statusConfig.waiting;

  // Progress bar calculation
  const totalInQueue = appointment?.serialNumber || 1;
  const progressPct = session
    ? Math.min(100, Math.max(0, (session.currentSerial / totalInQueue) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Live Tracker</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">OPD Queue</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time position tracking for your appointment</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs font-semibold">Live</span>
        </div>
      </div>

      {session && appointment ? (
        <div className="space-y-4">
          {/* Break Banner */}
          {session.isBreak && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <FiAlertTriangle className="text-amber-400 w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-amber-300 font-semibold text-sm">Doctor is on a break</p>
                <p className="text-amber-400/70 text-xs mt-0.5">{session.breakReason || "Will resume shortly"}</p>
              </div>
            </div>
          )}

          {/* Serial Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-5 text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Now Seeing</p>
              <p className="text-5xl font-black text-slate-200 tabular-nums">
                #{session.currentSerial}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/8 backdrop-blur-sm p-5 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/5" />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider mb-3">Your Number</p>
                <p className="text-5xl font-black text-blue-300 tabular-nums">
                  #{appointment.serialNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Queue Progress */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Queue Progress</span>
              <span className="text-xs text-slate-500 tabular-nums">{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-600">
              <span>Serial 1</span>
              <span>Serial {appointment.serialNumber}</span>
            </div>
          </div>

          {/* Status Card */}
          <div className={`rounded-2xl border ${cfg.bg} p-5 flex items-center gap-4`}>
            <div className="flex-shrink-0">
              <span className={`w-3 h-3 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""} block`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-base ${cfg.text}`}>{cfg.label}</p>
              <p className="text-slate-500 text-sm mt-0.5">{cfg.desc}</p>
            </div>
            {status === "your_turn" && (
              <FiCheckCircle className="text-emerald-400 w-6 h-6 flex-shrink-0" />
            )}
            {status === "skipped" && (
              <FiSkipForward className="text-red-400 w-6 h-6 flex-shrink-0" />
            )}
          </div>

          {/* Doctor Info (if available from appointment) */}
          {appointment?.doctorDetails && (
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                <FiUser className="text-slate-400 w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {appointment.doctorDetails.fullName || "Doctor"}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {appointment.doctorDetails.specialization}
                </p>
              </div>
              <div className="ml-auto text-right flex-shrink-0">
                <p className="text-xs text-slate-500">Appointment</p>
                <p className="text-slate-300 text-xs font-semibold">
                  {appointment.patientInfo?.appointmentDate}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-10 text-center">
          <FiClock className="text-slate-600 w-10 h-10 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">No active session</p>
          <p className="text-slate-500 text-sm mt-1">Check back when your appointment time is near.</p>
        </div>
      )}
    </div>
  );
}