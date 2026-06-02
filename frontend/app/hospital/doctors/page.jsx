"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    try {
      const hospitalId = localStorage.getItem("hospitalId");

      console.log("HOSPITAL ID =", hospitalId);

      if (!hospitalId) {
        setDoctors([]);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/doctors/hospital/${hospitalId}`
      );

      console.log("DOCTORS =", res.data);

      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/doctors/${id}`
      );

      setDoctors((prev) =>
        prev.filter((doctor) => doctor._id !== id)
      );
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Hospital Doctors
        </h1>

        <Link
          href="/hospital/doctors/add"
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Add Doctor
        </Link>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No doctors found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-4 mb-4">
                {doctor.photo ? (
                  <img
                    src={`http://localhost:5000${doctor.photo}`}
                    alt={doctor.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                    👨‍⚕️
                  </div>
                )}

                <div>
                  <h2 className="font-bold text-lg">
                    {doctor.fullName}
                  </h2>

                  <p className="text-slate-400">
                    {doctor.specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>Email: {doctor.email}</p>
                <p>Phone: {doctor.phone}</p>
                <p>Department: {doctor.department}</p>
                <p>Fee: ৳{doctor.consultationFee}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <Link
                  href={`/hospital/doctors/edit/${doctor._id}`}
                  className="flex-1 bg-yellow-500 text-center py-2 rounded text-black"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteDoctor(doctor._id)}
                  className="flex-1 bg-red-600 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}