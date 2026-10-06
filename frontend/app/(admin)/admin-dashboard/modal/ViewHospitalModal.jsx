"use client";

import { X, Building2, ShieldCheck, ShieldAlert, Lock, Unlock, Mail, Phone, MapPin, CreditCard, ExternalLink, Calendar, User, Award } from "lucide-react";

export default function ViewHospitalModal({ hospital, onClose, onVerify }) {
  if (!hospital) return null;

  const expires = hospital.expiresAt ? new Date(hospital.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const createdAt = hospital.createdAt ? new Date(hospital.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 pb-8 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            {hospital.hospitalImage ? (
              <img
                src={`http://localhost:5000/${hospital.hospitalImage}`}
                alt={hospital.hospitalName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20">
                🏥
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-xl">{hospital.hospitalName}</h3>
                {hospital.isVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldAlert size={12} /> Pending Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{hospital.hospitalType || "General"} Hospital</span>
                <span>•</span>
                <span>Established {hospital.establishedYear || "N/A"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Detailed Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Owner & Contact Details */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-cyan-400 uppercase text-[11px] tracking-wider flex items-center gap-2">
              <User size={14} /> Owner & Contact Information
            </h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <p className="text-slate-500 text-[10px]">Owner / Director Name</p>
                <p className="font-semibold text-white text-sm">{hospital.ownerName || "—"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Official Email</p>
                <p className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} className="text-slate-400" /> {hospital.email}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Phone Number</p>
                <p className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Phone size={12} className="text-slate-400" /> {hospital.phone || "—"}
                </p>
              </div>
              {hospital.emergencyPhone && (
                <div>
                  <p className="text-slate-500 text-[10px]">Emergency Hotline</p>
                  <p className="font-medium text-red-400 flex items-center gap-1.5 mt-0.5">
                    <Phone size={12} className="text-red-400" /> {hospital.emergencyPhone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location & License */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-violet-400 uppercase text-[11px] tracking-wider flex items-center gap-2">
              <MapPin size={14} /> Location & License Info
            </h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <p className="text-slate-500 text-[10px]">Medical License Number</p>
                <p className="font-mono font-bold text-white text-sm">{hospital.licenseNumber || "—"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Address</p>
                <p className="font-medium text-slate-200">{hospital.address || "—"}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">City, State & Country</p>
                <p className="font-medium text-slate-200">
                  {hospital.city ? `${hospital.city}, ` : ""}
                  {hospital.state ? `${hospital.state}, ` : ""}
                  {hospital.country || "Bangladesh"}
                </p>
              </div>
              {hospital.website && (
                <div>
                  <p className="text-slate-500 text-[10px]">Website</p>
                  <a
                    href={hospital.website.startsWith("http") ? hospital.website : `https://${hospital.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {hospital.website} <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Infrastructure Stats */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-2">
              <Building2 size={14} /> Hospital Capacity
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">Total Doctors</p>
                <p className="text-lg font-black text-emerald-400 mt-1">{hospital.totalDoctors || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">Total Beds</p>
                <p className="text-lg font-black text-cyan-400 mt-1">{hospital.totalBeds || 0}</p>
              </div>
            </div>
          </div>

          {/* Subscription & Account Status */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-amber-400 uppercase text-[11px] tracking-wider flex items-center gap-2">
              <CreditCard size={14} /> Subscription & Status
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px]">Plan Tier</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-bold uppercase text-[10px] border border-cyan-500/20">
                  {hospital.subscriptionPlan || "Basic"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px]">Amount Paid</span>
                <span className="font-bold text-white">৳{hospital.subscriptionAmount || 0} ({hospital.subscriptionMonths || 1} Months)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px]">Expires On</span>
                <span className="font-semibold text-amber-300">{expires}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">Registered on: {createdAt}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVerify(hospital._id, !hospital.isVerified)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                hospital.isVerified
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
              }`}
            >
              {hospital.isVerified ? "Mark Unverified" : "Verify Hospital"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
