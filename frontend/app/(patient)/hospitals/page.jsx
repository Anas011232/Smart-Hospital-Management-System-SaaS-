"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/hospital")
      .then(res => setHospitals(res.data.hospitals))
      .catch(() => setHospitals([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">🏥 Our Partner Hospitals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hospitals.map(h => (
          <div key={h._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{h.hospitalName}</h2>
            <p className="text-gray-600 mb-4">{h.address}, {h.city}</p>
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{h.hospitalType}</span>
              <Link
                href={`/doctors/${h._id}`}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                View Doctors
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}