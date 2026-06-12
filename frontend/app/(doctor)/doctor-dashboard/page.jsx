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
      iconBg: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
      ring: "group-hover:shadow-amber-500/10",
    },
    emerald: {
      iconBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
      ring: "group-hover:shadow-emerald-500/10",
    },
    violet: {
      iconBg: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
      ring: "group-hover:shadow-violet-500/10",
    },
    blue: {
      iconBg: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
      ring: "group-hover:shadow-blue-500/10",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-800/80 rounded-lg animate-pulse" />
          <div className="h-4 w-80 bg-slate-800/50 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900/60 border border-slate-700/50 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-900/60 border border-slate-700/50 animate-pulse" />
          <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-700/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* ওয়েলকাম সেকশন */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20">
            <Sparkles size={16} className="text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, Doctor
          </h1>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">
          Manage your pending requests and upcoming patient queue.
        </p>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const a = accentStyles[card.accent];
          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-600/70 hover:shadow-xl ${a.ring}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{card.title}</p>
                  <p className="text-3xl font-bold text-white tabular-nums">{card.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${a.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  {card.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ১. পেশেন্ট রিকোয়েস্ট অ্যাকসেপ্ট/রিজেক্ট সেকশন (Left Column) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg mb-4 text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400">
              <AlertCircle size={16} />
            </span>
            Pending Appointment Requests
            <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
              {stats.pending}
            </span>
          </h2>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 -mr-1">
            {appointments.filter(a => a.status === "pending").length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-slate-700/60 rounded-xl">
                <div className="p-3 rounded-full bg-slate-800/60 mb-3">
                  <Inbox size={22} className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">No pending requests</p>
                <p className="text-slate-500 text-xs mt-1">New appointment requests will show up here.</p>
              </div>
            ) : (
              appointments.filter(a => a.status === "pending").map((app) => (
                <div
                  key={app._id}
                  className="group flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{app.patientInfo?.fullName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Date: {app.patientInfo?.appointmentDate} &middot; Age: {app.patientInfo?.age}
                    </p>
                    <p className="text-xs text-blue-400 font-medium mt-1.5 truncate">
                      Reason: {app.patientInfo?.symptoms || "General Checkup"}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleAccept(app._id)}
                      disabled={actionId === app._id}
                      className="p-2.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                      title="Accept Appointment"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(app._id)}
                      disabled={actionId === app._id}
                      className="p-2.5 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                      title="Reject Appointment"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ২. ইতিমধ্যে অ্যাকসেপ্ট হওয়া পেশেন্টদের তালিকা (Right Column) */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg mb-4 text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={16} />
            </span>
            Approved Queue
            <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              {stats.accepted}
            </span>
          </h2>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 -mr-1">
            {appointments.filter(a => a.status === "accepted").length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-slate-700/60 rounded-xl">
                <div className="p-3 rounded-full bg-slate-800/60 mb-3">
                  <Users size={22} className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">No accepted patients yet</p>
              </div>
            ) : (
              appointments.filter(a => a.status === "accepted").map((app) => (
                <div
                  key={app._id}
                  className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex justify-between items-center hover:bg-emerald-500/10 transition-colors duration-200"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      SL #{app.serialNumber} &middot; {app.patientInfo?.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Date: {app.patientInfo?.appointmentDate}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md font-semibold uppercase tracking-wider shrink-0 ml-2">
                    Ready
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}