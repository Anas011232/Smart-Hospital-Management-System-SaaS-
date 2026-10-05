"use client";

import { useState } from "react";
import {
  Search,
  Building2,
  CheckCircle2,
  ShieldAlert,
  Lock,
  Unlock,
  CreditCard,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import ViewHospitalModal from "../modal/ViewHospitalModal";

export default function HospitalsTab({
  hospitals,
  totalCount,
  page,
  totalPages,
  onPageChange,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  onVerifyHospital,
  onBlockHospital,
  onEditSubscription,
  onDeleteHospital,
  loading,
}) {
  const [selectedHospitalForView, setSelectedHospitalForView] = useState(null);

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
            placeholder="Search hospitals by name, email, city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Verification Status</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Subscription Plans</option>
            <option value="Basic">Basic Plan</option>
            <option value="Pro">Pro Plan</option>
            <option value="Enterprise">Enterprise Plan</option>
          </select>
        </div>
      </div>

      {/* Hospital Data Table (Fits 100% container width with zero horizontal scrolling) */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading hospital data...</div>
        ) : hospitals.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Building2 size={40} className="mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">No hospitals match your filter criteria.</p>
            <p className="text-xs">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300 table-fixed border-collapse">
              <thead className="bg-slate-950/90 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3.5 px-3 w-[25%]">Hospital Info</th>
                  <th className="py-3.5 px-2 w-[12%]">Location</th>
                  <th className="py-3.5 px-2 w-[10%]">License #</th>
                  <th className="py-3.5 px-2 w-[15%]">Plan & Expiration</th>
                  <th className="py-3.5 px-2 w-[11%]">Verification</th>
                  <th className="py-3.5 px-2 w-[9%]">Access</th>
                  <th className="py-3.5 px-3 w-[18%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {hospitals.map((h) => {
                  const expires = h.expiresAt ? new Date(h.expiresAt).toLocaleDateString() : "—";
                  const isExpiringSoon =
                    h.expiresAt &&
                    new Date(h.expiresAt) > new Date() &&
                    new Date(h.expiresAt) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                  return (
                    <tr key={h._id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Name & Owner */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {h.hospitalImage ? (
                            <img
                              src={`http://localhost:5000/${h.hospitalImage}`}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                              🏥
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white text-xs truncate" title={h.hospitalName}>{h.hospitalName}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5" title={`${h.ownerName || "—"} · ${h.email}`}>
                              {h.ownerName || "—"} · {h.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-2">
                        <p className="text-slate-200 font-medium text-xs truncate" title={h.city}>{h.city || "—"}</p>
                        <p className="text-[10px] text-slate-500 truncate">{h.country || "BD"}</p>
                      </td>

                      {/* License */}
                      <td className="py-3 px-2 font-mono text-slate-300 text-xs truncate" title={h.licenseNumber}>{h.licenseNumber || "—"}</td>

                      {/* Subscription */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase text-[9px]">
                            {h.subscriptionPlan || "Basic"}
                          </span>
                          <span className="text-slate-300 font-bold text-[11px]">৳{h.subscriptionAmount || 0}</span>
                        </div>
                        <p className={`text-[10px] mt-0.5 truncate ${isExpiringSoon ? "text-amber-400 font-semibold" : "text-slate-500"}`}>
                          Exp: {expires}
                        </p>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3 px-2">
                        {h.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <ShieldAlert size={10} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Account Block Status */}
                      <td className="py-3 px-2">
                        {h.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <Lock size={10} /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Unlock size={10} /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions in 2 Compact Organized Rows */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex flex-col items-end gap-1">
                          {/* Row 1: View Details + Verify + Block */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedHospitalForView(h)}
                              className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 font-semibold text-[10px] transition-all inline-flex items-center gap-1"
                              title="View Full Hospital Details"
                            >
                              <Eye size={11} /> Details
                            </button>

                            <button
                              onClick={() => onVerifyHospital(h._id, !h.isVerified)}
                              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-all ${
                                h.isVerified
                                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                  : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                              }`}
                              title={h.isVerified ? "Mark as Unverified" : "Verify Hospital"}
                            >
                              {h.isVerified ? "Unverify" : "Verify"}
                            </button>

                            <button
                              onClick={() => onBlockHospital(h._id, !h.isBlocked)}
                              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-all ${
                                h.isBlocked
                                  ? "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30"
                                  : "bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30"
                              }`}
                              title={h.isBlocked ? "Unblock Access" : "Block Access"}
                            >
                              {h.isBlocked ? "Unblock" : "Block"}
                            </button>
                          </div>

                          {/* Row 2: Edit Plan + Delete */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditSubscription(h)}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 font-semibold text-[10px] transition-all inline-flex items-center gap-1"
                              title="Edit Subscription Plan"
                            >
                              <CreditCard size={11} /> Edit Plan
                            </button>

                            <button
                              onClick={() => onDeleteHospital(h._id, h.hospitalName)}
                              className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-semibold text-[10px] transition-all inline-flex items-center gap-1"
                              title="Delete Hospital"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </div>
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
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total hospitals)
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

      {/* View Details Modal */}
      {selectedHospitalForView && (
        <ViewHospitalModal
          hospital={selectedHospitalForView}
          onClose={() => setSelectedHospitalForView(null)}
          onVerify={(id, status) => {
            onVerifyHospital(id, status);
            setSelectedHospitalForView((prev) => (prev ? { ...prev, isVerified: status } : null));
          }}
          onBlock={(id, status) => {
            onBlockHospital(id, status);
            setSelectedHospitalForView((prev) => (prev ? { ...prev, isBlocked: status } : null));
          }}
        />
      )}
    </div>
  );
}
