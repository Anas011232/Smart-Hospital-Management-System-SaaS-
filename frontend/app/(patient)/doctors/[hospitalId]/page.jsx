'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function DoctorPage() {
  const { hospitalId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hospitalId) return;

    setLoading(true);

    api
      .get(`/doctors/hospital/${hospitalId}`)
      .then((res) => {
        setDoctors(res.data?.doctors || []);
      })
      .catch((err) => {
        console.log("Doctor fetch error:", err);
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, [hospitalId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-8">
        👨‍⚕️ Doctors List
      </h1>

      {/* EMPTY STATE */}
      {doctors.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No doctors found for this hospital 😢
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {doctors.map((doctor) => {

          // SAFE IMAGE HANDLING
          const imageUrl =
            doctor.photo && doctor.photo !== ""
              ? `${process.env.NEXT_PUBLIC_API_URL}${doctor.photo}`
              : "/doctor-placeholder.png";

          return (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={doctor.fullName}
                  className="w-full h-60 object-cover"
                  onError={(e) => {
                    e.target.src = "/doctor-placeholder.png";
                  }}
                />

                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Doctor
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h2 className="text-xl font-bold text-gray-800">
                  {doctor.fullName}
                </h2>

                <p className="text-blue-600 font-medium mt-1">
                  🩺 {doctor.specialization}
                </p>

                <div className="mt-3 text-sm text-gray-600 space-y-1">

                  <p>
                    👨‍⚕️ Experience: {doctor.experience || "N/A"} years
                  </p>

                  <p>
                    💰 Fee: {doctor.fee || "N/A"} BDT
                  </p>

                  <p>
                    🏥 Available: {doctor.available ? "Yes" : "No"}
                  </p>

                </div>

                {/* BUTTON */}
                <Link
                  href={`/patient/appointments/book/${doctor._id}`}
                  className="block mt-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-xl hover:scale-105 transition"
                >
                  Book Appointment
                </Link>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}