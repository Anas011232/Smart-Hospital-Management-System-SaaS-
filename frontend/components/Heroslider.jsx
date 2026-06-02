"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";

/* ── Slide config: swap these URLs to update the visual theme ── */
export const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&q=80",
    label: "Modern Hospital",
  },
  {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1800&q=80",
    label: "Advanced Care",
  },
  {
    url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1800&q=80",
    label: "Digital Health",
  },
  {
    url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1800&q=80",
    label: "Patient First",
  },
];

export default function HeroSlider() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── slide backgrounds ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `url(${slide.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* ── layered overlays ── */}
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />

      {/* ── ambient blobs ── */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />

      {/* ── content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center pt-20">

        {/* pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
          bg-white/[0.06] border border-white/[0.10] backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 tracking-widest uppercase">
            Next-Gen Hospital SaaS Platform
          </span>
        </div>

        {/* headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          <span className="text-white">Smart Hospital</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400
            bg-clip-text text-transparent">
            Management System
          </span>
        </h1>

        {/* sub */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Unify your hospital operations — doctors, patients, queues, and analytics —
          in one real-time SaaS platform built for modern healthcare.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm
              bg-white text-slate-900 hover:bg-slate-100 hover:scale-105
              shadow-xl shadow-white/10 transition-all duration-200"
          >
            Enter Dashboard <ArrowRight size={15} />
          </button>
          <button
            onClick={() => router.push("/register/hospital")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm
              bg-gradient-to-r from-cyan-500 to-blue-600 text-white
              hover:from-cyan-400 hover:to-blue-500 hover:scale-105
              shadow-xl shadow-cyan-500/25 transition-all duration-200"
          >
            Register Hospital
          </button>
          <button
            onClick={() => router.push("/register/patient")}
            className="px-7 py-3.5 rounded-2xl font-semibold text-sm text-slate-300
              border border-white/[0.15] hover:bg-white/[0.07] hover:text-white
              hover:border-white/30 backdrop-blur-sm transition-all duration-200"
          >
            Patient Signup
          </button>
        </div>

        {/* trust line */}
        <p className="mt-8 text-xs text-slate-600 font-medium">
          Trusted by <span className="text-slate-400">500+ hospitals</span> ·&nbsp;
          <span className="text-slate-400">10,000+ doctors</span> ·&nbsp;
          <span className="text-slate-400">1M+ patients</span>
        </p>
      </div>

      {/* ── slide dots ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}: ${slide.label}`}
            className={`rounded-full transition-all duration-400
              ${i === index
                ? "w-8 h-1.5 bg-cyan-400"
                : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"}`}
          />
        ))}
      </div>

      {/* ── scroll indicator ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={20} className="text-white/20" />
      </div>
    </section>
  );
}