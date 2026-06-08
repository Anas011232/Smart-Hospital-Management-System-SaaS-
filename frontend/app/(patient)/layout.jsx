'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FaHome, 
  FaHospital, 
  FaCalendar, 
  FaFileMedical, 
  FaUser, 
  FaSignOutAlt, 
  FaClock, 
  FaClipboardList 
} from "react-icons/fa";

export default function PatientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Active state logic
  const isActive = (path) => {
    if (path === "/hospitals") return pathname.includes("/hospitals") || pathname.includes("/doctors");
    if (path === "/patient-dashboard/live-queue-patient") return pathname.includes("live-queue-patient");
    if (path === "/patient-dashboard/my-prescriptions") return pathname.includes("my-prescriptions");
    return pathname === path;
  };

  const navItems = [
    { href: "/patient-dashboard", label: "Dashboard", icon: FaHome },
    { href: "/hospitals", label: "Hospitals", icon: FaHospital },
    
    { href: "/patient/medical-history", label: "Medical History", icon: FaFileMedical },
    // FaUserClock এবং FaNotesMedical এর পরিবর্তে FaClock ও FaClipboardList ব্যবহার করা হয়েছে
    { href: "/patient-dashboard/live-queue-patient", label: "Live Queue", icon: FaClock },
    { href: "/patient-dashboard/my-prescriptions", label: "My Prescriptions", icon: FaClipboardList },
    { href: "/profile", label: "Profile", icon: FaUser },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-72 bg-white shadow-xl p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600">🏥 MedQueue+</h1>
          <p className="text-xs text-gray-500 mt-1">Patient Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${active 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 mt-6 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}