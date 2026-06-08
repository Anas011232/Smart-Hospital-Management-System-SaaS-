// 'use client';
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
//     const savedSession = localStorage.getItem("active_session");
//     if (!savedSession) {
//       router.push("/doctor-dashboard/sessions");
//       return;
//     }
//     const parsedSession = JSON.parse(savedSession);
//     setSession(parsedSession);

//     // ঐ দিনের অ্যাপয়েন্টমেন্ট লোড করা
//     api.get("/appointments/doctor").then((res) => {
//       const filtered = res.data.appointments.filter(
//         (app) => app.patientInfo.appointmentDate === parsedSession.appointmentDate && app.status === "accepted"
//       );
//       setAppointments(filtered.sort((a, b) => a.serialNumber - b.serialNumber));
//     });

//     // Socket Setup
//     const socket = io("http://localhost:5000"); // আপনার ব্যাকএন্ড পোর্ট দিন
//     socket.emit("join-room", `room_${parsedSession.doctorId}`);

//     return () => socket.disconnect();
//   }, []);

//   const handleNextPatient = async () => {
//     const res = await api.post("/session/next", { sessionId: session._id });
//     if (res.data.success) {
//       const updated = { ...session, currentSerial: res.data.currentSerial, isBreak: false, breakReason: "" };
//       setSession(updated);
//       localStorage.setItem("active_session", JSON.stringify(updated));
//     }
//   };

//   const handleToggleBreak = async (isBreak) => {
//     const res = await api.patch("/session/break", { sessionId: session._id, isBreak, breakReason });
//     if (res.data.success) {
//       const updated = { ...session, isBreak, breakReason: isBreak ? breakReason : "" };
//       setSession(updated);
//       localStorage.setItem("active_session", JSON.stringify(updated));
//     }
//   };

//   if (!session) return <p className="p-6">Loading active session...</p>;

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//       <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
//         <h1 className="text-xl font-bold mb-4">Live OPD Queue Manager</h1>
//         <div className="bg-indigo-50 p-6 rounded-xl text-center mb-6">
//           <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider">Now Calling Serial</p>
//           <p className="text-5xl font-black text-indigo-900 my-2">#{session.currentSerial}</p>
//           {session.isBreak && <p className="text-red-500 font-medium">⚠️ On Break: {session.breakReason}</p>}
//         </div>

//         <div className="flex gap-3 mb-6">
//           <button onClick={handleNextPatient} className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-green-700">
//             Next Patient
//           </button>
//           {session.isBreak ? (
//             <button onClick={() => handleToggleBreak(false)} className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold">
//               End Break
//             </button>
//           ) : (
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Break Reason (e.g., Lunch)"
//                 value={breakReason}
//                 onChange={(e) => setBreakReason(e.target.value)}
//                 className="border px-3 rounded-xl text-sm"
//               />
//               <button onClick={() => handleToggleBreak(true)} className="bg-amber-500 text-white px-4 py-3 rounded-xl font-semibold">
//                 Take Break
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="bg-gray-50 p-4 rounded-xl border">
//         <h2 className="font-bold mb-3 text-gray-700">Patient Serialization List</h2>
//         <div className="space-y-2 overflow-y-auto max-h-[400px]">
//           {appointments.map((app) => (
//             <div
//               key={app._id}
//               onClick={() => router.push(`/doctor-dashboard/prescribe/${app._id}`)}
//               className={`p-3 border rounded-lg cursor-pointer transition ${
//                 app.serialNumber === session.currentSerial
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : app.serialNumber < session.currentSerial
//                   ? "bg-gray-200 text-gray-500"
//                   : "bg-white hover:bg-gray-100 text-gray-800"
//               }`}
//             >
//               <div className="flex justify-between font-medium">
//                 <span>SL #{app.serialNumber} - {app.patientInfo.fullName}</span>
//                 <span className="text-xs uppercase px-2 py-0.5 rounded bg-black/10">
//                   {app.consultationStatus || "Waiting"}
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

  if (!session) {
    return <p className="p-6">Loading session...</p>;
  }

  const current = session.currentSerial;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT PANEL */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">

        <h1 className="text-xl font-bold mb-4">
          Live OPD Queue Manager
        </h1>

        <div className="bg-indigo-50 p-6 rounded-xl text-center mb-6">
          <p className="text-sm text-indigo-600 font-semibold">
            Now Calling
          </p>

          <p className="text-5xl font-black">
            #{current}
          </p>

          {session.isBreak && (
            <p className="text-red-500 font-medium">
              On Break: {session.breakReason}
            </p>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleNextPatient}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl"
          >
            Next Patient
          </button>

          {!session.isBreak ? (
            <div className="flex gap-2">
              <input
                value={breakReason}
                onChange={(e) =>
                  setBreakReason(e.target.value)
                }
                placeholder="Break reason"
                className="border px-3 rounded-xl"
              />

              <button
                onClick={() => handleToggleBreak(true)}
                className="bg-yellow-500 px-4 rounded-xl text-white"
              >
                Break
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleToggleBreak(false)}
              className="bg-gray-600 px-4 py-2 text-white rounded-xl"
            >
              End Break
            </button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-gray-50 p-4 rounded-xl border">
        <h2 className="font-bold mb-3">
          Patient Queue
        </h2>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {appointments.map((app) => (
            <div
              key={app._id}
              onClick={() =>
                router.push(
                  `/doctor-dashboard/prescribe/${app._id}`
                )
              }
              className={`p-3 border rounded-lg cursor-pointer ${
                app.serialNumber === current
                  ? "bg-indigo-600 text-white"
                  : app.serialNumber < current
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between">
                <span>
                  #{app.serialNumber} {app.patientInfo.fullName}
                </span>

                <span className="text-xs">
                  {app.consultationStatus || "waiting"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}