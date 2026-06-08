// 'use client';
// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import { io } from "socket.io-client";

// export default function PatientLiveQueue() {
//   const [session, setSession] = useState(null);
//   const [mySerialNumber, setMySerialNumber] = useState(null);

//   useEffect(() => {
//     // ১. পেশেন্টের লেটেস্ট অ্যাপয়েন্টমেন্ট ডাটা আনা
//     api.get("/appointments/my-appointments").then((res) => {
//       const latest = res.data.appointments[0]; 
//       if (latest) {
//         setMySerialNumber(latest.serialNumber);

//         // ২. ওই অ্যাপয়েন্টমেন্টের তারিখ অনুযায়ী একটিভ সেশন খুঁজে বের করা
//         const date = latest.patientInfo.appointmentDate;
        
//         // আপনার ব্যাকএন্ডে সেশন খোঁজার সময় তারিখটাও পাঠানো উচিত (getActiveSession আপডেট করে নেবেন)
//         api.get(`/session/active/${latest.doctorId}?date=${date}`).then((sessionRes) => {
//           setSession(sessionRes.data.session);
//         });

//         // ৩. Socket.io লাইভ লিসেনার - রুম আইডি এখন তারিখসহ
//         const socket = io("http://localhost:5000");
//         const room = `room_${latest.doctorId}_${date}`;
//         socket.emit("join-room", room);

//         socket.on("queue-update", (data) => {
//           setSession((prev) => ({
//             ...prev,
//             currentSerial: data.currentSerial,
//             isBreak: data.isBreak,
//             breakReason: data.breakReason,
//           }));
//         });

//         return () => socket.disconnect();
//       }
//     });
//   }, []);

//   const remainingPatients = session && mySerialNumber ? mySerialNumber - session.currentSerial : 0;

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Live OPD Queue Tracker</h1>
      
//       {session ? (
//         <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
//           <div className="grid grid-cols-2 gap-4 text-center">
//             <div className="bg-gray-50 p-4 rounded-xl border">
//               <p className="text-xs font-bold text-gray-400 uppercase">Current Live Serial</p>
//               <p className="text-4xl font-black text-gray-800 mt-1">#{session.currentSerial}</p>
//             </div>
//             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
//               <p className="text-xs font-bold text-indigo-400 uppercase">Your Serial Number</p>
//               <p className="text-4xl font-black text-indigo-700 mt-1">#{mySerialNumber || "N/A"}</p>
//             </div>
//           </div>

//           {/* কন্ডিশনাল ইউআই আপডেট */}
//           {session.isBreak ? (
//             <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center font-medium">
//               🚨 Doctor is currently on break: <span className="font-bold">{session.breakReason}</span>
//             </div>
//           ) : remainingPatients > 0 ? (
//             <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-medium">
//               🟢 {remainingPatients} Patients left before you.
//             </div>
//           ) : remainingPatients === 0 ? (
//             <div className="bg-blue-600 text-white p-4 rounded-xl text-center font-bold animate-pulse">
//               👉 It's YOUR turn!
//             </div>
//           ) : (
//             <div className="bg-gray-100 text-gray-500 p-4 rounded-xl text-center font-medium">
//               Your consultation has been completed.
//             </div>
//           )}
//         </div>
//       ) : (
//         <p className="text-gray-500 text-center bg-gray-50 p-6 rounded-xl border">
//           No active session going on right now.
//         </p>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { initSocket, joinQueueRoom, leaveQueueRoom } from "@/lib/socket";

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

        // 1. GET APPOINTMENTS
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
        const appointmentDate =
          currentAppointment.patientInfo?.appointmentDate;

        if (!appointmentDate) {
          setError("Appointment date missing");
          setLoading(false);
          return;
        }

        const normalizedDate = new Date(appointmentDate)
          .toISOString()
          .split("T")[0];

        // 2. ACTIVE SESSION
        const sessionRes = await api.get(
          `/session/active/${doctorId}?date=${normalizedDate}`
        );

        const activeSession = sessionRes.data.session;

        if (!activeSession) {
          setError("Doctor session not active yet");
          setLoading(false);
          return;
        }

        setSession(activeSession);

        // 3. SOCKET
        socket = initSocket();
        roomId = `room_${doctorId}_${normalizedDate}`;

        joinQueueRoom(roomId);

        socket.on("queue-update", (data) => {
          setSession((prev) =>
            prev
              ? {
                  ...prev,
                  currentSerial: data.currentSerial,
                  isBreak: data.isBreak,
                  breakReason: data.breakReason,
                }
              : prev
          );
        });

        socket.on("patient-skipped", (data) => {
          if (
            data.appointmentId === currentAppointment._id ||
            data.serialNumber === currentAppointment.serialNumber
          ) {
            setAppointment((prev) =>
              prev ? { ...prev, consultationStatus: "skipped" } : prev
            );
          }
        });

        socket.on("consultation-started", (data) => {
          if (
            data.appointmentId === currentAppointment._id ||
            data.serialNumber === currentAppointment.serialNumber
          ) {
            setAppointment((prev) =>
              prev ? { ...prev, consultationStatus: "in_consultation" } : prev
            );
          }
        });

        socket.on("consultation-completed", (data) => {
          if (
            data.appointmentId === currentAppointment._id ||
            data.serialNumber === currentAppointment.serialNumber
          ) {
            setAppointment((prev) =>
              prev ? { ...prev, consultationStatus: "completed" } : prev
            );
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

  // STATUS LOGIC
  const getQueueStatus = () => {
    if (!session || !appointment) return "loading";

    if (appointment.consultationStatus === "skipped") return "skipped";
    if (appointment.consultationStatus === "in_consultation")
      return "in_consultation";
    if (appointment.consultationStatus === "completed") return "completed";

    const mySerial = appointment.serialNumber;
    const current = session.currentSerial;

    if (current < mySerial) return "waiting";
    if (current === mySerial) return "your_turn";

    return "completed";
  };

  const status = getQueueStatus();

  const remainingPatients =
    session && appointment
      ? appointment.serialNumber - session.currentSerial
      : 0;

  // LOADING
  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto text-gray-500">
        Loading queue information...
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto text-red-600">
        {error}
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Live OPD Queue Tracker
      </h1>

      {session && appointment ? (
        <div className="bg-white border rounded-xl p-6 space-y-6">
          {/* SERIALS */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-sm">Current</p>
              <p className="text-3xl font-bold">
                #{session.currentSerial}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">You</p>
              <p className="text-3xl font-bold text-indigo-600">
                #{appointment.serialNumber}
              </p>
            </div>
          </div>

          {/* STATUS */}
          {session.isBreak ? (
            <div className="bg-yellow-100 p-4 rounded-xl text-center">
              Doctor break: {session.breakReason}
            </div>
          ) : status === "skipped" ? (
            <div className="bg-red-100 p-4 rounded-xl text-center">
              You were skipped
            </div>
          ) : status === "in_consultation" ? (
            <div className="bg-blue-600 text-white p-4 rounded-xl text-center animate-pulse">
              In consultation
            </div>
          ) : status === "your_turn" ? (
            <div className="bg-green-600 text-white p-4 rounded-xl text-center animate-pulse">
              Your turn!
            </div>
          ) : remainingPatients > 0 ? (
            <div className="bg-gray-100 p-4 rounded-xl text-center">
              {remainingPatients} patient(s) before you
            </div>
          ) : (
            <div className="text-gray-500 text-center">
              Waiting...
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-500">
          No active session
        </div>
      )}
    </div>
  );
}