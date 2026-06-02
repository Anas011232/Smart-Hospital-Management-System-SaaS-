'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function DoctorDashboard() {

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get("/appointments/doctor")
      .then(res => setAppointments(res.data.appointments));
  }, []);

  const pending = appointments.filter(a => a.status === "pending");
  const accepted = appointments.filter(a => a.status === "accepted");
  const done = appointments.filter(a => a.status === "completed");

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Doctor Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 mb-6">

        <div className="bg-blue-100 p-4 rounded">
          Pending: {pending.length}
        </div>

        <div className="bg-green-100 p-4 rounded">
          Accepted: {accepted.length}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          Completed: {done.length}
        </div>

      </div>

      {/* PENDING */}
      <h2 className="font-bold mb-2">Pending</h2>

      {pending.map(app => (
        <div key={app._id} className="border p-3 mb-2">

          <p>{app.patientInfo.fullName}</p>
          <p>{app.patientInfo.symptoms}</p>

          <button
            className="bg-green-600 text-white px-3 py-1 mr-2"
            onClick={async () => {
              await api.patch(`/appointments/accept/${app._id}`);
              location.reload();
            }}
          >
            Accept
          </button>

        </div>
      ))}

      {/* ACCEPTED */}
      <h2 className="font-bold mt-5 mb-2">Accepted</h2>

      {accepted.map(app => (
        <div key={app._id} className="border p-3 mb-2">

          <p>{app.patientInfo.fullName}</p>
          <p>Status: {app.status}</p>

          <button className="bg-blue-600 text-white px-3 py-1">
            Start Consultation
          </button>

        </div>
      ))}

      {/* COMPLETED */}
      <h2 className="font-bold mt-5 mb-2">Completed</h2>

      {done.map(app => (
        <div key={app._id} className="border p-3 mb-2">

          <p>{app.patientInfo.fullName}</p>
          <p>Done</p>

        </div>
      ))}

    </div>
  );
}