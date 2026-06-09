"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FiSearch, FiStar, FiX, FiClock, FiDollarSign, FiAward, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function DoctorPage() {
  const { hospitalId } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  const getImage = (photo) => {
    if (!photo) return "/doctor-placeholder.png";
    if (photo.startsWith("http")) return photo;
    const path = photo.startsWith("/") ? photo : `/${photo}`;
    return `${BASE_URL}${path}`;
  };

  useEffect(() => {
    if (!hospitalId) return;
    api
      .get(`/doctors/specializations/${hospitalId}`)
      .then((res) => { setSpecializations(res.data?.specializations || []); })
      .catch((err) => { console.error(err); });
  }, [hospitalId]);

  useEffect(() => {
    if (!hospitalId) return;
    fetchDoctors();
  }, [hospitalId, search, specialization, sortBy]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctors/hospital/${hospitalId}/filter`, {
        params: { search, specialization, sortBy },
      });
      setDoctors(res.data?.doctors || []);
    } catch (err) {
      console.error("Doctor Load Error:", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const r = Math.round(rating || 0);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <FiStar
            key={i}
            className={`w-3 h-3 ${i <= r ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header */}
      <div className="relative border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">Specialists</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Find a Doctor</h1>
          <p className="text-slate-400 mt-2 text-sm max-w-md">Browse specialists and book your next consultation.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Filter Panel */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            {/* Specialization */}
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="py-2.5 px-3 bg-slate-800/70 border border-slate-700/60 rounded-xl text-slate-200 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none cursor-pointer"
            >
              <option value="all">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3 bg-slate-800/70 border border-slate-700/60 rounded-xl text-slate-200 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none cursor-pointer"
            >
              <option value="">Sort Doctors</option>
              <option value="fee-low">Fee: Low to High</option>
              <option value="fee-high">Fee: High to Low</option>
              <option value="exp">Experience: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-slate-500 text-xs font-medium">
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-800/60 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-700/50" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                  <div className="h-3 bg-slate-700 rounded w-2/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-14 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
              <FiSearch className="text-slate-600 w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-slate-200 font-semibold">No doctors found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => setSelectedDoctor(doctor)}
                className="group cursor-pointer rounded-2xl border border-slate-700/50 bg-slate-900/60 overflow-hidden hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300"
              >
                {/* Doctor Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={getImage(doctor.photo)}
                    alt={doctor.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "/doctor-placeholder.png"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  {/* Active Badge */}
                  {doctor.isActive && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available
                    </span>
                  )}
                  {/* Rating overlay */}
                  {doctor.rating > 0 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {Number(doctor.rating).toFixed(1)}
                      <span className="text-white/50">({doctor.reviewsCount || 0})</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="mb-3">
                    <h2 className="font-bold text-white text-base leading-tight">{doctor.fullName}</h2>
                    <p className="text-blue-400 text-xs font-semibold mt-0.5">{doctor.specialization}</p>
                    {doctor.designation && (
                      <p className="text-slate-500 text-xs mt-0.5">{doctor.designation}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 mb-0.5">Fee</p>
                      <p className="text-slate-200 text-xs font-bold">{doctor.consultationFee} <span className="text-slate-500 font-normal">BDT</span></p>
                    </div>
                    <div className="text-center border-x border-slate-800">
                      <p className="text-[10px] text-slate-500 mb-0.5">Exp</p>
                      <p className="text-slate-200 text-xs font-bold">{doctor.experienceYears || 0} <span className="text-slate-500 font-normal">yr</span></p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 mb-0.5">Patients</p>
                      <p className="text-slate-200 text-xs font-bold">{doctor.totalPatients || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ minHeight: "100dvh", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <FiX className="w-4 h-4" />
            </button>

            {/* Doctor Photo */}
            <div className="relative h-56 overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
              <img
                src={getImage(selectedDoctor.photo)}
                alt={selectedDoctor.fullName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/doctor-placeholder.png"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="text-2xl font-black text-white">{selectedDoctor.fullName}</h2>
                <p className="text-blue-400 text-sm font-semibold mt-0.5">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Fee", value: `${selectedDoctor.consultationFee} BDT`, icon: FiDollarSign },
                  { label: "Experience", value: `${selectedDoctor.experienceYears || 0} yrs`, icon: FiAward },
                  { label: "Rating", value: Number(selectedDoctor.rating || 0).toFixed(1), icon: FiStar },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-3 text-center">
                      <Icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-sm">{stat.value}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Details */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 divide-y divide-slate-800">
                {[
                  { label: "Department", value: selectedDoctor.department },
                  { label: "Qualification", value: selectedDoctor.qualification },
                  { label: "Designation", value: selectedDoctor.designation },
                  { label: "Schedule", value: selectedDoctor.startTime && selectedDoctor.endTime ? `${selectedDoctor.startTime} – ${selectedDoctor.endTime}` : null },
                  { label: "Available Days", value: Array.isArray(selectedDoctor.availableDays) ? selectedDoctor.availableDays.join(", ") : selectedDoctor.availableDays },
                  { label: "Max Patients/Day", value: selectedDoctor.maxPatientsPerDay },
                ].filter((r) => r.value).map((row) => (
                  <div key={row.label} className="flex items-start gap-3 px-4 py-3">
                    <span className="text-slate-500 text-xs w-32 flex-shrink-0 pt-0.5">{row.label}</span>
                    <span className="text-slate-200 text-xs font-medium flex-1">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="flex flex-col sm:flex-row gap-2">
                {selectedDoctor.phone && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex-1 min-w-0">
                    <FiPhone className="text-slate-400 w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-slate-300 text-xs truncate">{selectedDoctor.phone}</span>
                  </div>
                )}
                {selectedDoctor.email && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex-1 min-w-0">
                    <FiMail className="text-slate-400 w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-slate-300 text-xs truncate">{selectedDoctor.email}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {selectedDoctor.bio && (
                <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-4">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">About</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedDoctor.bio}</p>
                </div>
              )}

              {/* Languages */}
              {selectedDoctor.languages?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.languages.map((lang) => (
                    <span key={lang} className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              )}

              {/* Book CTA */}
              <Link
                href={`/appointments/book/${selectedDoctor._id}`}
                className="block w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-center font-bold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-600/20"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}