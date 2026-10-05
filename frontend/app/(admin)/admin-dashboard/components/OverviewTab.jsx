"use client";

import {
  Wallet,
  Building2,
  Stethoscope,
  Users,
  CalendarDays,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function OverviewTab({ stats, onNavigate, onVerifyHospital, onBlockHospital, onOpenRevenueCalculator }) {
  if (!stats) return null;

  const {
    totalRevenue = 0,
    hospitals = {},
    doctors = 0,
    patients = 0,
    appointments = 0,
    planDistribution = {},
    recentHospitals = [],
  } = stats;

  const kpis = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: `৳${Number(totalRevenue).toLocaleString()}`,
      subtitle: "Click to calculate by date 📅",
      icon: Wallet,
      color: "emerald",
      gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      borderColor: "border-emerald-500/40 hover:border-emerald-400",
      textColor: "text-emerald-400",
      isClickable: true,
    },
    {
      id: "hospitals",
      title: "Registered Hospitals",
      value: hospitals.total || 0,
      subtitle: `${hospitals.verified || 0} Verified · ${hospitals.unverified || 0} Pending`,
      icon: Building2,
      color: "cyan",
      gradient: "from-cyan-500/20 via-cyan-600/10 to-transparent",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-400",
    },
    {
      id: "doctors",
      title: "Registered Doctors",
      value: doctors,
      subtitle: "Medical staff registered",
      icon: Stethoscope,
      color: "blue",
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
    {
      id: "patients",
      title: "Registered Patients",
      value: patients,
      subtitle: "Platform end-users",
      icon: Users,
      color: "violet",
      gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
      borderColor: "border-violet-500/30",
      textColor: "text-violet-400",
    },
    {
      id: "appointments",
      title: "Total Appointments",
      value: appointments,
      subtitle: "Booked consultations",
      icon: CalendarDays,
      color: "amber",
      gradient: "from-amber-500/20 via-amber-600/10 to-transparent",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const Component = kpi.isClickable ? "button" : "div";

          return (
            <Component
              key={kpi.id}
              onClick={kpi.isClickable ? onOpenRevenueCalculator : undefined}
              className={`relative text-left overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border ${kpi.borderColor} p-5 transition-all duration-300 group ${
                kpi.isClickable ? "cursor-pointer hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-500/10 ring-1 ring-emerald-500/20" : "hover:scale-[1.02] hover:shadow-xl"
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${kpi.gradient} blur-2xl pointer-events-none`} />
              
              {kpi.isClickable && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  Calculator 📅
                </span>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center ${kpi.textColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tight">{kpi.value}</p>
              <p className={`text-[11px] font-medium mt-1 ${kpi.isClickable ? "text-emerald-400 font-semibold flex items-center gap-1" : "text-slate-400"}`}>
                {kpi.subtitle}
              </p>
            </Component>
          );
        })}
      </div>

      {/* Subscription Breakdown & Recent Hospitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Distribution */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" />
              Subscription Plans Breakdown
            </h3>
            <button
              onClick={() => onNavigate("subscriptions")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: "Basic Plan", count: planDistribution.Basic || 0, color: "bg-blue-500", text: "text-blue-400" },
              { name: "Pro Plan", count: planDistribution.Pro || 0, color: "bg-cyan-500", text: "text-cyan-400" },
              { name: "Enterprise Plan", count: planDistribution.Enterprise || 0, color: "bg-violet-500", text: "text-violet-400" },
              { name: "Free / Custom", count: (planDistribution.Free || 0) + (planDistribution.Other || 0), color: "bg-slate-600", text: "text-slate-400" },
            ].map((plan, i) => {
              const percentage = hospitals.total ? Math.round((plan.count / hospitals.total) * 100) : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{plan.name}</span>
                    <span className={plan.text}>
                      {plan.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${plan.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Active Subscriptions: <strong className="text-emerald-400">{hospitals.activeSubscriptions || 0}</strong></span>
            <span>Expiring Soon: <strong className="text-amber-400">{hospitals.expiringSoon || 0}</strong></span>
          </div>
        </div>

        {/* Recent Hospitals Table */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 size={18} className="text-blue-400" />
              Recent Hospital Registrations
            </h3>
            <button
              onClick={() => onNavigate("hospitals")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Manage Hospitals <ArrowUpRight size={14} />
            </button>
          </div>

          {recentHospitals.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No hospital registrations recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Hospital Name</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentHospitals.map((h) => (
                    <tr key={h._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {h.hospitalName}
                        <span className="block text-[10px] text-slate-500 font-normal">{h.email}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{h.city || "—"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                          {h.subscriptionPlan || "Basic"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {h.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 size={13} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                            <ShieldAlert size={13} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onVerifyHospital(h._id, !h.isVerified)}
                          className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                            h.isVerified
                              ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                              : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                          }`}
                        >
                          {h.isVerified ? "Unverify" : "Verify"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
