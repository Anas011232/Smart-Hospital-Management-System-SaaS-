"use client";

import { useEffect, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";

export default function AdminHeader({ activeTab, onRefresh, isRefreshing, collapsed }) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabTitles = {
    overview: "Platform Overview",
    hospitals: "Hospitals & Subscriptions",
    doctors: "Doctors Directory",
    patients: "Patients Database",
    subscriptions: "Monetization & Financials",
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300 flex items-center justify-between px-6 ${
        collapsed ? "left-20" : "left-64"
      }`}
    >
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {tabTitles[activeTab] || "Admin Dashboard"}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Live Clock Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
          <Clock size={14} className="text-cyan-400 animate-pulse" />
          <span>{timeString || "00:00:00 AM"}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all duration-200 disabled:opacity-50"
          title="Refresh statistics"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin text-cyan-400" : ""} />
        </button>

        {/* Super Admin Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
            SA
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-white leading-none">Super Admin</p>
            <p className="text-[10px] text-slate-400 mt-1">Platform Control</p>
          </div>
        </div>
      </div>
    </header>
  );
}
