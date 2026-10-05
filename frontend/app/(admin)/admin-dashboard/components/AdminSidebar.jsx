"use client";

import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, collapsed, setCollapsed }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "hospitals", label: "Hospitals", icon: Building2 },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "patients", label: "Patients", icon: Users },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-slate-950/90 backdrop-blur-2xl border-r border-slate-800/80 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
            <ShieldCheck size={22} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                MedQueue<span className="text-cyan-400">+</span>
              </h1>
              <p className="text-[10px] font-semibold text-blue-400 tracking-widest uppercase mt-1">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight size={16} className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 via-violet-600/15 to-transparent text-white border border-blue-500/30 shadow-md shadow-blue-500/5"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/80 hover:border-slate-800/60 border border-transparent"
              }`}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {isActive && (
                <span className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-gradient-to-b from-cyan-400 to-blue-600" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-all duration-200"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
