"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaMapMarkerAlt, FaHospital, FaArrowRight, FaSearch,
} from "react-icons/fa";
import { FiGrid, FiList, FiX } from "react-icons/fi";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hospital")
      .then((res) => {
        setHospitals(res.data?.hospitals || []);
      })
      .catch(() => {
        setHospitals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const hospitalTypes = useMemo(() => {
    const types = [...new Set(hospitals.map((h) => h.hospitalType).filter(Boolean))];
    return types;
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch = h.hospitalName?.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "all" || h.hospitalType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [hospitals, search, selectedType]);

  // Skeleton loader
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="h-4 w-32 bg-slate-800 rounded animate-pulse mb-3" />
        <div className="h-10 w-72 bg-slate-800 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-slate-800/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-transparent to-violet-950/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">Healthcare Network</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Find Your Hospital
          </h1>
          <p className="text-slate-400 mt-3 text-base max-w-lg leading-relaxed">
            Explore our network of trusted healthcare providers and book a consultation with a specialist near you.
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by hospital name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/70 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type Filter Pills */}
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
                ${selectedType === "all"
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                }`}
            >
              All Types
            </button>
            {hospitalTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type === selectedType ? "all" : type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
                  ${selectedType === type
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-500 text-xs">
              {filteredHospitals.length} result{filteredHospitals.length !== 1 ? "s" : ""}
            </span>
            <div className="flex bg-slate-800/60 border border-slate-700/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredHospitals.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-14 flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
              <FaHospital className="text-slate-600 w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg">No hospitals found</h3>
              <p className="text-slate-500 text-sm mt-2">Try a different name or clear the filters.</p>
            </div>
            <button
              onClick={() => { setSearch(""); setSelectedType("all"); }}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHospitals.map((h) => (
              <div
                key={h._id}
                className="group relative rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300"
              >
                {/* Card glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0 group-hover:from-blue-600/5 group-hover:to-violet-600/5 transition-all duration-500 pointer-events-none" />

                {/* Hospital Image / Placeholder */}
                {h.hospitalImage ? (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={h.hospitalImage}
                      alt={h.hospitalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border-b border-slate-800">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
                      <FaHospital className="text-blue-400 w-6 h-6" />
                    </div>
                  </div>
                )}

                <div className="p-5 relative z-10">
                  {/* Name + Type */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="font-bold text-white text-base leading-tight">{h.hospitalName}</h2>
                    {h.hospitalType && (
                      <span className="flex-shrink-0 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
                        {h.hospitalType}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                    <FaMapMarkerAlt className="text-slate-500 w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{[h.address, h.city].filter(Boolean).join(", ")}</span>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    {h.totalDoctors && (
                      <span className="flex items-center gap-1">
                        <span className="text-slate-400 font-semibold">{h.totalDoctors}</span> Doctors
                      </span>
                    )}
                    {h.totalBeds && (
                      <>
                        <span className="text-slate-700">·</span>
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400 font-semibold">{h.totalBeds}</span> Beds
                        </span>
                      </>
                    )}
                    {h.isVerified && (
                      <>
                        <span className="text-slate-700">·</span>
                        <span className="text-emerald-400 font-semibold">Verified</span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/doctors/${h._id}`}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-300 text-sm font-semibold hover:bg-blue-600/25 hover:border-blue-500/35 transition-all duration-200 group/btn"
                  >
                    <span>Explore Doctors</span>
                    <FaArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List view */
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
            {filteredHospitals.map((h) => (
              <div
                key={h._id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FaHospital className="text-blue-400 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-white text-sm">{h.hospitalName}</h2>
                    {h.isVerified && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Verified</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">
                    <FaMapMarkerAlt className="inline w-3 h-3 text-slate-500 mr-1" />
                    {[h.address, h.city, h.state].filter(Boolean).join(", ")}
                  </p>
                </div>
                {h.hospitalType && (
                  <span className="hidden sm:block text-xs font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full flex-shrink-0">
                    {h.hospitalType}
                  </span>
                )}
                <Link
                  href={`/doctors/${h._id}`}
                  className="flex-shrink-0 flex items-center gap-1.5 text-blue-400 text-xs font-semibold hover:text-blue-300 transition"
                >
                  Explore <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}