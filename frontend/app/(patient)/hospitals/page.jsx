'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    api.get("/hospital").then((res) => {
      setHospitals(res.data.hospitals);
    });
  }, []);

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">🏥 All Hospitals</h1>

      <div className="space-y-4">

        {hospitals.map((h) => (
          <div
            key={h._id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >

            <h2 className="text-xl font-bold">{h.hospitalName}</h2>

            <p className="text-gray-500 text-sm">
              📍 {h.address}, {h.city}
            </p>

            <div className="flex gap-4 text-sm mt-2">
              <span>🏥 {h.hospitalType}</span>
              <span>🛏 {h.totalBeds}</span>
              <span>👨‍⚕️ {h.totalDoctors}</span>
            </div>

            <Link
              href={`/patient/doctors/${h._id}`}
              className="text-blue-600 font-medium inline-block mt-3"
            >
              View Doctors →
            </Link>

          </div>
        ))}

      </div>
    </div>
  );
}