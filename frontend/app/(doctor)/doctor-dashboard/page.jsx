// 'use client';
// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import { Users, Clock3, CheckCircle2, AlertCircle, Check, X } from 'lucide-react';

// export default function DoctorDashboardHome() {
//   const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0, totalToday: 0 });
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ডাটা ফেচ করার ফাংশন
//   const fetchAppointments = async () => {
//     try {
//       const res = await api.get("/appointments/doctor");
//       const data = res.data.appointments || [];
//       setAppointments(data);
      
//       setStats({
//         pending: data.filter(a => a.status === "pending").length,
//         accepted: data.filter(a => a.status === "accepted").length,
//         completed: data.filter(a => a.status === "completed").length,
//         totalToday: data.length
//       });
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching appointments:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // অ্যাপয়েন্টমেন্ট Accept করার লজিক
//   const handleAccept = async (id) => {
//     try {
//       const res = await api.patch(`/appointments/accept/${id}`);
//       if (res.data.success) {
//         alert("Appointment Accepted!");
//         fetchAppointments(); // লিস্ট রিফ্রেশ করার জন্য
//       }
//     } catch (err) {
//       alert("Failed to accept appointment: " + err.message);
//     }
//   };

//   // অ্যাপয়েন্টমেন্ট Reject করার লজিক
//   const handleReject = async (id) => {
//     if (confirm("Are you sure you want to reject this appointment?")) {
//       try {
//         const res = await api.patch(`/appointments/reject/${id}`);
//         if (res.data.success) {
//           alert("Appointment Rejected!");
//           fetchAppointments(); // লিস্ট রিফ্রেশ করার জন্য
//         }
//       } catch (err) {
//         alert("Failed to reject appointment: " + err.message);
//       }
//     }
//   };

//   const cards = [
//     { title: "Pending Requests", value: stats.pending, icon: <AlertCircle className="text-amber-600" />, color: "bg-amber-50" },
//     { title: "Accepted Appointments", value: stats.accepted, icon: <CheckCircle2 className="text-green-600" />, color: "bg-green-50" },
//     { title: "Completed Today", value: stats.completed, icon: <Users className="text-indigo-600" />, color: "bg-indigo-50" },
//     { title: "Total Patients", value: stats.totalToday, icon: <Clock3 className="text-blue-600" />, color: "bg-blue-50" },
//   ];

//   if (loading) return <p className="p-6">Loading Dashboard Data...</p>;

//   return (
//     <div className="space-y-6">
//       {/* ওয়েলকাম সেকশন */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Doctor!</h1>
//         <p className="text-gray-500">Manage your pending requests and upcoming patient queue.</p>
//       </div>

//       {/* স্ট্যাটস কার্ড */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {cards.map((card, idx) => (
//           <div key={idx} className={`${card.color} p-6 rounded-2xl border flex items-center gap-4`}>
//             <div className="p-3 bg-white rounded-xl shadow-sm">{card.icon}</div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">{card.title}</p>
//               <p className="text-2xl font-black text-gray-800">{card.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* ১. পেশেন্ট রিকোয়েস্ট অ্যাকসেপ্ট/রিজেক্ট সেকশন (Left Column) */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
//           <h2 className="font-bold text-lg mb-4 text-amber-600 flex items-center gap-2">
//             <AlertCircle size={20} /> Pending Appointment Requests ({stats.pending})
//           </h2>
          
//           <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
//             {appointments.filter(a => a.status === "pending").length === 0 ? (
//               <p className="text-gray-500 text-sm py-4 text-center border border-dashed rounded-xl">No pending requests at the moment.</p>
//             ) : (
//               appointments.filter(a => a.status === "pending").map((app) => (
//                 <div key={app._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border hover:shadow-sm transition">
//                   <div>
//                     <p className="font-bold text-gray-800">{app.patientInfo?.fullName}</p>
//                     <p className="text-xs text-gray-500">Date: {app.patientInfo?.appointmentDate} | Age: {app.patientInfo?.age}</p>
//                     <p className="text-xs text-indigo-600 font-medium mt-1">Reason: {app.patientInfo?.symptoms || "General Checkup"}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => handleAccept(app._id)}
//                       className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                       title="Accept Appointment"
//                     >
//                       <Check size={18} />
//                     </button>
//                     <button 
//                       onClick={() => handleReject(app._id)}
//                       className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
//                       title="Reject Appointment"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* ২. ইতিমধ্যে অ্যাকসেপ্ট হওয়া পেশেন্টদের তালিকা (Right Column) */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm">
//           <h2 className="font-bold text-lg mb-4 text-green-700 flex items-center gap-2">
//             <CheckCircle2 size={20} /> Approved for Live Queue ({stats.accepted})
//           </h2>
//           <div className="space-y-3 max-h-[400px] overflow-y-auto">
//             {appointments.filter(a => a.status === "accepted").length === 0 ? (
//               <p className="text-gray-500 text-sm py-4 text-center border border-dashed rounded-xl">No accepted patients yet.</p>
//             ) : (
//               appointments.filter(a => a.status === "accepted").map((app) => (
//                 <div key={app._id} className="p-3 bg-green-50/50 border border-green-100 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold text-gray-800 text-sm">SL #{app.serialNumber} - {app.patientInfo?.fullName}</p>
//                     <p className="text-[11px] text-gray-500">Date: {app.patientInfo?.appointmentDate}</p>
//                   </div>
//                   <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
//                     Ready
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Users, Clock3, CheckCircle2, AlertCircle, Check, X, Inbox, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const easing = [0.4, 0, 0.2, 1];

export default function DoctorDashboardHome() {
  const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0, totalToday: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // ডাটা ফেচ করার ফাংশন
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/doctor");
      const data = res.data.appointments || [];
      setAppointments(data);

      setStats({
        pending: data.filter(a => a.status === "pending").length,
        accepted: data.filter(a => a.status === "accepted").length,
        completed: data.filter(a => a.status === "completed").length,
        totalToday: data.length
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // অ্যাপয়েন্টমেন্ট Accept করার লজিক
  const handleAccept = async (id) => {
    setActionId(id);
    try {
      const res = await api.patch(`/appointments/accept/${id}`);
      if (res.data.success) {
        alert("Appointment Accepted!");
        fetchAppointments(); // লিস্ট রিফ্রেশ করার জন্য
      }
    } catch (err) {
      alert("Failed to accept appointment: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  // অ্যাপয়েন্টমেন্ট Reject করার লজিক
  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this appointment?")) {
      setActionId(id);
      try {
        const res = await api.patch(`/appointments/reject/${id}`);
        if (res.data.success) {
          alert("Appointment Rejected!");
          fetchAppointments(); // লিস্ট রিফ্রেশ করার জন্য
        }
      } catch (err) {
        alert("Failed to reject appointment: " + err.message);
      } finally {
        setActionId(null);
      }
    }
  };

  const cards = [
    {
      title: "Pending Requests",
      value: stats.pending,
      icon: <AlertCircle size={20} />,
      accent: "amber",
    },
    {
      title: "Accepted Appointments",
      value: stats.accepted,
      icon: <CheckCircle2 size={20} />,
      accent: "emerald",
    },
    {
      title: "Completed Today",
      value: stats.completed,
      icon: <Users size={20} />,
      accent: "violet",
    },
    {
      title: "Total Patients",
      value: stats.totalToday,
      icon: <Clock3 size={20} />,
      accent: "blue",
    },
  ];

  const accentStyles = {
    amber: {
      iconBg: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
      glow: "hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.25)]",
    },
    emerald: {
      iconBg: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
      glow: "hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.25)]",
    },
    violet: {
      iconBg: "bg-violet-500/15 text-violet-300 border border-violet-500/20",
      glow: "hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.25)]",
    },
    blue: {
      iconBg: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
      glow: "hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.25)]",
    },
  };

  const pageBg = "min-h-screen bg-[radial-gradient(ellipse_at_top,_#0b1020_0%,_#05070f_55%,_#070a14_100%)] relative overflow-hidden";

  const GridOverlay = () => (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  );

  if (loading) {
    return (
      <div className={pageBg}>
        <GridOverlay />
        <div className="relative p-4 sm:p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-7 w-56 bg-slate-800/60 rounded-lg animate-pulse" />
            <div className="h-4 w-80 bg-slate-800/40 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
            <div className="h-80 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={pageBg}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: easing }}
    >
      <GridOverlay />
      <div className="relative p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* ওয়েলকাম সেকশন */}
        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easing }}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 shadow-[0_0_20px_-4px_rgba(59,130,246,0.35)]">
              <Sparkles size={16} className="text-blue-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, Doctor
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage your pending requests and upcoming patient queue.
          </p>
        </motion.div>

        {/* স্ট্যাটস কার্ড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const a = accentStyles[card.accent];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05, ease: easing }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/55 backdrop-blur-xl p-5 transition-shadow duration-300 ${a.glow}`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{card.title}</p>
                    <p className="text-3xl font-bold text-white tabular-nums">{card.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${a.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {card.icon}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* ১. পেশেন্ট রিকোয়েস্ট অ্যাকসেপ্ট/রিজেক্ট সেকশন (Left Column) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: easing }}
            className="lg:col-span-2 relative rounded-2xl border border-white/[0.08] bg-slate-900/55 backdrop-blur-xl p-5 sm:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
            <h2 className="font-semibold text-base sm:text-lg mb-4 text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 text-amber-300">
                <AlertCircle size={16} />
              </span>
              Pending Appointment Requests
              <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                {stats.pending}
              </span>
            </h2>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 -mr-1">
              <AnimatePresence mode="popLayout">
                {appointments.filter(a => a.status === "pending").length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-white/[0.08] rounded-xl"
                  >
                    <div className="p-3 rounded-full bg-slate-800/60 mb-3">
                      <Inbox size={22} className="text-slate-500" />
                    </div>
                    <p className="text-slate-300 text-sm font-medium">No pending requests</p>
                    <p className="text-slate-500 text-xs mt-1">New appointment requests will show up here.</p>
                  </motion.div>
                ) : (
                  appointments.filter(a => a.status === "pending").map((app) => (
                    <motion.div
                      key={app._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25, ease: easing }}
                      whileHover={{ y: -2 }}
                      className="group relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-slate-800/40 rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-200"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transition-opacity duration-500 pointer-events-none" />
                      <div className="min-w-0 relative">
                        <p className="font-semibold text-white truncate">{app.patientInfo?.fullName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Date: {app.patientInfo?.appointmentDate} &middot; Age: {app.patientInfo?.age}
                        </p>
                        <p className="text-xs text-blue-300 font-medium mt-1.5 truncate">
                          Reason: {app.patientInfo?.symptoms || "General Checkup"}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0 self-end sm:self-auto relative">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAccept(app._id)}
                          disabled={actionId === app._id}
                          className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-300 border border-emerald-500/20 rounded-lg hover:shadow-[0_0_24px_-4px_rgba(16,185,129,0.45)] hover:text-white hover:bg-gradient-to-br hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Accept Appointment"
                        >
                          <Check size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(app._id)}
                          disabled={actionId === app._id}
                          className="p-2.5 bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-300 border border-red-500/20 rounded-lg hover:shadow-[0_0_24px_-4px_rgba(239,68,68,0.45)] hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject Appointment"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ২. ইতিমধ্যে অ্যাকসেপ্ট হওয়া পেশেন্টদের তালিকা (Right Column) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: easing }}
            className="relative rounded-2xl border border-white/[0.08] bg-slate-900/55 backdrop-blur-xl p-5 sm:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
            <h2 className="font-semibold text-base sm:text-lg mb-4 text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 text-emerald-300">
                <CheckCircle2 size={16} />
              </span>
              Approved Queue
              <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {stats.accepted}
              </span>
            </h2>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 -mr-1">
              <AnimatePresence mode="popLayout">
                {appointments.filter(a => a.status === "accepted").length === 0 ? (
                  <motion.div
                    key="empty2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-white/[0.08] rounded-xl"
                  >
                    <div className="p-3 rounded-full bg-slate-800/60 mb-3">
                      <Users size={22} className="text-slate-500" />
                    </div>
                    <p className="text-slate-300 text-sm font-medium">No accepted patients yet</p>
                  </motion.div>
                ) : (
                  appointments.filter(a => a.status === "accepted").map((app) => (
                    <motion.div
                      key={app._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: easing }}
                      whileHover={{ y: -2 }}
                      className="p-3 bg-gradient-to-r from-emerald-500/[0.06] to-transparent border border-emerald-500/[0.12] rounded-xl flex justify-between items-center hover:border-emerald-500/25 transition-colors duration-200"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white text-sm truncate">
                          SL #{app.serialNumber} &middot; {app.patientInfo?.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Date: {app.patientInfo?.appointmentDate}</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded-md font-semibold uppercase tracking-wider shrink-0 ml-2">
                        Ready
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}