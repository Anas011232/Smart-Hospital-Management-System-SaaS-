'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaHospital,
  FaUserMd,
  FaCalendar,
  FaFileMedical,
  FaSignOutAlt
} from "react-icons/fa";

export default function PatientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const active = (path) =>
    pathname === path
      ? "bg-blue-100 text-blue-600 font-semibold"
      : "hover:bg-gray-100";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl p-6">

        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          🏥 MedQueue+
        </h1>

        <nav className="space-y-2">

          <Link href="/patient-dashboard"
            className={`flex items-center gap-3 p-3 rounded-xl ${active("/patient/patient-dashboard")}`}>
            <FaHome /> Dashboard
          </Link>

          <Link href="/patient/hospitals"
            className={`flex items-center gap-3 p-3 rounded-xl ${active("/patient/hospitals")}`}>
            <FaHospital /> Hospitals
          </Link>

          <Link href="/patient/medical-history"
            className={`flex items-center gap-3 p-3 rounded-xl ${active("/patient/medical-history")}`}>
            <FaFileMedical /> History
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 w-full mt-6"
          >
            <FaSignOutAlt /> Logout
          </button>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">{children}</main>

    </div>
  );
}