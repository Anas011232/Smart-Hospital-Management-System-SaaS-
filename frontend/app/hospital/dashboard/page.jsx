"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  Hospital,
  User,
  Mail,
  Phone,
  PhoneCall,
  Globe,
  MapPin,
  Building2,
  FileText,
  CalendarDays,
  Stethoscope,
  BedDouble,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Clock,
  BadgeCheck,
  AlertCircle,
  Hash,
  Star,
  Layers,
  TrendingUp,
  Lock,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import DoctorCTASection from "../../../components/doctor/DoctorCTASection";

/* ─────────────────────────── helpers ─────────────────────────── */
function fmt(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function planColor(plan) {
  const p = (plan || "").toLowerCase();
  if (p.includes("enterprise")) return "from-violet-500 to-purple-600";
  if (p.includes("pro")) return "from-cyan-500 to-blue-600";
  if (p.includes("premium")) return "from-amber-400 to-orange-500";
  return "from-slate-400 to-slate-600";
}

function statusColor(status) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "text-emerald-400 bg-emerald-400/10 border-emerald-500/30";
  if (s === "expired") return "text-red-400 bg-red-400/10 border-red-500/30";
  return "text-amber-400 bg-amber-400/10 border-amber-500/30";
}

/* ─────────────────────────── sub-components ─────────────────────── */

function GlowBlob({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

function InfoCard({ icon: Icon, label, value, accent = "blue", href }) {
  const accents = {
    blue: "group-hover:text-blue-400 group-hover:border-blue-500/40 group-hover:shadow-blue-500/10",
    cyan: "group-hover:text-cyan-400 group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10",
    violet: "group-hover:text-violet-400 group-hover:border-violet-500/40 group-hover:shadow-violet-500/10",
    emerald: "group-hover:text-emerald-400 group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10",
    amber: "group-hover:text-amber-400 group-hover:border-amber-500/40 group-hover:shadow-amber-500/10",
  };
  const iconAccents = {
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };

  const content = (
    <div
      className={`group relative flex items-start gap-4 p-5 rounded-2xl
        bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm
        transition-all duration-300 hover:bg-white/[0.07] hover:scale-[1.02]
        hover:shadow-lg ${accents[accent]} cursor-default`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          bg-white/[0.06] border border-white/[0.08] ${iconAccents[accent]}`}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-200 leading-snug break-all">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}

function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border border-white/[0.08]
        bg-gradient-to-br ${gradient} transition-all duration-300
        hover:scale-[1.03] hover:shadow-xl cursor-default group`}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.12] flex items-center justify-center">
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-white tracking-tight">{value ?? "—"}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mt-1">
            {label}
          </p>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/[0.06] group-hover:scale-125 transition-transform duration-500" />
    </div>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
        text-xs font-semibold border tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
        <Icon size={15} className="text-blue-400" />
      </div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">{title}</h2>
      <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
  );
}

function SubscriptionPanel({ hospital }) {
  const sc = statusColor(hospital.subscriptionStatus);
  const pc = planColor(hospital.subscriptionPlan);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.08]
        bg-white/[0.03] backdrop-blur-sm p-6"
    >
      {/* background accent */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2
          rounded-full blur-3xl opacity-10 bg-gradient-to-br ${pc}`}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
        {/* plan badge */}
        <div className="flex-shrink-0">
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl
              bg-gradient-to-r ${pc} shadow-lg`}
          >
            <Star size={16} className="text-white" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {hospital.subscriptionPlan || "Free"}
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Status</p>
            <Badge className={sc}>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hospital.subscriptionStatus?.toLowerCase() === "active"
                    ? "bg-emerald-400"
                    : "bg-red-400"
                }`}
              />
              {hospital.subscriptionStatus || "—"}
            </Badge>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Amount</p>
            <p className="text-sm font-bold text-slate-200">
              {hospital.subscriptionAmount
                ? `৳${Number(hospital.subscriptionAmount).toLocaleString()}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Duration</p>
            <p className="text-sm font-bold text-slate-200">
              {hospital.subscriptionMonths ? `${hospital.subscriptionMonths} mo` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Expires</p>
            <p className="text-sm font-bold text-slate-200">{fmt(hospital.expiresAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── main dashboard ─────────────────────── */

export default function Dashboard() {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/hospital/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHospital(res.data.hospital);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-blue-400 animate-spin [animation-direction:reverse] [animation-duration:700ms]" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
            Loading hospital profile…
          </p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Failed to load hospital data.</p>
        </div>
      </div>
    );
  }

  const fullAddress = [hospital.address, hospital.city, hospital.state, hospital.postalCode, hospital.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-slate-950 text-white font-['DM_Sans',sans-serif] relative overflow-x-hidden">
      {/* ── google font ── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Sora:wght@700;800&display=swap');`}</style>

      {/* ── ambient blobs ── */}
      <GlowBlob className="w-[600px] h-[600px] top-[-200px] left-[-200px] bg-blue-600" />
      <GlowBlob className="w-[500px] h-[500px] top-[300px] right-[-150px] bg-cyan-500" />
      <GlowBlob className="w-[400px] h-[400px] bottom-[100px] left-[30%] bg-violet-600" />

      {/* ── dot grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ══════════════ HEADER ══════════════ */}
        <header className="mb-10">
          {/* top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
              <Hospital size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                Hospital Portal
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hospital.isVerified ? (
                <Badge className="text-emerald-400 bg-emerald-400/10 border-emerald-500/30">
                  <BadgeCheck size={12} />
                  Verified
                </Badge>
              ) : (
                <Badge className="text-amber-400 bg-amber-400/10 border-amber-500/30">
                  <AlertCircle size={12} />
                  Unverified
                </Badge>
              )}
              {hospital.isBlocked && (
                <Badge className="text-red-400 bg-red-400/10 border-red-500/30">
                  <Lock size={12} />
                  Blocked
                </Badge>
              )}
            </div>
          </div>

          {/* hero row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-white/[0.12]
                  overflow-hidden shadow-2xl ring-4 ring-blue-500/10"
              >
                {hospital.hospitalImage ? (
                  <img
                    src={hospital.hospitalImage}
                    alt={hospital.hospitalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-cyan-600/30">
                    <Hospital size={36} className="text-cyan-400" />
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            {/* name + meta */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight
                  bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent
                  leading-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {hospital.hospitalName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin size={12} className="text-cyan-400" />
                  {hospital.city}{hospital.country ? `, ${hospital.country}` : ""}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Layers size={12} className="text-blue-400" />
                  {hospital.hospitalType || "General"}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CalendarDays size={12} className="text-violet-400" />
                  Est. {hospital.establishedYear || "—"}
                </span>
              </div>
            </div>

            {/* role pill */}
            <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
              <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Role</p>
                <p className="text-sm font-bold text-slate-200 capitalize mt-0.5">
                  {hospital.role || "admin"}
                </p>
              </div>
              <p className="text-[10px] text-slate-600">
                Member since {fmt(hospital.createdAt)}
              </p>
            </div>
          </div>
        </header>

        {/* ══════════════ SUBSCRIPTION PANEL ══════════════ */}
        <section className="mb-8">
          <SectionTitle icon={CreditCard} title="Subscription" />
          <SubscriptionPanel hospital={hospital} />
        </section>

        {/* ══════════════ STATS ══════════════ */}
        <section className="mb-8">
          <SectionTitle icon={TrendingUp} title="Key Statistics" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Stethoscope}
              label="Total Doctors"
              value={hospital.totalDoctors}
              gradient="from-blue-600/80 to-blue-900/80"
            />
            <StatCard
              icon={BedDouble}
              label="Total Beds"
              value={hospital.totalBeds}
              gradient="from-cyan-600/80 to-cyan-900/80"
            />
            <StatCard
              icon={Building2}
              label="Hospital Type"
              value={hospital.hospitalType || "General"}
              gradient="from-violet-600/80 to-violet-900/80"
            />
            <StatCard
              icon={CalendarDays}
              label="Established"
              value={hospital.establishedYear}
              gradient="from-emerald-600/80 to-emerald-900/80"
            />
          </div>
        </section>

        {/* ══════════════ CONTACT INFO ══════════════ */}
        <section className="mb-8">
          <SectionTitle icon={User} title="Contact Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <InfoCard icon={User} label="Owner / Admin" value={hospital.ownerName} accent="blue" />
            <InfoCard icon={Mail} label="Email Address" value={hospital.email} accent="cyan" />
            <InfoCard icon={Phone} label="Phone Number" value={hospital.phone} accent="violet" />
            <InfoCard
              icon={PhoneCall}
              label="Emergency Phone"
              value={hospital.emergencyPhone}
              accent="amber"
            />
            <InfoCard
              icon={Globe}
              label="Website"
              value={hospital.website}
              accent="emerald"
              href={hospital.website}
            />
            <InfoCard icon={MapPin} label="Full Address" value={fullAddress} accent="blue" />
          </div>
        </section>

        {/* ══════════════ SECURITY & COMPLIANCE ══════════════ */}
        <section className="mb-8">
          <SectionTitle icon={ShieldCheck} title="Security & Compliance" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              className={`flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-sm
                transition-all duration-300 hover:scale-[1.02]
                ${
                  hospital.isVerified
                    ? "bg-emerald-500/[0.06] border-emerald-500/20 hover:border-emerald-500/40"
                    : "bg-amber-500/[0.06] border-amber-500/20 hover:border-amber-500/40"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${
                    hospital.isVerified
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}
              >
                {hospital.isVerified ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
                  Verification
                </p>
                <p
                  className={`text-sm font-bold ${
                    hospital.isVerified ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {hospital.isVerified ? "Verified Hospital" : "Pending Verification"}
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-sm
                transition-all duration-300 hover:scale-[1.02]
                ${
                  !hospital.isBlocked
                    ? "bg-emerald-500/[0.06] border-emerald-500/20 hover:border-emerald-500/40"
                    : "bg-red-500/[0.06] border-red-500/20 hover:border-red-500/40"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${
                    !hospital.isBlocked
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
              >
                {!hospital.isBlocked ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
                  Account Status
                </p>
                <p
                  className={`text-sm font-bold ${
                    !hospital.isBlocked ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {hospital.isBlocked ? "Blocked" : "Active & In Good Standing"}
                </p>
              </div>
            </div>

            <InfoCard
              icon={Hash}
              label="License Number"
              value={hospital.licenseNumber}
              accent="violet"
            />
          </div>
        </section>

        {/* ══════════════ SYSTEM METADATA ══════════════ */}
        <section className="mb-10">
          <SectionTitle icon={Sparkles} title="System Info" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InfoCard icon={Hash} label="Hospital ID" value={hospital._id} accent="blue" />
            <InfoCard icon={FileText} label="URL Slug" value={hospital.slug} accent="cyan" />
            <InfoCard icon={Clock} label="Member Since" value={fmt(hospital.createdAt)} accent="violet" />
          </div>
        </section>

        <DoctorCTASection></DoctorCTASection>

        {/* ── footer ── */}
        <footer className="border-t border-white/[0.05] pt-6 text-center">
          <p className="text-xs text-slate-600">
            {hospital.hospitalName} · Hospital Management Portal · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}