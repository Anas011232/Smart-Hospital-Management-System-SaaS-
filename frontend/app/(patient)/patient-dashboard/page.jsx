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
    <div className="p-8">
      <h1>Hospitals</h1>

      {hospitals.map((h) => (
        <div key={h._id} className="border p-3 mb-3">
          <h2>{h.hospitalName}</h2>

          {/* 🔥 IMPORTANT FIX */}
          <Link href={`/doctors/${h._id}`}>
            View Doctors
          </Link>
        </div>
      ))}
    </div>
  );
}