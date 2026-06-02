import { ShieldCheck, Zap, Globe2, Lock, Clock, HeartPulse } from "lucide-react";

const CARDS = [
  {
    icon: ShieldCheck,
    title: "HIPAA Compliant",
    desc: "All patient data is encrypted end-to-end and fully compliant with healthcare privacy standards.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Real-Time Operations",
    desc: "Instant updates across queues, doctor availability, and patient records — zero lag.",
    color: "cyan",
  },
  {
    icon: Globe2,
    title: "Trusted Worldwide",
    desc: "Used by growing hospital networks across 30+ countries with 99.9% uptime SLA.",
    color: "blue",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    desc: "Role-based access control, audit logs, and multi-factor authentication included.",
    color: "violet",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Dedicated support engineers available around the clock for mission-critical incidents.",
    color: "amber",
  },
  {
    icon: HeartPulse,
    title: "Patient-First Design",
    desc: "Every feature is designed with patient outcomes and care team efficiency in mind.",
    color: "rose",
  },
];

const colorMap = {
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-400/40 group-hover:shadow-emerald-500/10",
  cyan:    "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:border-cyan-400/40 group-hover:shadow-cyan-500/10",
  blue:    "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:border-blue-400/40 group-hover:shadow-blue-500/10",
  violet:  "bg-violet-500/10 border-violet-500/20 text-violet-400 group-hover:border-violet-400/40 group-hover:shadow-violet-500/10",
  amber:   "bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:border-amber-400/40 group-hover:shadow-amber-500/10",
  rose:    "bg-rose-500/10 border-rose-500/20 text-rose-400 group-hover:border-rose-400/40 group-hover:shadow-rose-500/10",
};

export default function TrustSection() {
  return (
    <section id="trust" className="relative py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-slate-950 overflow-hidden">
      {/* bg accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[800px] h-[400px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
            bg-white/[0.04] border border-white/[0.08]">
            <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
              Why MedQube
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            Built for Healthcare.<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Trusted by Professionals.
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Every feature is purpose-built for clinical environments where reliability
            and speed are non-negotiable.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className={`group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07]
                backdrop-blur-sm transition-all duration-300
                hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-xl
                ${colorMap[color].split(" ").filter(c => c.startsWith("group-hover")).join(" ")}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4
                border ${colorMap[color].split(" ").slice(0, 3).join(" ")}`}>
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}