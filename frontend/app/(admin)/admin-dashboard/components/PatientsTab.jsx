"use client";

import { useState } from "react";
import {
  Search,
  Users,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PatientsTab({
  patients,
  totalCount,
  page,
  totalPages,
  onPageChange,
  searchQuery,
  setSearchQuery,
  onBlockPatient,
  loading,
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients by name, email, phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="text-xs text-slate-400">
          Total Registered Patients: <strong className="text-white font-bold">{totalCount}</strong>
        </div>
      </div>

      {/* Patients Table (Fits 100% container width with zero horizontal scrolling) */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading patients records...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users size={40} className="mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">No patients found.</p>
            <p className="text-xs">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300 table-fixed border-collapse">
              <thead className="bg-slate-950/90 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3.5 px-3 w-[28%]">Patient & Email</th>
                  <th className="py-3.5 px-2 w-[16%]">Phone Number</th>
                  <th className="py-3.5 px-2 w-[10%]">Blood Group</th>
                  <th className="py-3.5 px-2 w-[20%]">Emergency Contact</th>
                  <th className="py-3.5 px-2 w-[12%]">Reg Date</th>
                  <th className="py-3.5 px-2 w-[10%]">Status</th>
                  <th className="py-3.5 px-3 w-[14%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {patients.map((p) => {
                  const regDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—";
                  const initials = p.name
                    ? p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "P";

                  return (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-xs flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white text-xs truncate" title={p.name}>{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5" title={p.email}>{p.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-2 text-slate-300 font-mono text-xs truncate" title={p.phone}>{p.phone || "—"}</td>

                      {/* Blood Group */}
                      <td className="py-3 px-2">
                        {p.medical?.bloodGroup ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20 font-bold text-[10px]">
                            {p.medical.bloodGroup}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">—</span>
                        )}
                      </td>

                      {/* Emergency Contact */}
                      <td className="py-3 px-2">
                        {p.emergencyContact?.name ? (
                          <div className="truncate">
                            <p className="font-semibold text-slate-200 text-xs truncate" title={p.emergencyContact.name}>{p.emergencyContact.name}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5" title={`${p.emergencyContact.relation} · ${p.emergencyContact.phone}`}>
                              {p.emergencyContact.relation} · {p.emergencyContact.phone}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[10px]">—</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-2 text-slate-400 text-xs truncate">{regDate}</td>

                      {/* Status */}
                      <td className="py-3 px-2">
                        {p.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <Lock size={10} /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Unlock size={10} /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onBlockPatient(p._id, !p.isBlocked)}
                          className={`px-2.5 py-1 rounded-md font-semibold text-[10px] transition-all ${
                            p.isBlocked
                              ? "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30"
                              : "bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30"
                          }`}
                        >
                          {p.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total patients)
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
    </div>
  );
}
