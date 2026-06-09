'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaHome, FaHospital, FaFileMedical, FaUser,
  FaSignOutAlt, FaClock, FaClipboardList, FaBars, FaTimes
} from "react-icons/fa";

export default function PatientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const isActive = (path) => {
    if (path === "/patient-dashboard") return pathname === path;
    return pathname.includes(path);
  };

  const navItems = [
    { href: "/patient-dashboard", label: "Dashboard", icon: FaHome },
    { href: "/hospitals", label: "Hospitals", icon: FaHospital },
    { href: "/my-appointments", label: "Appointments", icon: FaFileMedical },
    { href: "/patient-dashboard/live-queue-patient", label: "Live Queue", icon: FaClock },
    { href: "/patient-dashboard/my-prescriptions", label: "Prescriptions", icon: FaClipboardList },
    { href: "/profile", label: "Profile", icon: FaUser },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-black text-sm">M+</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight leading-none">MedQueue+</h1>
            <p className="text-slate-500 text-[10px] font-medium mt-0.5 tracking-wider uppercase">Patient Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user card + logout */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold flex-shrink-0">
            P
          </div>
          <div className="min-w-0">
            <p className="text-slate-200 text-xs font-semibold truncate">My Account</p>
            <p className="text-slate-500 text-[10px] truncate">Patient</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-all duration-200"
        >
          <FaSignOutAlt className="w-4 h-4 flex-shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed h-full bg-slate-900/95 border-r border-slate-700/60 backdrop-blur-xl z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700/60 z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <FaTimes className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/60 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <FaBars className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">M+</span>
            </div>
            <span className="text-white font-bold text-sm">MedQueue+</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}