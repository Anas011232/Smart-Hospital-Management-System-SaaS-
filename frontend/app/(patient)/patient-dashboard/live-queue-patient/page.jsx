'use client';
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { io } from "socket.io-client";

export default function PatientLiveQueue() {
  const [session, setSession] = useState(null);
  const [mySerialNumber, setMySerialNumber] = useState(null);

  useEffect(() => {
    // ১. পেশেন্টের লেটেস্ট অ্যাপয়েন্টমেন্ট ডাটা আনা
    api.get("/appointments/my-appointments").then((res) => {
      const latest = res.data.appointments[0]; 
      if (latest) {
        setMySerialNumber(latest.serialNumber);

        // ২. ওই অ্যাপয়েন্টমেন্টের তারিখ অনুযায়ী একটিভ সেশন খুঁজে বের করা
        const date = latest.patientInfo.appointmentDate;
        
        // আপনার ব্যাকএন্ডে সেশন খোঁজার সময় তারিখটাও পাঠানো উচিত (getActiveSession আপডেট করে নেবেন)
        api.get(`/session/active/${latest.doctorId}?date=${date}`).then((sessionRes) => {
          setSession(sessionRes.data.session);
        });

        // ৩. Socket.io লাইভ লিসেনার - রুম আইডি এখন তারিখসহ
        const socket = io("http://localhost:5000");
        const room = `room_${latest.doctorId}_${date}`;
        socket.emit("join-room", room);

        socket.on("queue-update", (data) => {
          setSession((prev) => ({
            ...prev,
            currentSerial: data.currentSerial,
            isBreak: data.isBreak,
            breakReason: data.breakReason,
          }));
        });

        return () => socket.disconnect();
      }
    });
  }, []);

  const remainingPatients = session && mySerialNumber ? mySerialNumber - session.currentSerial : 0;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Live OPD Queue Tracker</h1>
      
      {session ? (
        <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-xs font-bold text-gray-400 uppercase">Current Live Serial</p>
              <p className="text-4xl font-black text-gray-800 mt-1">#{session.currentSerial}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-400 uppercase">Your Serial Number</p>
              <p className="text-4xl font-black text-indigo-700 mt-1">#{mySerialNumber || "N/A"}</p>
            </div>
          </div>

          {/* কন্ডিশনাল ইউআই আপডেট */}
          {session.isBreak ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center font-medium">
              🚨 Doctor is currently on break: <span className="font-bold">{session.breakReason}</span>
            </div>
          ) : remainingPatients > 0 ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-medium">
              🟢 {remainingPatients} Patients left before you.
            </div>
          ) : remainingPatients === 0 ? (
            <div className="bg-blue-600 text-white p-4 rounded-xl text-center font-bold animate-pulse">
              👉 It's YOUR turn!
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-500 p-4 rounded-xl text-center font-medium">
              Your consultation has been completed.
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center bg-gray-50 p-6 rounded-xl border">
          No active session going on right now.
        </p>
      )}
    </div>
  );
}