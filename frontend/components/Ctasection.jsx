"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="relative py-24 sm:py-36 px-5 sm:px-8 lg:px-12 overflow-hidden bg-slate-950">

      {/* layered bg glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/20 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[700px] h-[400px] rounded-full bg-cyan-800/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[400px] h-[300px] rounded-full bg-blue-800/15 blur-[80px] pointer-events-none" />

      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
          bg-white/[0.05] border border-white/[0.10]">
          <Sparkles size={12} className="text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 tracking-widest uppercase">
            Start Today — Free Trial Available
          </span>
        </div>

        {/* heading */}
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          <span className="text-white">Ready to transform</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400
            bg-clip-text text-transparent">
            your hospital?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Join 500+ hospitals already running on MedQube. Deploy in hours, not weeks —
          and give your team the tools they deserve.
        </p>

        {/* actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push("/register/hospital")}
            className="flex items-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-2xl
              font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white
              hover:from-cyan-400 hover:to-blue-500 hover:scale-105
              shadow-2xl shadow-cyan-500/25 transition-all duration-200"
          >
            Get Started Free <ArrowRight size={16} />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-2xl
              font-semibold text-sm text-slate-300 border border-white/[0.15]
              hover:bg-white/[0.07] hover:text-white hover:border-white/30
              backdrop-blur-sm transition-all duration-200"
          >
            View Demo
          </button>
        </div>

        {/* social proof */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6
          text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            14-day free trial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}