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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock3, UserCircle, LogOut, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorSidebar({ onNavigate }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/doctor-dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Today's Sessions", path: "/doctor-dashboard/sessions", icon: <Clock3 size={20} /> },
    { name: "Live Queue", path: "/doctor-dashboard/live-queue", icon: <Users size={20} /> },
    { name: "Profile", path: "/doctor-dashboard/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-700/50 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700/50 flex items-center justify-center">
            <Stethoscope size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">HospitalPortal</h2>
            <p className="text-xs text-slate-400 font-medium">Doctor Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link key={item.name} href={item.path} onClick={onNavigate} className="block group relative">
              {isActive && (
                <motion.div
                  layoutId="activeNavBg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/15 to-violet-500/15 border border-blue-500/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <span className={isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300 transition-colors"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 w-full font-medium text-sm group"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}