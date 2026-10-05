"use client";

import { useState } from "react";
import { X, CreditCard, Sparkles, Check } from "lucide-react";

export default function EditSubscriptionModal({ hospital, onClose, onSave }) {
  const [plan, setPlan] = useState(hospital?.subscriptionPlan || "Pro");
  const [months, setMonths] = useState(hospital?.subscriptionMonths || 3);
  const [amount, setAmount] = useState(hospital?.subscriptionAmount || 3000);
  const [saving, setSaving] = useState(false);

  const handlePlanChange = (selectedPlan) => {
    setPlan(selectedPlan);
    if (selectedPlan === "Basic") setAmount(months * 1000);
    if (selectedPlan === "Pro") setAmount(months * 2500);
    if (selectedPlan === "Enterprise") setAmount(months * 5000);
  };

  const handleMonthsChange = (m) => {
    const num = Number(m);
    setMonths(num);
    if (plan === "Basic") setAmount(num * 1000);
    if (plan === "Pro") setAmount(num * 2500);
    if (plan === "Enterprise") setAmount(num * 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(hospital._id, {
      subscriptionPlan: plan,
      subscriptionMonths: Number(months),
      subscriptionAmount: Number(amount),
    });
    setSaving(false);
  };

  if (!hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 pb-8 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Edit Subscription Plan</h3>
              <p className="text-xs text-slate-400">{hospital.hospitalName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Plan Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Subscription Plan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Basic", "Pro", "Enterprise"].map((p) => {
                const isSelected = plan === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePlanChange(p)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <span>{p}</span>
                    <span className="text-[10px] opacity-80 font-normal">
                      {p === "Basic" ? "৳1,000/mo" : p === "Pro" ? "৳2,500/mo" : "৳5,000/mo"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Months Duration */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Duration Months
            </label>
            <select
              value={months}
              onChange={(e) => handleMonthsChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months (Quarterly)</option>
              <option value="6">6 Months (Half-Yearly)</option>
              <option value="12">12 Months (Annual)</option>
            </select>
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Subscription Amount (৳ BDT)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
