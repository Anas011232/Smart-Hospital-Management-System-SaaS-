'use client';
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function DoctorSessions() {
  const [dates, setDates] = useState([]);
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
    });
  }, []);

  const handleStartSession = async (date) => {
    try {
      const res = await api.post("/session/start", { appointmentDate: date });
      if (res.data.success) {
        localStorage.setItem("active_session", JSON.stringify(res.data.session));
        router.push("/doctor-dashboard/live-queue");
      }
    } catch (err) {
      alert("Error starting session");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">OPD Sessions By Date</h1>
      <div className="grid gap-4">
        {dates.map(([date, count]) => (
          <div key={date} className="border p-4 rounded-xl flex justify-between items-center bg-white shadow-sm">
            <div>
              <p className="font-semibold text-lg">{date}</p>
              <p className="text-gray-500 text-sm">{count} Patients Accepted</p>
            </div>
            <button
              onClick={() => handleStartSession(date)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Start OPD Session
            </button>
          </div>
        ))}
        {dates.length === 0 && <p className="text-gray-500">No accepted appointments found to start a session.</p>}
      </div>
    </div>
  );
}