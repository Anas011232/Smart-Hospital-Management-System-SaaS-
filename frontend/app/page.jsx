"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">
          MedQube
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-32">

        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Smart Hospital Management <br />
          <span className="text-blue-500">Made Simple</span>
        </h2>

        <p className="text-gray-400 max-w-2xl mb-10">
          MedQube is a modern healthcare platform for managing doctors,
          patients, appointments, queues, and medical records in real-time.
        </p>

        <div className="flex gap-5">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
          >
            Create Account
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-10 border-t border-gray-800">
        © 2026 MedQube. All rights reserved.
      </footer>

    </div>
  );
}