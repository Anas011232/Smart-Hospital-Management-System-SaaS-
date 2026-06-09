"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaHospital,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hospital")
      .then((res) => {
        setHospitals(res.data?.hospitals || []);
      })
      .catch(() => {
        setHospitals([]);
      });
  }, []);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) =>
      hospital.hospitalName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [hospitals, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Header */}

      <div className="mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Select Your Hospital
        </h1>

        <p className="text-gray-500 mt-4 text-lg max-w-xl">
          Choose from our network of healthcare providers and
          book your consultation with expert doctors.
        </p>
      </div>

      {/* Search Bar */}

      <div className="mb-10">
        <div className="relative max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search hospital by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Result Count */}

      <div className="mb-8 text-sm text-gray-500">
        Found {filteredHospitals.length} hospital(s)
      </div>

      {/* Hospitals Grid */}

      {filteredHospitals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border">
          <h3 className="text-xl font-semibold text-gray-700">
            No hospitals found
          </h3>

          <p className="text-gray-500 mt-2">
            Try searching with a different hospital name.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHospitals.map((h) => (
            <div
              key={h._id}
              className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
                  <FaHospital size={24} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {h.hospitalName}
                </h2>

                <p className="text-gray-500 mb-6 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  {h.address}, {h.city}
                </p>

                <div className="flex items-center justify-between mt-8 border-t border-gray-50 pt-6">
                  <span className="text-sm font-semibold bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    {h.hospitalType}
                  </span>

                  <Link
                    href={`/doctors/${h._id}`}
                    className="flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 transition-all group-hover:gap-4"
                  >
                    Explore
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}