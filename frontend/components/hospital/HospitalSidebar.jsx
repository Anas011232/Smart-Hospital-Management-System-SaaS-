'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserPlus, Users, UserCircle, LogOut, Building2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const easing = [0.4, 0, 0.2, 1];

const menuItems = [
  { name: "Dashboard", path: "/hospital/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Add Doctor", path: "/hospital/doctors/add", icon: <UserPlus size={20} /> },
  { name: "View Doctors", path: "/hospital/doctors", icon: <Users size={20} /> },
  { name: "Profile", path: "/hospital/profile", icon: <UserCircle size={20} /> },
];

// শুধুমাত্র pathname-এর সাথে সবচেয়ে বেশি (longest) match হওয়া path-টাকেই active ধরে
// এতে "/hospital/doctors/add" এ থাকলে "/hospital/doctors" আর active হবে না
function getActivePath(pathname, items) {
  let bestMatch = null;

  for (const item of items) {
    const isMatch =
      pathname === item.path || pathname.startsWith(`${item.path}/`);

    if (isMatch) {
      if (!bestMatch || item.path.length > bestMatch.length) {
        bestMatch = item.path;
      }
    }
  }

  return bestMatch;
}

function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

function DesktopNavItem({ item, isActive, onNavigate }) {
  if (isActive) {
    return (
      <Link href={item.path} onClick={onNavigate} className="block relative mb-1.5">
        <motion.div
          layoutId="activeNavBg"
          layoutDependency={item.path}
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/15 to-cyan-500/15 border border-green-500/25 shadow-[0_0_20px_-6px_rgba(16,185,129,0.3)]"
        />
        <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-white">
          <span className="text-green-300">{item.icon}</span>
          <span>{item.name}</span>
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={item.path} onClick={onNavigate} className="block mb-1.5">
      <motion.div
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: easing }}
        className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors duration-200"
      >
        <span className="text-slate-500 group-hover:text-slate-300 transition-colors duration-200">
          {item.icon}
        </span>
        <span>{item.name}</span>
      </motion.div>
    </Link>
  );
}

function MobileNavItem({ item, isActive, onNavigate }) {
  if (isActive) {
    return (
      <Link href={item.path} onClick={onNavigate} className="block relative mb-1.5">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/15 to-cyan-500/15 border border-green-500/25 shadow-[0_0_20px_-6px_rgba(16,185,129,0.3)]" />
        <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-white">
          <span className="text-green-300">{item.icon}</span>
          <span className="truncate">{item.name}</span>
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={item.path} onClick={onNavigate} className="block mb-1.5">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors duration-200">
        <span className="text-slate-500">{item.icon}</span>
        <span className="truncate">{item.name}</span>
      </div>
    </Link>
  );
}

export default function HospitalSidebar({ onNavigate }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // একবারই হিসাব করি — desktop, mobile drawer, bottom nav সবাই এই একই মান ব্যবহার করবে
  const activePath = getActivePath(pathname, menuItems);

  const closeMobile = () => {
    setMobileOpen(false);
    onNavigate?.();
  };

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="hidden lg:flex w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.08] min-h-screen flex-col relative">
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-green-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative p-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-white/[0.08] flex items-center justify-center shadow-[0_0_20px_-4px_rgba(16,185,129,0.35)]">
              <Building2 size={20} className="text-green-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">HospitalPortal</h2>
              <p className="text-xs text-slate-400 font-medium">Hospital Panel</p>
            </div>
          </div>
        </div>

        <nav className="relative flex-1 px-3 py-6">
          {menuItems.map((item) => (
            <DesktopNavItem
              key={item.name}
              item={item}
              isActive={item.path === activePath}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <div className="relative p-4 border-t border-white/[0.08]">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/5 hover:shadow-[0_0_24px_-8px_rgba(239,68,68,0.35)] rounded-xl transition-all duration-200 w-full font-medium text-sm group"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* ============ MOBILE TOP BAR ============ */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-white/[0.08] flex items-center justify-center">
            <Building2 size={16} className="text-green-300" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight truncate">HospitalPortal</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMobileOpen(true)}
          className="p-2 shrink-0 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors duration-200"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </motion.button>
      </div>

      {/* ============ MOBILE DRAWER ============ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easing }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: easing }}
              className="lg:hidden fixed top-0 left-0 z-50 w-[80%] max-w-[300px] h-full bg-slate-950/95 backdrop-blur-xl border-r border-white/[0.08] flex flex-col overflow-y-auto"
            >
              <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-green-500/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-white/[0.08] flex items-center justify-center shadow-[0_0_20px_-4px_rgba(16,185,129,0.35)]">
                    <Building2 size={20} className="text-green-300" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-white tracking-tight truncate">HospitalPortal</h2>
                    <p className="text-xs text-slate-400 font-medium">Hospital Panel</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <nav className="relative flex-1 px-3 py-6">
                {menuItems.map((item) => (
                  <MobileNavItem
                    key={item.name}
                    item={item}
                    isActive={item.path === activePath}
                    onNavigate={closeMobile}
                  />
                ))}
              </nav>

              <div className="relative p-4 border-t border-white/[0.08]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/5 active:bg-red-500/10 rounded-xl transition-all duration-200 w-full font-medium text-sm group"
                >
                  <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/[0.08] flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {menuItems.map((item) => {
          const isActive = item.path === activePath;
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={onNavigate}
              className="relative flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-medium"
            >
              {isActive && (
                <motion.div
                  layoutId="activeBottomNav"
                  layoutDependency={item.path}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
              )}
              <span className={isActive ? "text-green-300" : "text-slate-500"}>
                {item.icon}
              </span>
              <span className={`truncate max-w-full px-0.5 ${isActive ? "text-white" : "text-slate-500"}`}>
                {item.name === "Add Doctor" ? "Add" : item.name === "View Doctors" ? "Doctors" : item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="lg:hidden h-16" aria-hidden="true" />
    </>
  );
}