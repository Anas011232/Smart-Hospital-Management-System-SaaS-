// import DoctorSidebar from "../../components/doctor/DoctorSidebar.jsx";

// export default function DoctorDashboardLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-slate-950">
//       <DoctorSidebar />

//       <main className="flex-1 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   );
// }

'use client';
import { useState } from "react";
import { Menu } from "lucide-react";
import DoctorSidebar from "../../components/doctor/DoctorSidebar.jsx";

export default function DoctorDashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DoctorSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 animate-in slide-in-from-left duration-200">
            <DoctorSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-slate-950/80 backdrop-blur-xl border-b border-slate-700/50">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/60 border border-slate-700/50 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-white font-bold text-sm tracking-tight">HospitalPortal</span>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}