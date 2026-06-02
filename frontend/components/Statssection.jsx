import { TrendingUp } from "lucide-react";

const STATS = [
  { count: "500+",   label: "Hospitals",    sub: "Globally deployed" },
  { count: "10K+",   label: "Doctors",      sub: "Active on platform" },
  { count: "1M+",    label: "Patients",     sub: "Records managed" },
  { count: "99.9%",  label: "Uptime SLA",   sub: "Enterprise grade" },
];

export default function StatsSection() {
  return (
    <section id="stats"
      className="relative py-20 sm:py-28 px-5 sm:px-8 lg:px-12 overflow-hidden bg-slate-950">

      {/* full-width gradient band */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-blue-950/40 to-violet-950/30 pointer-events-none" />
      <div className="absolute inset-0 border-y border-white/[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[700px] h-[300px] rounded-full bg-cyan-800/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* label */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <TrendingUp size={14} className="text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Platform Metrics
          </span>
        </div>

        {/* stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-3xl overflow-hidden
          border border-white/[0.07] shadow-2xl">
          {STATS.map(({ count, label, sub }) => (
            <div
              key={label}
              className="group flex flex-col items-center justify-center text-center
                py-12 px-6 bg-slate-950 hover:bg-white/[0.04]
                transition-colors duration-300 cursor-default"
            >
              <span
                className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2
                  bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {count}
              </span>
              <span className="text-sm font-bold text-slate-300 mb-1">{label}</span>
              <span className="text-xs text-slate-600">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}