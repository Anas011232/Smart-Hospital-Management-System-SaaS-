import {
  ListOrdered, LayoutDashboard, FileSignature,
  FolderOpen, Siren, BarChart3, CalendarClock,
  Bot, Pill,
} from "lucide-react";

const FEATURES = [
  { icon: ListOrdered,    title: "Live Queue System",       desc: "Real-time patient queue with dynamic priority management and wait time estimates.", color: "cyan" },
  { icon: LayoutDashboard,title: "Doctor Dashboard",        desc: "Personalized daily schedule, patient overview, and department metrics at a glance.", color: "blue" },
  { icon: FileSignature,  title: "Digital Prescriptions",  desc: "E-prescriptions with drug interaction alerts, templates, and pharmacy integration.", color: "violet" },
  { icon: FolderOpen,     title: "Patient Records",         desc: "Unified EMR with full history, lab results, imaging, and visit notes in one place.", color: "emerald" },
  { icon: Siren,          title: "Emergency System",        desc: "Priority triage routing, emergency bed allocation, and instant staff notification.", color: "rose" },
  { icon: BarChart3,      title: "Analytics Dashboard",    desc: "Hospital-wide KPIs, revenue reports, occupancy rates, and clinical outcomes.", color: "amber" },
  { icon: CalendarClock,  title: "Smart Scheduling",       desc: "AI-assisted appointment booking with conflict detection and automated reminders.", color: "cyan" },
  { icon: Bot,            title: "AI Assistant",            desc: "Integrated AI for clinical decision support, triage pre-screening, and documentation.", color: "violet" },
  { icon: Pill,           title: "Pharmacy Module",         desc: "Inventory tracking, dispensing workflow, and automatic reorder alerts built in.", color: "blue" },
];

const colorMap = {
  cyan:    "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  blue:    "bg-blue-500/10 border-blue-500/20 text-blue-400",
  violet:  "bg-violet-500/10 border-violet-500/20 text-violet-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  rose:    "bg-rose-500/10 border-rose-500/20 text-rose-400",
  amber:   "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

export default function FeaturesSection() {
  return (
    <section id="features"
      className="relative py-24 sm:py-32 px-5 sm:px-8 lg:px-12 bg-slate-950 overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
        rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* heading */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
            bg-white/[0.04] border border-white/[0.08]">
            <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
              Platform Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            Everything your hospital{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              needs to operate
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            A complete clinical and administrative platform — not a patchwork of tools.
          </p>
        </div>

        {/* feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07]
                hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20
                transition-all duration-300 cursor-default"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                mb-4 border ${colorMap[color]}
                group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-slate-100">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}