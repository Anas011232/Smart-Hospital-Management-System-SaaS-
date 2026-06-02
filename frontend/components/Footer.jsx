"use client";

import { Activity, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const columns = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Security", "Changelog", "Roadmap"],
  },
  {
    heading: "Company",
    links: ["About Us", "Careers", "Blog", "Press Kit", "Partners"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "HIPAA Compliance", "Support"],
  },
];

const contact = [
  { icon: Mail, text: "hello@medqube.io" },
  { icon: Phone, text: "+1 (800) 633-7823" },
  { icon: MapPin, text: "San Francisco, CA 94103" },
];

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="relative bg-slate-950 border-t border-white/[0.06] overflow-hidden">
      {/* subtle bg glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px]
        bg-cyan-900/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-8">

        {/* top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">

          {/* brand column */}
          <div className="col-span-2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 mb-5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600
                flex items-center justify-center shadow-lg shadow-cyan-500/25
                group-hover:scale-110 transition-transform duration-200">
                <Activity size={18} className="text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                <span className="text-white">Med</span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Qube
                </span>
              </span>
            </button>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              The next-generation SaaS platform for hospitals, doctors, and patients —
              built for modern healthcare operations.
            </p>
            <div className="space-y-2.5">
              {contact.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                  <Icon size={13} className="text-cyan-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200
                        flex items-center gap-1 group/link"
                    >
                      {link}
                      <ArrowUpRight size={11}
                        className="opacity-0 group-hover/link:opacity-100 transition-opacity -translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />

        {/* bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MedQube Technologies, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-600">All systems operational</span>
          </div>
          <div className="flex items-center gap-4">
            {["Twitter", "LinkedIn", "GitHub"].map((s) => (
              <a key={s} href="#" className="text-xs text-slate-600 hover:text-slate-300 transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}