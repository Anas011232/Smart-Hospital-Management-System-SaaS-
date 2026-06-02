import { Building2, UserPlus, MonitorCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Building2,
    title: "Register Your Hospital",
    desc: "Create your hospital account in minutes. Verify your license and set up your profile — no technical expertise required.",
    color: "cyan",
  },
  {
    step: "02",
    icon: UserPlus,
    title: "Add Doctors & Staff",
    desc: "Invite your medical team, assign departments, manage schedules, and set role-based permissions with ease.",
    color: "blue",
  },
  {
    step: "03",
    icon: MonitorCheck,
    title: "Go Live Instantly",
    desc: "Start managing patients, queues, prescriptions, and real-time analytics from day one. Zero downtime.",
    color: "violet",
  },
];

const colorMap = {
  cyan:   { num: "text-cyan-400",   ring: "ring-cyan-500/20",   icon: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",   line: "from-cyan-500/30" },
  blue:   { num: "text-blue-400",   ring: "ring-blue-500/20",   icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",   line: "from-blue-500/30" },
  violet: { num: "text-violet-400", ring: "ring-violet-500/20", icon: "bg-violet-500/10 border-violet-500/20 text-violet-400", line: "from-violet-500/30" },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works"
      className="relative py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-slate-950 overflow-hidden">

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full
        bg-violet-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* heading */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
            bg-white/[0.04] border border-white/[0.08]">
            <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
              Getting Started
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            Up and running{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              in three steps
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            MedQube is designed for rapid deployment — most hospitals are fully operational within 24 hours.
          </p>
        </div>

        {/* steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)]
            h-px bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20" />

          {STEPS.map(({ step, icon: Icon, title, desc, color }, i) => {
            const c = colorMap[color];
            return (
              <div key={step} className="relative group">
                <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07]
                  hover:bg-white/[0.06] hover:-translate-y-1.5 hover:shadow-xl
                  transition-all duration-300 h-full">

                  {/* step number + icon row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-5xl font-black tracking-tighter opacity-20 ${c.num}`}
                      style={{ fontFamily: "'Sora', sans-serif" }}>
                      {step}
                    </span>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      border ${c.icon} ring-4 ${c.ring}
                      group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>

                  {/* arrow for non-last */}
                  {i < STEPS.length - 1 && (
                    <div className="md:hidden flex items-center gap-1.5 mt-5 text-xs text-slate-600">
                      <ArrowRight size={12} /> Continue
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}