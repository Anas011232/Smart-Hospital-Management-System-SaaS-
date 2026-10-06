"use client";

import { X, Stethoscope, CheckCircle2, ShieldAlert, Building2, Phone, Mail, Award, Calendar, Briefcase } from "lucide-react";

export default function ViewDoctorModal({ doctor, onClose }) {
  if (!doctor) return null;

  const createdAt = doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 pb-8 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            {doctor.photo ? (
              <img
                src={`http://localhost:5000${doctor.photo}`}
                alt={doctor.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/30"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-cyan-500/20">
                👨‍⚕️
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-xl">{doctor.fullName}</h3>
                {doctor.isVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 size={12} /> License Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldAlert size={12} /> Pending Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span className="text-cyan-400 font-semibold">{doctor.qualification || "MBBS"}</span>
                <span>•</span>
                <span>{doctor.designation || "Doctor"}</span>
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
          {/* Hospital & Department */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-cyan-400 uppercase text-[11px] tracking-wider flex items-center gap-2">
              <Building2 size={14} /> Hospital & Specialty
            </h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <p className="text-slate-500 text-[10px]">Medical / Hospital Affiliation</p>
                <p className="font-bold text-white text-sm mt-0.5">{doctor.hospitalName || "Independent Practitioner"}</p>
                {doctor.hospitalEmail && <p className="text-[10px] text-slate-400">{doctor.hospitalEmail}</p>}
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Specialization</p>
                <span className="inline-block mt-0.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase text-[10px]">
                  {doctor.specialization || "General Medicine"}
                </span>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Department</p>
                <p className="font-medium text-slate-200">{doctor.department || "Medical Department"}</p>
              </div>
            </div>
          </div>

          {/* Medical Registration & Licensing */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-violet-400 uppercase text-[11px] tracking-wider flex items-center gap-2">
              <Award size={14} /> License & Registration
            </h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <p className="text-slate-500 text-[10px]">BMDC Registration Number</p>
                <p className="font-mono font-bold text-white text-sm">
                  {doctor.medicalRegistrationNumber || doctor.licenseNumber || "BMDC-PENDING"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Years of Clinical Experience</p>
                <p className="font-semibold text-slate-200">{doctor.experienceYears || 0} Years</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Consultation Fee</p>
                <p className="font-bold text-emerald-400 text-sm">৳{doctor.consultationFee || 0} BDT</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3 md:col-span-2">
            <h4 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-2">
              <Mail size={14} /> Doctor Contact Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <p className="text-slate-500 text-[10px]">Email Address</p>
                <p className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} className="text-slate-400" /> {doctor.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Phone Number</p>
                <p className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Phone size={12} className="text-slate-400" /> {doctor.phone || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">Registered on: {createdAt}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
