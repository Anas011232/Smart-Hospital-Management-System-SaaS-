"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="hms-card animate-pulse">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded-full w-2/3" />
          <div className="h-3 bg-slate-800/60 rounded-full w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        {[80, 60, 70, 50].map((w, i) => (
          <div key={i} className="h-3 bg-slate-800/50 rounded-full" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <div className="flex-1 h-9 bg-slate-800 rounded-xl" />
        <div className="flex-1 h-9 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

// ── Doctor card ────────────────────────────────────────────────────────────────
function DoctorCard({ doctor, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`hms-card group transition-all duration-300 ${hovered ? "hms-card-hover" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          {doctor.photo ? (
            <img
              src={`http://localhost:5000${doctor.photo}`}
              alt={doctor.fullName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700/60 group-hover:ring-cyan-500/40 transition-all duration-300"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center text-2xl group-hover:border-cyan-500/40 transition-all duration-300">
              👨‍⚕️
            </div>
          )}
          <div>
            <h2 className="font-semibold text-white text-base leading-snug tracking-tight">
              {doctor.fullName}
            </h2>
            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
              {doctor.specialization}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-5" />

      {/* Info rows */}
      <div className="space-y-3">
        <InfoRow icon="✉" label="Email" value={doctor.email} />
        <InfoRow icon="📞" label="Phone" value={doctor.phone} />
        <InfoRow icon="🏥" label="Dept" value={doctor.department} />
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Consult. Fee</span>
          <span className="text-lg font-bold text-white tracking-tight">
            <span className="text-slate-400 text-sm font-normal mr-0.5">৳</span>
            {doctor.consultationFee}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 mt-6">
        <Link
          href={`/hospital/doctors/edit/${doctor._id}`}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 hover:border-slate-600 transition-all duration-200 hover:-translate-y-px"
        >
          Edit Profile
        </Link>
        <button
          onClick={() => onDelete(doctor._id)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 hover:-translate-y-px"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-5 text-center opacity-60">{icon}</span>
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest w-10 shrink-0">{label}</span>
      <span className="text-sm text-slate-300 truncate">{value}</span>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center text-4xl mb-6 shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]">
        🩺
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No doctors onboarded yet</h3>
      <p className="text-slate-400 text-sm max-w-xs mb-8 leading-relaxed">
        Start building your medical team by adding your first doctor to the roster.
      </p>
      <Link
        href="/hospital/doctors/add"
        className="hms-btn-primary"
      >
        + Add First Doctor
      </Link>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { console.error("No token found"); setLoading(false); return; }

      const res = await axios.get("http://localhost:5000/api/doctors/my-doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("DOCTORS =", res.data);
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      if (err.response) { console.log("STATUS:", err.response.status); console.log("DATA:", err.response.data); }
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Please login again"); return; }

      const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      if (err.response) { console.log(err.response.data); }
    }
  };

  useEffect(() => { loadDoctors(); }, []);

  return (
    <>
      {/* ── Global styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .hms-root {
          min-height: 100vh;
          background-color: #060B14;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 90%, rgba(59,130,246,0.05) 0%, transparent 60%);
          font-family: 'Instrument Sans', system-ui, sans-serif;
          color: #e2e8f0;
        }

        .hms-card {
          background: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,20,36,0.98) 100%);
          border: 1px solid rgba(51,65,85,0.5);
          border-radius: 20px;
          padding: 22px;
          backdrop-filter: blur(12px);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .hms-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(6,182,212,0.0) 0%, rgba(6,182,212,0.0) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .hms-card-hover, .hms-card:hover {
          transform: translateY(-3px);
          border-color: rgba(6,182,212,0.25);
          box-shadow: 0 20px 60px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.1), 0 4px 20px -5px rgba(6,182,212,0.15);
        }

        .hms-card:hover::before {
          background: linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.08) 100%);
        }

        .hms-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%);
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px -4px rgba(8,145,178,0.5), 0 0 0 1px rgba(14,165,233,0.3);
          letter-spacing: -0.01em;
        }

        .hms-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px -6px rgba(8,145,178,0.6), 0 0 0 1px rgba(14,165,233,0.5);
          background: linear-gradient(135deg, #0e7490 0%, #0284c7 100%);
        }

        .hms-btn-primary:active { transform: translateY(0); }

        .hms-stat-card {
          background: rgba(15,23,42,0.7);
          border: 1px solid rgba(51,65,85,0.4);
          border-radius: 16px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-in {
          animation: fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .animate-in-delay-1 { animation-delay: 0.05s; }
        .animate-in-delay-2 { animation-delay: 0.10s; }
        .animate-in-delay-3 { animation-delay: 0.15s; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse { animation: pulse 1.8s ease-in-out infinite; }

        .hms-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="hms-root">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

          {/* ── Header ── */}
          <div className="animate-in flex flex-col gap-6 mb-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 hms-mono">
              <span>hospital</span>
              <span className="text-slate-700">/</span>
              <span className="text-cyan-400">doctors</span>
            </div>

            {/* Title row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0 }}>
                  Medical Staff
                </h1>
                <p style={{ marginTop: 6, fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
                  Manage your hospital's doctor roster and profiles.
                </p>
              </div>

              <Link href="/hospital/doctors/add" className="hms-btn-primary">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Doctor
              </Link>
            </div>

            {/* Stat chips */}
            {!loading && doctors.length > 0 && (
              <div className="animate-in animate-in-delay-1" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatChip
                  label="Total Doctors"
                  value={doctors.length}
                  color="cyan"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  }
                />
                <StatChip
                  label="Departments"
                  value={[...new Set(doctors.map(d => d.department).filter(Boolean))].length}
                  color="blue"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  }
                />
                <StatChip
                  label="Avg. Fee"
                  value={`৳${Math.round(doctors.reduce((s, d) => s + (Number(d.consultationFee) || 0), 0) / doctors.length)}`}
                  color="emerald"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  }
                />
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(51,65,85,0.5) 30%, rgba(51,65,85,0.5) 70%, transparent)", marginBottom: 28 }} />

          {/* ── Content ── */}
          {loading ? (
            <div className="hms-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : doctors.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="hms-grid">
              {doctors.map((doctor, i) => (
                <div
                  key={doctor._id}
                  className="animate-in"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <DoctorCard doctor={doctor} onDelete={deleteDoctor} />
                </div>
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          {!loading && doctors.length > 0 && (
            <p style={{ textAlign: "center", marginTop: 40, fontSize: 12, color: "#334155" }} className="hms-mono">
              {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} on record
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ── Stat chip helper ───────────────────────────────────────────────────────────
function StatChip({ label, value, color, icon }) {
  const colors = {
    cyan:    { bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.2)",  text: "#22d3ee" },
    blue:    { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: "#60a5fa" },
    emerald: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", text: "#34d399" },
  };
  const c = colors[color] || colors.cyan;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: "10px 16px",
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12,
    }}>
      <span style={{ color: c.text, opacity: 0.8 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: c.text, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}