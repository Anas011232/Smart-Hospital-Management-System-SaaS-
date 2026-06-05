"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token"); // লগইন করার সময় যে টোকেন সেভ করেছিলেন
        const res = await axios.get("http://localhost:5000/api/appointments/my-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data.appointments);
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      <div className="bg-white rounded-xl shadow p-6">
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          appointments.map((app) => (
            <div key={app._id} className="border-b py-4">
              <h2 className="font-bold">{app.doctorName}</h2>
              <p className="text-sm text-gray-500">Date: {app.date} | Status: {app.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}