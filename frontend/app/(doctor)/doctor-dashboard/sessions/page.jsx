// 'use client';
// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import { useRouter } from "next/navigation";

// export default function DoctorSessions() {
//   const [dates, setDates] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     // ডক্টরের অ্যাপয়েন্টমেন্ট থেকে ইউনিক ডেট ফিল্টার করে আনা
//     api.get("/appointments/doctor").then((res) => {
//       const appointments = res.data.appointments || [];
//       const grouped = appointments.reduce((acc, current) => {
//         const date = current.patientInfo.appointmentDate;
//         if (current.status === "accepted") {
//           acc[date] = (acc[date] || 0) + 1;
//         }
//         return acc;
//       }, {});
//       setDates(Object.entries(grouped));
//     });
//   }, []);

//   const handleStartSession = async (date) => {
//     try {
//       const res = await api.post("/session/start", { appointmentDate: date });
//       if (res.data.success) {
//         localStorage.setItem("active_session", JSON.stringify(res.data.session));
//         router.push("/doctor-dashboard/live-queue");
//       }
//     } catch (err) {
//       alert("Error starting session");
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">OPD Sessions By Date</h1>
//       <div className="grid gap-4">
//         {dates.map(([date, count]) => (
//           <div key={date} className="border p-4 rounded-xl flex justify-between items-center bg-white shadow-sm">
//             <div>
//               <p className="font-semibold text-lg">{date}</p>
//               <p className="text-gray-500 text-sm">{count} Patients Accepted</p>
//             </div>
//             <button
//               onClick={() => handleStartSession(date)}
//               className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
//             >
//               Start OPD Session
//             </button>
//           </div>
//         ))}
//         {dates.length === 0 && <p className="text-gray-500">No accepted appointments found to start a session.</p>}
//       </div>
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { CalendarDays, Play, Users, CalendarX } from "lucide-react";
import { motion } from "framer-motion";

const easing = [0.4, 0, 0.2, 1];

export default function DoctorSessions() {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingDate, setStartingDate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ডক্টরের অ্যাপয়েন্টমেন্ট থেকে ইউনিক ডেট ফিল্টার করে আনা
    api.get("/appointments/doctor").then((res) => {
      const appointments = res.data.appointments || [];
      const grouped = appointments.reduce((acc, current) => {
        const date = current.patientInfo.appointmentDate;
        if (current.status === "accepted") {
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      }, {});
      setDates(Object.entries(grouped));
      setLoading(false);
    });
  }, []);

  const handleStartSession = async (date) => {
    setStartingDate(date);
    try {
      const res = await api.post("/session/start", { appointmentDate: date });
      if (res.data.success) {
        localStorage.setItem("active_session", JSON.stringify(res.data.session));
        router.push("/doctor-dashboard/live-queue");
      }
    } catch (err) {
      alert("Error starting session");
    } finally {
      setStartingDate(null);
    }
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
        <div className="relative p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-64 bg-slate-800/60 rounded-lg animate-pulse mb-6" />
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
              ))}
            </div>
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
      <div className="relative p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easing }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 text-blue-300 shadow-[0_0_20px_-4px_rgba(59,130,246,0.35)]">
              <CalendarDays size={20} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              OPD Sessions by Date
            </h1>
          </motion.div>

          <div className="grid gap-3 sm:gap-4">
            {dates.map(([date, count], idx) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05, ease: easing }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 rounded-2xl border border-white/[0.08] bg-slate-900/55 backdrop-blur-xl p-5 transition-shadow duration-300 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.25)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 text-violet-300">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">{date}</p>
                    <p className="text-slate-400 text-sm flex items-center gap-1.5">
                      <Users size={13} /> {count} Patients Accepted
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartSession(date)}
                  disabled={startingDate === date}
                  className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-[0_8px_30px_-8px_rgba(59,130,246,0.45)] hover:shadow-[0_8px_40px_-6px_rgba(139,92,246,0.5)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  <Play size={15} />
                  {startingDate === date ? "Starting..." : "Start OPD Session"}
                </motion.button>
              </motion.div>
            ))}

            {dates.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: easing }}
                className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-white/[0.08] rounded-2xl"
              >
                <div className="p-3 rounded-full bg-slate-800/60 mb-3">
                  <CalendarX size={24} className="text-slate-500" />
                </div>
                <p className="text-slate-300 font-medium">No accepted appointments found</p>
                <p className="text-slate-500 text-sm mt-1">Accept pending requests to start an OPD session.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}