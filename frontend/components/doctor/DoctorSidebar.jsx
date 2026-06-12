// 'use client';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { LayoutDashboard, Users, Clock3, FileText, UserCircle, LogOut } from 'lucide-react';

// export default function DoctorSidebar() {
//   const pathname = usePathname();

//   const menuItems = [
//     { name: "Dashboard", path: "/doctor-dashboard", icon: <LayoutDashboard size={22} /> },
//     { name: "Today's Sessions", path: "/doctor-dashboard/sessions", icon: <Clock3 size={22} /> },
//     { name: "Live Queue", path: "/doctor-dashboard/live-queue", icon: <Users size={22} /> },
//     { name: "Profile", path: "/doctor-dashboard/profile", icon: <UserCircle size={22} /> },
//   ];

//   return (
//     <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
//       {/* Logo Section */}
//       <div className="p-8">
//         <h2 className="text-2xl font-extrabold text-indigo-700 tracking-tight">HospitalPortal</h2>
//         <p className="text-sm text-gray-500 font-medium mt-1">Doctor Management Panel</p>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 px-4 space-y-1">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
//           return (
//             <Link 
//               key={item.name} 
//               href={item.path}
//               className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
//                 isActive 
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
//                   : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
//               }`}
//             >
//               <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600"}>
//                 {item.icon}
//               </span>
//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout Button */}
//       <div className="p-6 border-t border-gray-100">
//         <button 
//           onClick={() => {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//           }}
//           className="flex items-center gap-4 px-5 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 w-full font-medium"
//         >
//           <LogOut size={22} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock3, UserCircle, LogOut, Stethoscope, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const easing = [0.4, 0, 0.2, 1];

const menuItems = [
  { name: "Dashboard", path: "/doctor-dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Today's Sessions", path: "/doctor-dashboard/sessions", icon: <Clock3 size={20} /> },
  { name: "Live Queue", path: "/doctor-dashboard/live-queue", icon: <Users size={20} /> },
  { name: "Profile", path: "/doctor-dashboard/profile", icon: <UserCircle size={20} /> },
];

function isPathActive(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

/**
 * Desktop nav item.
 * Active and inactive states are rendered as fully separate branches —
 * no shared whileHover/whileTap props, no hover classes on the active
 * branch, so the active item can never "inherit" a hover animation.
 */
function DesktopNavItem({ item, isActive, onNavigate }) {
  if (isActive) {
    return (
      <Link href={item.path} onClick={onNavigate} className="block relative mb-1.5">
        <motion.div
          layoutId="activeNavBg"
          layoutDependency={item.path}
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/15 to-violet-500/15 border border-blue-500/25 shadow-[0_0_20px_-6px_rgba(59,130,246,0.3)]"
        />
        <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-white">
          <span className="text-blue-300">{item.icon}</span>
          <span>{item.name}</span>
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
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

/**
 * Mobile drawer nav item — same active/inactive separation, no layoutId
 * needed since the drawer remounts on open/close.
 */
function MobileNavItem({ item, isActive, onNavigate }) {
  if (isActive) {
    return (
      <Link href={item.path} onClick={onNavigate} className="block relative mb-1.5">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/15 to-violet-500/15 border border-blue-500/25 shadow-[0_0_20px_-6px_rgba(59,130,246,0.3)]" />
        <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-white">
          <span className="text-blue-300">{item.icon}</span>
          <span>{item.name}</span>
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={item.path} onClick={onNavigate} className="block mb-1.5">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors duration-200">
        <span className="text-slate-500">{item.icon}</span>
        <span>{item.name}</span>
      </div>
    </Link>
  );
}

export default function DoctorSidebar({ onNavigate }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
    onNavigate?.();
  };

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="hidden lg:flex w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.08] min-h-screen flex-col relative">
        {/* ambient glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-24 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl" />

        {/* Logo Section */}
        <div className="relative p-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.08] flex items-center justify-center shadow-[0_0_20px_-4px_rgba(59,130,246,0.35)]">
              <Stethoscope size={20} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">HospitalPortal</h2>
              <p className="text-xs text-slate-400 font-medium">Doctor Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="relative flex-1 px-3 py-6">
          {menuItems.map((item) => (
            <DesktopNavItem
              key={item.name}
              item={item}
              isActive={isPathActive(pathname, item.path)}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        {/* Logout Button */}
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
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.08] flex items-center justify-center">
            <Stethoscope size={16} className="text-blue-300" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">HospitalPortal</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
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
              className="lg:hidden fixed top-0 left-0 z-50 w-72 max-w-[85%] h-full bg-slate-950/95 backdrop-blur-xl border-r border-white/[0.08] flex flex-col"
            >
              <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 -right-24 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative p-6 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.08] flex items-center justify-center shadow-[0_0_20px_-4px_rgba(59,130,246,0.35)]">
                    <Stethoscope size={20} className="text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">HospitalPortal</h2>
                    <p className="text-xs text-slate-400 font-medium">Doctor Panel</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
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
                    isActive={isPathActive(pathname, item.path)}
                    onNavigate={closeMobile}
                  />
                ))}
              </nav>

              <div className="relative p-4 border-t border-white/[0.08]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/5 rounded-xl transition-all duration-200 w-full font-medium text-sm group"
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
          const isActive = isPathActive(pathname, item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={onNavigate}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
            >
              {isActive && (
                <motion.div
                  layoutId="activeBottomNav"
                  layoutDependency={item.path}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                />
              )}
              <span className={isActive ? "text-blue-300" : "text-slate-500"}>
                {item.icon}
              </span>
              <span className={isActive ? "text-white" : "text-slate-500"}>
                {item.name === "Today's Sessions" ? "Sessions" : item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* spacer so page content isn't hidden behind bottom nav on mobile */}
      <div className="lg:hidden h-16" aria-hidden="true" />
    </>
  );
}