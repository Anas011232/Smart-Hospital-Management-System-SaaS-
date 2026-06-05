"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PatientDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      totalAppointments: 5,
      upcoming: 2,
      completed: 3
    });
  }, []);

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">👤 Patient Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <Card title="Total Appointments" value={data?.totalAppointments} />
        <Card title="Upcoming" value={data?.upcoming} />
        <Card title="Completed" value={data?.completed} />

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-blue-600 mt-2">
        {value}
      </h2>
    </div>
  );
}