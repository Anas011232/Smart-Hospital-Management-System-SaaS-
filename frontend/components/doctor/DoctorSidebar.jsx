'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock3, FileText, UserCircle, LogOut } from 'lucide-react';

export default function DoctorSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/doctor-dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Today's Sessions", path: "/doctor-dashboard/sessions", icon: <Clock3 size={20} /> },
    { name: "Live Queue", path: "/doctor-dashboard/live-queue", icon: <Users size={20} /> },
    { name: "My Prescriptions", path: "/doctor-dashboard/prescriptions", icon: <FileText size={20} /> },
    { name: "Profile", path: "/doctor-dashboard/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4 flex flex-col shadow-sm">
      {/* লোগো সেকশন */}
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold text-indigo-700">HospitalPortal</h2>
        <p className="text-xs text-gray-400">Doctor Panel</p>
      </div>

      {/* মেনু আইটেম */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* লগআউট বাটন */}
      <div className="mt-auto pt-4 border-t">
        <button 
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}