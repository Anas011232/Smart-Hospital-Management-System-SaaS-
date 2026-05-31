"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data.doctors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      loadDoctors();
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Doctors <span className="text-cyan-400">Dashboard</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Manage all hospital doctors in one place
        </p>
      </div>

      {/* GRID */}
      {doctors.length === 0 ? (
        <div className="text-center text-slate-400 mt-20">
          No doctors found 😢
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {doctors.map((d) => (
            <div
              key={d._id}
              className="
                group
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-6
                shadow-2xl
                hover:scale-[1.02]
                transition-all
                duration-300
              "
            >

              {/* TOP */}
              <div className="flex items-center gap-4 mb-4">

                {/* AVATAR */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                  {d.photo ? (
                    <img
                      src={`http://localhost:5000${d.photo}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm">
                      👨‍⚕️
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {d.fullName}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {d.specialization || "General"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-1 text-sm text-slate-300">
                <p>📧 {d.email}</p>
                <p>🏥 {d.department}</p>
              </div>

              {/* BADGE */}
              <div className="mt-3">
                <span className="inline-block px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full">
                  Doctor ID: {d._id.slice(-6)}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-5">

                <Link
                  href={`/hospital/doctors/edit/${d._id}`}
                  className="
                    flex-1
                    text-center
                    bg-yellow-500/90
                    hover:bg-yellow-400
                    text-black
                    font-semibold
                    py-2
                    rounded-xl
                    transition
                  "
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteDoctor(d._id)}
                  className="
                    flex-1
                    bg-red-600/90
                    hover:bg-red-500
                    text-white
                    font-semibold
                    py-2
                    rounded-xl
                    transition
                  "
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