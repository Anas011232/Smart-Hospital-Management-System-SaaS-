"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold">
        Hospital Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Manage your doctors efficiently 🚀
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/hospital/doctors/add"
          className="bg-green-600 px-5 py-3 rounded"
        >
          + Add Doctor
        </Link>

        <Link
          href="/hospital/doctors"
          className="bg-blue-600 px-5 py-3 rounded"
        >
          View Doctors
        </Link>
      </div>
    </div>
  );
}