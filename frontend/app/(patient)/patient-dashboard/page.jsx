'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function PatientDashboard() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    api.get("/hospital").then((res) => {
      setHospitals(res.data.hospitals || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🏥 Available Hospitals
        </h1>
        <p className="text-gray-500 mt-1">
          Find doctors and hospital details easily
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {hospitals.map((h) => (
          <div
            key={h._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-gray-100"
          >
            
            {/* Top Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {h.hospitalName}
                </h2>

                <p className="text-sm text-gray-500">
                  {h.city}, {h.country}
                </p>
              </div>

              {/* Status badge */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  h.subscriptionStatus === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {h.subscriptionStatus}
              </span>
            </div>

            {/* Info */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>🏷️ Type: {h.hospitalType}</p>
              <p>👨‍⚕️ Doctors: {h.totalDoctors}</p>
              <p>🛏️ Beds: {h.totalBeds}</p>
              <p>📅 Established: {h.establishedYear}</p>
            </div>

            {/* Address */}
            <p className="mt-3 text-sm text-gray-500">
              📍 {h.address}
            </p>

            {/* Action */}
            <div className="mt-5">
              <Link
                href={`/doctors/${h._id}`}
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
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