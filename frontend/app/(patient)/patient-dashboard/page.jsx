"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiCheckCircle, FiActivity, FiTrendingUp, FiAlertCircle } from "react-icons/fi";

export default function PatientDashboard() {
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   setData({
  //     totalAppointments: 5,
  //     upcoming: 2,
  //     completed: 3,
  //   });
  // }, []);

  const stats = [
    {
      label: "Total Appointments",
      value: data?.totalAppointments ?? "—",
      icon: FiCalendar,
      color: "blue",
      gradient: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      valueColor: "text-blue-300",
    },
    {
      label: "Upcoming",
      value: data?.upcoming ?? "—",
      icon: FiClock,
      color: "violet",
      gradient: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/20",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-400",
      valueColor: "text-violet-300",
    },
    {
      label: "Completed",
      value: data?.completed ?? "—",
      icon: FiCheckCircle,
      color: "emerald",
      gradient: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-300",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Overview</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Patient Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Welcome back. Here's your health activity summary.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-semibold">Active Patient</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-slate-900/60 backdrop-blur-sm p-6 group hover:border-opacity-40 transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60`} />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.valueColor} tabular-nums`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`${stat.iconColor} w-5 h-5`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Activity Feed Placeholder */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <FiActivity className="text-blue-400 w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Appointment booked", time: "2h ago", color: "bg-blue-400" },
              { label: "Prescription issued", time: "Yesterday", color: "bg-violet-400" },
              { label: "Consultation completed", time: "3 days ago", color: "bg-emerald-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                <span className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
                <span className="text-sm text-slate-300 flex-1">{item.label}</span>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <FiTrendingUp className="text-violet-400 w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Book Appointment", href: "/hospitals", color: "bg-blue-600 hover:bg-blue-500" },
              { label: "View Queue", href: "/patient-dashboard/live-queue-patient", color: "bg-violet-600 hover:bg-violet-500" },
              { label: "My Prescriptions", href: "/patient-dashboard/my-prescriptions", color: "bg-slate-700 hover:bg-slate-600" },
              { label: "Appointment History", href: "/my-appointments", color: "bg-slate-700 hover:bg-slate-600" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`${action.color} rounded-xl px-4 py-3 text-xs font-semibold text-white text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}