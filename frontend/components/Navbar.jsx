"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Activity } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Stats", href: "#stats" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/20"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* brand */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600
              flex items-center justify-center shadow-lg shadow-cyan-500/25
              group-hover:scale-110 transition-transform duration-200">
              <Activity size={16} className="text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              <span className="text-white">Med</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Qube
              </span>
            </span>
          </button>

          {/* desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400
                  hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm font-medium text-slate-300 rounded-xl
                border border-white/[0.10] hover:bg-white/[0.07] hover:text-white
                hover:border-white/20 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register/hospital")}
              className="px-4 py-2 text-sm font-semibold rounded-xl
                bg-gradient-to-r from-cyan-500 to-blue-600 text-white
                hover:from-cyan-400 hover:to-blue-500 hover:scale-105
                shadow-lg shadow-cyan-500/20 transition-all duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push("/ai-doctor")}
              className="px-4 py-2 text-sm font-semibold rounded-xl
                bg-gradient-to-r from-violet-600 to-cyan-500 text-white
                hover:from-violet-500 hover:to-cyan-400 hover:scale-105
                shadow-lg shadow-violet-500/20 transition-all duration-200
                flex items-center gap-1.5"
            >
              <span>✦</span> AI Assistant
            </button>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center
              border border-white/[0.10] text-slate-300 hover:bg-white/[0.07]
              hover:text-white transition-all duration-200"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-5 pb-5 pt-2 space-y-1 bg-slate-950/95 backdrop-blur-xl
          border-b border-white/[0.06]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-400
                hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 text-sm font-medium text-slate-300 rounded-xl
                border border-white/[0.10] hover:bg-white/[0.07] transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register/hospital")}
              className="w-full py-3 text-sm font-semibold rounded-xl
                bg-gradient-to-r from-cyan-500 to-blue-600 text-white
                hover:from-cyan-400 hover:to-blue-500 transition-all duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push("/ai-doctor")}
              className="w-full py-3 text-sm font-semibold rounded-xl
                bg-gradient-to-r from-violet-600 to-cyan-500 text-white
                hover:from-violet-500 hover:to-cyan-400 transition-all duration-200"
            >
              ✦ AI Assistant
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}