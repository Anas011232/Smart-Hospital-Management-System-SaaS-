'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaUser,
  FaHospital,
  FaCalendarAlt,
  FaFileMedical,
  FaSignOutAlt
} from "react-icons/fa";

export default function PatientLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl p-6">
        
        <h1 className="text-2xl font-bold mb-8 text-blue-600">
          🏥 MedQueue+
        </h1>

        <nav className="space-y-4 text-gray-700">

          <Link href="/patient/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <FaHome /> Dashboard
          </Link>

          <Link href="/patient/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <FaUser /> My Profile
          </Link>

          <Link href="/patient/hospitals" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <FaHospital /> Hospitals
          </Link>

          <Link href="/patient/appointments" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <FaCalendarAlt /> Appointments
          </Link>

          <Link href="/patient/medical-records" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <FaFileMedical /> Medical Records
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 w-full mt-6"
          >
            <FaSignOutAlt /> Logout
          </button>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}