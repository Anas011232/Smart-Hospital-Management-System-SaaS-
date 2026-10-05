"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Wallet, Calendar, Filter, TrendingUp, Building2, RefreshCw } from "lucide-react";
import api from "@/lib/axios";

export default function RevenueCalculatorModal({ onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [preset, setPreset] = useState("all");

  const fetchRevenue = useCallback(async (start = "", end = "") => {
    try {
      setLoading(true);
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const res = await api.get("/admin/revenue", { params });
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.warn("Fetch revenue calculation error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Preset Date Handlers
  const handlePresetChange = (selectedPreset) => {
    setPreset(selectedPreset);
    const now = new Date();

    if (selectedPreset === "all") {
      setStartDate("");
      setEndDate("");
      fetchRevenue("", "");
    } else if (selectedPreset === "today") {
      const todayStr = now.toISOString().split("T")[0];
      setStartDate(todayStr);
      setEndDate(todayStr);
      fetchRevenue(todayStr, todayStr);
    } else if (selectedPreset === "this_month") {
      const firstDayStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const todayStr = now.toISOString().split("T")[0];
      setStartDate(firstDayStr);
      setEndDate(todayStr);
      fetchRevenue(firstDayStr, todayStr);
    } else if (selectedPreset === "this_year") {
      const firstYearStr = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
      const todayStr = now.toISOString().split("T")[0];
      setStartDate(firstYearStr);
      setEndDate(todayStr);
      fetchRevenue(firstYearStr, todayStr);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setPreset("custom");
    fetchRevenue(startDate, endDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 pb-8 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20">
              <Wallet size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-xl tracking-tight">Revenue Calculator & Financials</h3>
              <p className="text-xs text-slate-400 mt-0.5">Select date range to calculate total revenue collected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Date Filter & Presets */}
        <div className="space-y-4 rounded-2xl bg-slate-950/80 border border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Calendar size={14} className="text-cyan-400" /> Select Timeframe Presets
            </span>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "this_month", label: "This Month" },
              { id: "this_year", label: "This Year" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetChange(p.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  preset === p.id
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-emerald-400 shadow-md"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs Form */}
          <form onSubmit={handleCustomSubmit} className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white font-bold text-xs shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Filter size={14} />}
              Calculate Revenue
            </button>
          </form>
        </div>

        {/* Calculated Revenue Display */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium">Calculating revenue for selected dates...</div>
        ) : data ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-950 border border-emerald-500/30 p-5 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Total Calculated Revenue</span>
                <p className="text-3xl font-black text-white">৳{Number(data.filteredRevenue || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">BDT</span></p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {data.startDate && data.endDate ? `${data.startDate} to ${data.endDate}` : "Lifetime total collection"}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 border border-cyan-500/30 p-5 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Hospital Subscriptions</span>
                <p className="text-3xl font-black text-white">{data.totalCount || 0} <span className="text-xs text-slate-400 font-normal">Hospitals</span></p>
                <p className="text-[11px] text-slate-400 mt-1">Total registrations & renewals in period</p>
              </div>
            </div>

            {/* Plan Breakdown */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-400" /> Revenue Breakdown by Subscription Plan
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Basic Plan</p>
                  <p className="text-base font-extrabold text-blue-400 mt-0.5">৳{Number(data.planBreakdown?.Basic || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Pro Plan</p>
                  <p className="text-base font-extrabold text-cyan-400 mt-0.5">৳{Number(data.planBreakdown?.Pro || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Enterprise Plan</p>
                  <p className="text-base font-extrabold text-violet-400 mt-0.5">৳{Number(data.planBreakdown?.Enterprise || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Free / Other</p>
                  <p className="text-base font-extrabold text-slate-400 mt-0.5">৳{Number(data.planBreakdown?.Other || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Hospital Transactions List */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Building2 size={14} className="text-emerald-400" /> Hospital Payments in Range ({data.hospitals?.length || 0})
              </h4>

              {data.hospitals?.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No payments recorded within this date range.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {data.hospitals.map((h) => (
                    <div key={h._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <p className="font-bold text-white">{h.hospitalName}</p>
                        <p className="text-[10px] text-slate-400">{h.ownerName || "—"} · {h.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-emerald-400">+৳{h.subscriptionAmount || 0}</p>
                        <p className="text-[10px] text-slate-500">{h.subscriptionPlan || "Basic"} · {new Date(h.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
