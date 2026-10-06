"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Stethoscope,
  UserPlus,
  UserCheck,
  ArrowLeft,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

export default function HospitalNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("hospitalId");
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/hospital/dashboard", icon: LayoutDashboard },
    { label: "Doctors List", href: "/hospital/doctors", icon: Stethoscope },
    { label: "Add Doctor", href: "/hospital/doctors/add", icon: UserPlus },
    { label: "Hospital Profile", href: "/hospital/profile", icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo + Back Button */}
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 text-xs font-semibold transition-all duration-200"
            title="Go Back"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Brand MedQueue+ */}
          <Link
            href="/hospital/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight leading-none group-hover:text-cyan-300 transition-colors">
                MedQueue<span className="text-cyan-400">+</span>
              </span>
              <span className="block text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
                Hospital Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Center/Right Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon size={15} className={isActive ? "text-cyan-400" : "text-slate-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold transition-all duration-200"
            title="Logout of Hospital Portal"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
