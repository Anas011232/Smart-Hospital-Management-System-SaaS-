// // 'use client';
// // import { useEffect, useState } from "react";
// // import api from "@/lib/axios";
// // import { io } from "socket.io-client";
// // import { useRouter } from "next/navigation";

// // export default function DoctorLiveQueue() {
// //   const [session, setSession] = useState(null);
// //   const [appointments, setAppointments] = useState([]);
// //   const [breakReason, setBreakReason] = useState("");
// //   const router = useRouter();

// //   useEffect(() => {
// //     const savedSession = localStorage.getItem("active_session");
// //     if (!savedSession) {
// //       router.push("/doctor-dashboard/sessions");
// //       return;
// //     }
// //     const parsedSession = JSON.parse(savedSession);
// //     setSession(parsedSession);

// //     // ঐ দিনের অ্যাপয়েন্টমেন্ট লোড করা
// //     api.get("/appointments/doctor").then((res) => {
// //       const filtered = res.data.appointments.filter(
// //         (app) => app.patientInfo.appointmentDate === parsedSession.appointmentDate && app.status === "accepted"
// //       );
// //       setAppointments(filtered.sort((a, b) => a.serialNumber - b.serialNumber));
// //     });

// //     // Socket Setup
// //     const socket = io("http://localhost:5000"); // আপনার ব্যাকএন্ড পোর্ট দিন
// //     socket.emit("join-room", `room_${parsedSession.doctorId}`);

// //     return () => socket.disconnect();
// //   }, []);

// //   const handleNextPatient = async () => {
// //     const res = await api.post("/session/next", { sessionId: session._id });
// //     if (res.data.success) {
// //       const updated = { ...session, currentSerial: res.data.currentSerial, isBreak: false, breakReason: "" };
// //       setSession(updated);
// //       localStorage.setItem("active_session", JSON.stringify(updated));
// //     }
// //   };

// //   const handleToggleBreak = async (isBreak) => {
// //     const res = await api.patch("/session/break", { sessionId: session._id, isBreak, breakReason });
// //     if (res.data.success) {
// //       const updated = { ...session, isBreak, breakReason: isBreak ? breakReason : "" };
// //       setSession(updated);
// //       localStorage.setItem("active_session", JSON.stringify(updated));
// //     }
// //   };

// //   if (!session) return <p className="p-6">Loading active session...</p>;

// //   return (
// //     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// //       <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
// //         <h1 className="text-xl font-bold mb-4">Live OPD Queue Manager</h1>
// //         <div className="bg-indigo-50 p-6 rounded-xl text-center mb-6">
// //           <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider">Now Calling Serial</p>
// //           <p className="text-5xl font-black text-indigo-900 my-2">#{session.currentSerial}</p>
// //           {session.isBreak && <p className="text-red-500 font-medium">⚠️ On Break: {session.breakReason}</p>}
// //         </div>

// //         <div className="flex gap-3 mb-6">
// //           <button onClick={handleNextPatient} className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-green-700">
// //             Next Patient
// //           </button>
// //           {session.isBreak ? (
// //             <button onClick={() => handleToggleBreak(false)} className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold">
// //               End Break
// //             </button>
// //           ) : (
// //             <div className="flex gap-2">
// //               <input
// //                 type="text"
// //                 placeholder="Break Reason (e.g., Lunch)"
// //                 value={breakReason}
// //                 onChange={(e) => setBreakReason(e.target.value)}
// //                 className="border px-3 rounded-xl text-sm"
// //               />
// //               <button onClick={() => handleToggleBreak(true)} className="bg-amber-500 text-white px-4 py-3 rounded-xl font-semibold">
// //                 Take Break
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <div className="bg-gray-50 p-4 rounded-xl border">
// //         <h2 className="font-bold mb-3 text-gray-700">Patient Serialization List</h2>
// //         <div className="space-y-2 overflow-y-auto max-h-[400px]">
// //           {appointments.map((app) => (
// //             <div
// //               key={app._id}
// //               onClick={() => router.push(`/doctor-dashboard/prescribe/${app._id}`)}
// //               className={`p-3 border rounded-lg cursor-pointer transition ${
// //                 app.serialNumber === session.currentSerial
// //                   ? "bg-indigo-600 text-white border-indigo-600"
// //                   : app.serialNumber < session.currentSerial
// //                   ? "bg-gray-200 text-gray-500"
// //                   : "bg-white hover:bg-gray-100 text-gray-800"
// //               }`}
// //             >
// //               <div className="flex justify-between font-medium">
// //                 <span>SL #{app.serialNumber} - {app.patientInfo.fullName}</span>
// //                 <span className="text-xs uppercase px-2 py-0.5 rounded bg-black/10">
// //                   {app.consultationStatus || "Waiting"}
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import { io } from "socket.io-client";
// import { useRouter } from "next/navigation";

// export default function DoctorLiveQueue() {
//   const [session, setSession] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [breakReason, setBreakReason] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     let socket;

//     const init = async () => {
//       const savedSession = localStorage.getItem("active_session");

//       if (!savedSession) {
//         router.push("/doctor-dashboard/sessions");
//         return;
//       }

//       const parsed = JSON.parse(savedSession);
//       setSession(parsed);

//       const doctorId = parsed.doctorId;
//       const date = parsed.appointmentDate;

//       // 1. load appointments (STRICT FILTER FIXED)
//       const res = await api.get("/appointments/doctor");

//       const filtered = res.data.appointments
//         .filter(
//           (app) =>
//             app.patientInfo.appointmentDate === date &&
//             app.status === "accepted"
//         )
//         .sort((a, b) => a.serialNumber - b.serialNumber);

//       setAppointments(filtered);

//       // 2. SOCKET FIXED ROOM (IMPORTANT)
//       socket = io("http://localhost:5000");

//       const room = `room_${doctorId}_${date}`;
//       socket.emit("join-room", room);

//       // 3. LIVE UPDATE
//       socket.on("queue-update", (data) => {
//         setSession((prev) => {
//           if (!prev) return prev;

//           const updated = {
//             ...prev,
//             currentSerial: data.currentSerial,
//             isBreak: data.isBreak,
//             breakReason: data.breakReason,
//           };

//           localStorage.setItem(
//             "active_session",
//             JSON.stringify(updated)
//           );

//           return updated;
//         });
//       });

//       // 4. SESSION END
//       socket.on("session-ended", () => {
//         localStorage.removeItem("active_session");
//         router.push("/doctor-dashboard/sessions");
//       });
//     };

//     init();

//     return () => {
//       if (socket) socket.disconnect();
//     };
//   }, []);

//   // NEXT PATIENT
//   const handleNextPatient = async () => {
//     const res = await api.post("/session/next", {
//       sessionId: session._id,
//     });

//     if (res.data.success) {
//       const updated = {
//         ...session,
//         currentSerial: res.data.currentSerial,
//         isBreak: false,
//         breakReason: "",
//       };

//       setSession(updated);
//       localStorage.setItem(
//         "active_session",
//         JSON.stringify(updated)
//       );
//     }
//   };

//   // BREAK TOGGLE
//   const handleToggleBreak = async (isBreak) => {
//     const res = await api.patch("/session/break", {
//       sessionId: session._id,
//       isBreak,
//       breakReason,
//     });

//     if (res.data.success) {
//       const updated = {
//         ...session,
//         isBreak,
//         breakReason: isBreak ? breakReason : "",
//       };

//       setSession(updated);
//       localStorage.setItem(
//         "active_session",
//         JSON.stringify(updated)
//       );
//     }
//   };

//   if (!session) {
//     return <p className="p-6">Loading session...</p>;
//   }

//   const current = session.currentSerial;

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

//       {/* LEFT PANEL */}
//       <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">

//         <h1 className="text-xl font-bold mb-4">
//           Live OPD Queue Manager
//         </h1>

//         <div className="bg-indigo-50 p-6 rounded-xl text-center mb-6">
//           <p className="text-sm text-indigo-600 font-semibold">
//             Now Calling
//           </p>

//           <p className="text-5xl font-black">
//             #{current}
//           </p>

//           {session.isBreak && (
//             <p className="text-red-500 font-medium">
//               On Break: {session.breakReason}
//             </p>
//           )}
//         </div>

//         <div className="flex gap-3 mb-6">
//           <button
//             onClick={handleNextPatient}
//             className="flex-1 bg-green-600 text-white py-3 rounded-xl"
//           >
//             Next Patient
//           </button>

//           {!session.isBreak ? (
//             <div className="flex gap-2">
//               <input
//                 value={breakReason}
//                 onChange={(e) =>
//                   setBreakReason(e.target.value)
//                 }
//                 placeholder="Break reason"
//                 className="border px-3 rounded-xl"
//               />

//               <button
//                 onClick={() => handleToggleBreak(true)}
//                 className="bg-yellow-500 px-4 rounded-xl text-white"
//               >
//                 Break
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => handleToggleBreak(false)}
//               className="bg-gray-600 px-4 py-2 text-white rounded-xl"
//             >
//               End Break
//             </button>
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="bg-gray-50 p-4 rounded-xl border">
//         <h2 className="font-bold mb-3">
//           Patient Queue
//         </h2>

//         <div className="space-y-2 max-h-[400px] overflow-y-auto">
//           {appointments.map((app) => (
//             <div
//               key={app._id}
//               onClick={() =>
//                 router.push(
//                   `/doctor-dashboard/prescribe/${app._id}`
//                 )
//               }
//               className={`p-3 border rounded-lg cursor-pointer ${
//                 app.serialNumber === current
//                   ? "bg-indigo-600 text-white"
//                   : app.serialNumber < current
//                   ? "bg-gray-200 text-gray-500"
//                   : "bg-white hover:bg-gray-100"
//               }`}
//             >
//               <div className="flex justify-between">
//                 <span>
//                   #{app.serialNumber} {app.patientInfo.fullName}
//                 </span>

//                 <span className="text-xs">
//                   {app.consultationStatus || "waiting"}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Coffee, Users, PauseCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const easing = [0.4, 0, 0.2, 1];

export default function DoctorLiveQueue() {
  const [session, setSession] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [breakReason, setBreakReason] = useState("");
  const router = useRouter();

  useEffect(() => {
    let socket;

    const init = async () => {
      const savedSession = localStorage.getItem("active_session");

      if (!savedSession) {
        router.push("/doctor-dashboard/sessions");
        return;
      }

      const parsed = JSON.parse(savedSession);
      setSession(parsed);

      const doctorId = parsed.doctorId;
      const date = parsed.appointmentDate;

      // 1. load appointments (STRICT FILTER FIXED)
      const res = await api.get("/appointments/doctor");

      const filtered = res.data.appointments
        .filter(
          (app) =>
            app.patientInfo.appointmentDate === date &&
            app.status === "accepted"
        )
        .sort((a, b) => a.serialNumber - b.serialNumber);

      setAppointments(filtered);

      // 2. SOCKET FIXED ROOM (IMPORTANT)
      socket = io("http://localhost:5000");

      const room = `room_${doctorId}_${date}`;
      socket.emit("join-room", room);

      // 3. LIVE UPDATE
      socket.on("queue-update", (data) => {
        setSession((prev) => {
          if (!prev) return prev;

          const updated = {
            ...prev,
            currentSerial: data.currentSerial,
            isBreak: data.isBreak,
            breakReason: data.breakReason,
          };

          localStorage.setItem(
            "active_session",
            JSON.stringify(updated)
          );

          return updated;
        });
      });

      // 4. SESSION END
      socket.on("session-ended", () => {
        localStorage.removeItem("active_session");
        router.push("/doctor-dashboard/sessions");
      });
    };

    init();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // NEXT PATIENT
  const handleNextPatient = async () => {
    const res = await api.post("/session/next", {
      sessionId: session._id,
    });

    if (res.data.success) {
      const updated = {
        ...session,
        currentSerial: res.data.currentSerial,
        isBreak: false,
        breakReason: "",
      };

      setSession(updated);
      localStorage.setItem(
        "active_session",
        JSON.stringify(updated)
      );
    }
  };

  // BREAK TOGGLE
  const handleToggleBreak = async (isBreak) => {
    const res = await api.patch("/session/break", {
      sessionId: session._id,
      isBreak,
      breakReason,
    });

    if (res.data.success) {
      const updated = {
        ...session,
        isBreak,
        breakReason: isBreak ? breakReason : "",
      };

      setSession(updated);
      localStorage.setItem(
        "active_session",
        JSON.stringify(updated)
      );
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

  if (!session) {
    return (
      <div className={pageBg}>
        <GridOverlay />
        <div className="relative p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="md:col-span-2 h-80 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
            <div className="h-80 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const current = session.currentSerial;

  return (
    <motion.div
      className={pageBg}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: easing }}
    >
      <GridOverlay />
      <div className="relative p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: easing }}
            className="relative md:col-span-2 bg-slate-900/55 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />

            <h1 className="text-lg sm:text-xl font-bold mb-4 text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 text-blue-300">
                <Activity size={18} />
              </span>
              Live OPD Queue Manager
            </h1>

            <motion.div
              key={current}
              initial={{ scale: 0.96, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: easing }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-transparent border border-blue-500/20 p-6 sm:p-8 rounded-2xl text-center mb-6 shadow-[0_0_60px_-15px_rgba(59,130,246,0.3)]"
            >
              <p className="text-xs sm:text-sm text-blue-300 font-semibold uppercase tracking-wider mb-1">
                Now Calling
              </p>

              <p className="text-5xl sm:text-6xl font-black text-white tracking-tight tabular-nums">
                #{current}
              </p>

              <AnimatePresence>
                {session.isBreak && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="mt-3 inline-flex items-center gap-1.5 text-amber-300 font-medium text-sm bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full"
                  >
                    <PauseCircle size={14} />
                    On Break: {session.breakReason}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextPatient}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-300 border border-emerald-500/20 font-semibold py-3 rounded-xl hover:shadow-[0_0_30px_-6px_rgba(16,185,129,0.45)] hover:bg-gradient-to-r hover:from-emerald-500 hover:to-emerald-600 hover:text-white transition-all duration-200"
              >
                Next Patient <ArrowRight size={16} />
              </motion.button>

              {!session.isBreak ? (
                <div className="flex gap-2 flex-1">
                  <input
                    value={breakReason}
                    onChange={(e) =>
                      setBreakReason(e.target.value)
                    }
                    placeholder="Break reason"
                    className="flex-1 border border-white/[0.08] bg-slate-800/40 text-white placeholder:text-slate-500 px-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-amber-400/60 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleBreak(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/20 px-4 rounded-xl font-semibold hover:shadow-[0_0_24px_-4px_rgba(245,158,11,0.45)] hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white transition-all duration-200 shrink-0"
                  >
                    <Coffee size={15} /> Break
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleBreak(false)}
                  className="flex-1 bg-slate-700/40 border border-white/[0.08] px-4 py-3 text-white font-semibold rounded-xl hover:bg-slate-700/70 hover:border-white/[0.15] transition-all duration-200"
                >
                  End Break
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: easing }}
            className="relative bg-slate-900/55 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
            <h2 className="font-semibold text-base sm:text-lg text-white mb-4 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 text-violet-300">
                <Users size={16} />
              </span>
              Patient Queue
            </h2>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 -mr-1">
              {appointments.map((app, idx) => {
                const isCurrent = app.serialNumber === current;
                const isDone = app.serialNumber < current;
                return (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.02, ease: easing }}
                    whileHover={{ y: -2 }}
                    onClick={() =>
                      router.push(
                        `/doctor-dashboard/prescribe/${app._id}`
                      )
                    }
                    className={`group relative overflow-hidden p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
                      isCurrent
                        ? "bg-gradient-to-r from-blue-500 to-violet-600 border-transparent text-white shadow-[0_0_30px_-6px_rgba(139,92,246,0.5)]"
                        : isDone
                        ? "bg-slate-800/30 border-white/[0.04] text-slate-500"
                        : "bg-slate-800/40 border-white/[0.06] text-slate-200 hover:border-white/[0.15]"
                    }`}
                  >
                    {!isCurrent && !isDone && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-opacity duration-500 pointer-events-none" />
                    )}
                    <div className="flex justify-between items-center relative">
                      <span className="text-sm font-medium truncate">
                        #{app.serialNumber} {app.patientInfo.fullName}
                      </span>

                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        isCurrent
                          ? "bg-white/20 text-white"
                          : isDone
                          ? "bg-slate-700/40 text-slate-500"
                          : "bg-slate-700/40 text-slate-400"
                      }`}>
                        {app.consultationStatus || "waiting"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}