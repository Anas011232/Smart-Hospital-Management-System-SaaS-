"use client";

import {
  CreditCard,
  Wallet,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";

export default function SubscriptionsTab({ stats, hospitals, onEditSubscription, onOpenRevenueCalculator }) {
  const totalRevenue = stats?.totalRevenue || 0;
  const activeSubscriptions = stats?.hospitals?.activeSubscriptions || 0;
  const expiringSoon = stats?.hospitals?.expiringSoon || 0;

  // Filter hospitals expiring in 30 days
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringHospitals = hospitals.filter((h) => {
    if (!h.expiresAt) return false;
    const d = new Date(h.expiresAt);
    return d > now && d <= thirtyDays;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Clickable Button */}
        <button
          onClick={onOpenRevenueCalculator}
          className="text-left rounded-2xl bg-gradient-to-br from-emerald-500/20 via-slate-900/60 to-slate-900/90 backdrop-blur-xl border border-emerald-500/40 hover:border-emerald-400 p-6 space-y-2 relative overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer group"
        >
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
            Calculator 📅
          </span>
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <Wallet size={22} />
          </div>
          <p className="text-3xl font-extrabold text-white">৳{Number(totalRevenue).toLocaleString()}</p>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            Click to calculate revenue by date range 📅
          </p>
        </button>

        <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900/60 to-slate-900/90 backdrop-blur-xl border border-cyan-500/30 p-6 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-cyan-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Subscriptions</span>
            <CheckCircle2 size={22} />
          </div>
          <p className="text-3xl font-extrabold text-white">{activeSubscriptions}</p>
          <p className="text-xs text-slate-400">Hospitals with active platform access</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900/60 to-slate-900/90 backdrop-blur-xl border border-amber-500/30 p-6 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Expiring Next 30 Days</span>
            <Clock size={22} />
          </div>
          <p className="text-3xl font-extrabold text-white">{expiringSoon}</p>
          <p className="text-xs text-slate-400">Hospital subscriptions due for renewal</p>
        </div>
      </div>

      {/* Plan Tiers Reference Card */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400" />
          Subscription Tier Pricing Models
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Basic Plan",
              price: "৳1,000 / month",
              features: "Up to 5 Doctors · Standard Queue · Essential Prescriptions",
              badge: "Startup Tier",
              color: "border-blue-500/30 bg-blue-500/5 text-blue-400",
            },
            {
              name: "Pro Plan",
              price: "৳2,500 / month",
              features: "Up to 20 Doctors · Priority Queue · Full Analytics & EMR",
              badge: "Popular Tier",
              color: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400",
            },
            {
              name: "Enterprise Plan",
              price: "৳5,000 / month",
              features: "Unlimited Doctors & Beds · Dedicated SLA · Full Multi-Dept",
              badge: "Max Power Tier",
              color: "border-violet-500/30 bg-violet-500/5 text-violet-400",
            },
          ].map((tier, idx) => (
            <div key={idx} className={`rounded-xl border ${tier.color} p-5 space-y-3`}>
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white">{tier.name}</h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                  {tier.badge}
                </span>
              </div>
              <p className="text-xl font-black text-white">{tier.price}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{tier.features}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expiring Soon Tracker */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-400" />
          Expiring Hospital Subscriptions (Action Needed)
        </h3>

        {expiringHospitals.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
            No hospital subscriptions are expiring within the next 30 days. All active hospitals are up to date!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Hospital Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Current Plan</th>
                  <th className="py-3.5 px-4">Expiration Date</th>
                  <th className="py-3.5 px-4 text-right">Quick Renewal Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expiringHospitals.map((h) => (
                  <tr key={h._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{h.hospitalName}</td>
                    <td className="py-3.5 px-4 text-slate-400">{h.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold uppercase text-[10px]">
                        {h.subscriptionPlan || "Basic"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">
                      {new Date(h.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onEditSubscription(h)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[11px] shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                      >
                        Extend Plan Now
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
  );
}
