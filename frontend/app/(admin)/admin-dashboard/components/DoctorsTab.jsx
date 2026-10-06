"use client";

import { useState } from "react";
import {
  Search,
  Stethoscope,
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
} from "lucide-react";
import ViewDoctorModal from "../modal/ViewDoctorModal";

export default function DoctorsTab({
  doctors,
  totalCount,
  page,
  totalPages,
  onPageChange,
  searchQuery,
  setSearchQuery,
  specializationFilter,
  setSpecializationFilter,
  hospitalFilter,
  setHospitalFilter,
  hospitalsList = [],
  onVerifyDoctor,
  onBlockDoctor,
  loading,
}) {
  const [selectedDoctorForView, setSelectedDoctorForView] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name, email, department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Filters: Hospital/Medical Filter & Specialization Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Medical / Hospital Wise Filter */}
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-cyan-400" />
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[200px] truncate"
            >
              <option value="all">All Hospitals / Medicals</option>
              {hospitalsList.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.hospitalName}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Specializations</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Medicine">Medicine</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Gynecology">Gynecology</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Table (Fits 100% container width with zero horizontal scrolling) */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading medical staff data...</div>
        ) : doctors.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Stethoscope size={40} className="mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">No doctors match your filter criteria.</p>
            <p className="text-xs">Try adjusting your search query or hospital / specialization filters.</p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300 table-fixed border-collapse">
              <thead className="bg-slate-950/90 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3.5 px-3 w-[26%]">Doctor & Qualification</th>
                  <th className="py-3.5 px-2 w-[18%]">Hospital / Medical</th>
                  <th className="py-3.5 px-2 w-[18%]">Specialty & Reg #</th>
                  <th className="py-3.5 px-2 w-[13%]">Fee / Experience</th>
                  <th className="py-3.5 px-2 w-[11%]">License Status</th>
                  <th className="py-3.5 px-3 w-[14%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {doctors.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Doctor Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {d.photo ? (
                          <img
                            src={`http://localhost:5000${d.photo}`}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                            👨‍⚕️
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-xs truncate" title={d.fullName}>{d.fullName}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5" title={`${d.qualification || "MBBS"} · ${d.email}`}>
                            {d.qualification || "MBBS"} · {d.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Hospital Name */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1 text-slate-200 font-medium text-xs truncate" title={d.hospitalName || "Independent"}>
                        <Building2 size={12} className="text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{d.hospitalName || "Independent"}</span>
                      </div>
                    </td>

                    {/* Specialization & Reg # */}
                    <td className="py-3 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[9px] uppercase inline-block truncate max-w-full">
                        {d.specialization || "General"}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate" title={d.medicalRegistrationNumber || d.licenseNumber}>
                        {d.medicalRegistrationNumber || d.licenseNumber || "BMDC-PENDING"}
                      </p>
                    </td>

                    {/* Fee & Experience */}
                    <td className="py-3 px-2">
                      <p className="font-bold text-emerald-400 text-xs">৳{d.consultationFee || 0}</p>
                      <p className="text-[10px] text-slate-400">{d.experienceYears || 0} yrs exp</p>
                    </td>

                    {/* License Verification */}
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedDoctorForView(d)}
                        className="px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 font-semibold text-[10px] transition-all inline-flex items-center gap-1"
                        title="View Full Doctor Details"
                      >
                        <Eye size={11} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total doctors)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Doctor Modal */}
      {selectedDoctorForView && (
        <ViewDoctorModal
          doctor={selectedDoctorForView}
          onClose={() => setSelectedDoctorForView(null)}
        />
      )}
    </div>
  );
}
