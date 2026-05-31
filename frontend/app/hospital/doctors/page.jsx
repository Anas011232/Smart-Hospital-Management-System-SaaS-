"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);

  const loadDoctors = async () => {
    const res = await axios.get("http://localhost:5000/api/doctors");
    setDoctors(res.data.doctors);
  };

  const deleteDoctor = async (id) => {
    await axios.delete(`http://localhost:5000/api/doctors/${id}`);
    loadDoctors();
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  return (
    <div className="p-10 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-5">Doctors List</h1>

      <div className="grid gap-4">
        {doctors.map((d) => (
          <div key={d._id} className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold">{d.fullName}</h2>
            <p>{d.email}</p>
            <p>{d.specialization}</p>
            <p>{d.department}</p>

            <div className="flex gap-2 mt-3">
              <Link
                href={`/hospital/doctors/edit/${d._id}`}
                className="bg-yellow-500 px-3 py-1 rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteDoctor(d._id)}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}