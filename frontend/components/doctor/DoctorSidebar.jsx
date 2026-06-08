'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock3, FileText, UserCircle, LogOut } from 'lucide-react';

export default function DoctorSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/doctor-dashboard", icon: <LayoutDashboard size={22} /> },
    { name: "Today's Sessions", path: "/doctor-dashboard/sessions", icon: <Clock3 size={22} /> },
    { name: "Live Queue", path: "/doctor-dashboard/live-queue", icon: <Users size={22} /> },
    { name: "Profile", path: "/doctor-dashboard/profile", icon: <UserCircle size={22} /> },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-8">
        <h2 className="text-2xl font-extrabold text-indigo-700 tracking-tight">HospitalPortal</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">Doctor Management Panel</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600"}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-100">
        <button 
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-4 px-5 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 w-full font-medium"
        >
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}