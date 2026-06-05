'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function DoctorPage() {
  const { hospitalId } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // ✅ safe base url
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!hospitalId) return;

    setLoading(true);

    api
      .get(`/doctors/hospital/${hospitalId}`)
      .then((res) => {
        setDoctors(res.data?.doctors || []);
      })
      .catch((err) => {
        console.log("LOAD ERROR:", err);
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, [hospitalId]);

  // ✅ FIXED IMAGE HANDLER
  const getImage = (photo) => {
    if (!photo) return "/doctor-placeholder.png";

    // already full URL
    if (photo.startsWith("http")) return photo;

    // fix double slash issue
    const path = photo.startsWith("/") ? photo : `/${photo}`;

    return `${BASE_URL}${path}`;
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-4xl font-bold mb-8">
        👨‍⚕️ Doctors List
      </h1>

      {doctors.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No doctors found 😢
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            onClick={() => setSelectedDoctor(doctor)}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={getImage(doctor.photo)}
              alt={doctor.fullName}
              className="w-full h-60 object-cover"
              onError={(e) => {
                e.target.src = "/doctor-placeholder.png";
              }}
            />

            {/* INFO */}
            <div className="p-5">

              <h2 className="text-xl font-bold">
                {doctor.fullName}
              </h2>

              <p className="text-blue-600 mt-1">
                🩺 {doctor.specialization}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                💰 Fee: {doctor.consultationFee} BDT
              </p>

              <p className="text-sm text-gray-500">
                ⭐ Rating: {doctor.rating || 0}
              </p>

            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white w-[90%] md:w-[600px] rounded-2xl p-6 relative">

            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <img
              src={getImage(selectedDoctor.photo)}
              className="w-full h-60 object-cover rounded-xl mb-4"
              onError={(e) => {
                e.target.src = "/doctor-placeholder.png";
              }}
            />

            <h2 className="text-2xl font-bold">
              {selectedDoctor.fullName}
            </h2>

            <p className="text-blue-600 mt-1">
              🩺 {selectedDoctor.specialization}
            </p>

            <div className="mt-4 space-y-2 text-sm text-gray-600">

              <p>📧 {selectedDoctor.email}</p>
              <p>📞 {selectedDoctor.phone}</p>
              <p>🏥 {selectedDoctor.department}</p>
              <p>🎓 {selectedDoctor.qualification}</p>
              <p>⏳ Experience: {selectedDoctor.experienceYears} years</p>
              <p>💰 Fee: {selectedDoctor.consultationFee} BDT</p>
              <p>📍 {selectedDoctor.address}</p>

              <p className="mt-2">
                🕒 {selectedDoctor.startTime} - {selectedDoctor.endTime}
              </p>

              <p>
                🟢 Active: {selectedDoctor.isActive ? "Yes" : "No"}
              </p>

            </div>

            <Link
              href={`/appointments/book/${selectedDoctor._id}`}
              className="block mt-5 bg-blue-600 text-white text-center py-3 rounded-xl hover:bg-blue-700"
            >
              Book Appointment
            </Link>

          </div>
        </div>
      )}

    </div>
  );
}