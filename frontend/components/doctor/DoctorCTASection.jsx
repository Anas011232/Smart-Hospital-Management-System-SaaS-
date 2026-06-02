import Link from "next/link";
import { UserPlus, Users } from "lucide-react";

export default function DoctorCTASection() {
  return (
    <div className="mt-12 relative">

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-cyan-500/10 blur-2xl rounded-3xl" />

      <div className="relative border border-white/10 backdrop-blur-xl bg-white/5 rounded-3xl p-6 sm:p-10">

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Manage Doctors
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Add new doctors or view all registered doctors
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

          <Link
            href="/hospital/doctors/add"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-2xl 
            bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold 
            shadow-lg hover:scale-105 transition-all duration-300"
          >
            <UserPlus size={18} />
            + Add Doctor
          </Link>

          <Link
            href="/hospital/doctors"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-2xl 
            bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold 
            shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Users size={18} />
            View Doctors
          </Link>

        </div>
      </div>
    </div>
  );
}