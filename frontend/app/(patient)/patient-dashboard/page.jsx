'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function PatientDashboard() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    api.get("/hospital").then((res) => {
      setHospitals(res.data.hospitals);
    });
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🏥 Hospitals
      </h1>

      {/* LIST */}
      <div className="space-y-4">

        {hospitals.map((h) => (
          <div
            key={h._id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >

            {/* NAME */}
            <h2 className="text-xl font-semibold text-gray-800">
              {h.hospitalName}
            </h2>

            {/* INFO */}
            <p className="text-sm text-gray-500 mt-1">
              📍 {h.city}, {h.country} • 🏥 {h.hospitalType}
            </p>

            {/* BUTTON */}
            <div className="mt-4">
              <Link
                href={`/doctors/${h._id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Doctors →
              </Link>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}