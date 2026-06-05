'use client';

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      isActive(path)
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-8 text-blue-600">
          🏥 MedQueue+
        </h1>

        <nav className="space-y-3 text-gray-700">

          <Link href="/patient/dashboard" className={linkClass("/patient/dashboard")}>
            <FaHome /> Dashboard
          </Link>

          <Link href="/patient/profile" className={linkClass("/patient/profile")}>
            <FaUser /> My Profile
          </Link>

          <Link href="/patient/hospitals" className={linkClass("/patient/hospitals")}>
            <FaHospital /> Hospitals
          </Link>

          <Link href="/patient/appointments" className={linkClass("/patient/appointments")}>
            <FaCalendarAlt /> Appointments
          </Link>

          <Link href="/patient/medical-records" className={linkClass("/patient/medical-records")}>
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