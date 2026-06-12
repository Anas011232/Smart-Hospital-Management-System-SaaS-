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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-64 bg-slate-800/80 rounded-lg animate-pulse mb-6" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-900/60 border border-slate-700/50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400">
            <CalendarDays size={20} />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            OPD Sessions by Date
          </h1>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {dates.map(([date, count]) => (
            <div
              key={date}
              className="group flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 transition-all duration-300 hover:border-slate-600/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-400">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">{date}</p>
                  <p className="text-slate-400 text-sm flex items-center gap-1.5">
                    <Users size={13} /> {count} Patients Accepted
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleStartSession(date)}
                disabled={startingDate === date}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
              >
                <Play size={15} />
                {startingDate === date ? "Starting..." : "Start OPD Session"}
              </button>
            </div>
          ))}

          {dates.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-slate-700/60 rounded-2xl">
              <div className="p-3 rounded-full bg-slate-800/60 mb-3">
                <CalendarX size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">No accepted appointments found</p>
              <p className="text-slate-500 text-sm mt-1">Accept pending requests to start an OPD session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}