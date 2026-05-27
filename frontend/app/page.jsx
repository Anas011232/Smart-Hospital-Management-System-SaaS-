"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800 backdrop-blur-md sticky top-0 bg-gray-950/70">
        <h1 className="text-2xl font-bold text-blue-500">MedQube</h1>

        <div className="flex gap-4">
          <button onClick={() => router.push("/login")}
            className="hover:text-blue-400 transition">
            Login
          </button>

          <button
            onClick={() => setShowRegister(!showRegister)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main className="text-center px-6 py-24">
        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          Smart Hospital Management <br />
          <span className="text-blue-500">System for Modern Healthcare</span>
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg">
          Manage patients, doctors, queues, and appointments in real-time.
          Built for hospitals that want to go fully digital.
        </p>

        <div className="flex justify-center gap-4 mt-10 flex-wrap">

          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition"
          >
            Login to Dashboard
          </button>

          <button
            onClick={() => router.push("/register/hospital")}
            className="px-8 py-4 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 transition"
          >
            Register Hospital
          </button>

          <button
            onClick={() => router.push("/register/patient")}
            className="px-8 py-4 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 transition"
          >
            Patient Signup
          </button>

        </div>
      </main>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {[
            {
              title: "Live Queue System",
              desc: "Patients can track live serial updates in real-time."
            },
            {
              title: "Doctor Management",
              desc: "Hospitals can add, remove, and manage doctors easily."
            },
            {
              title: "Digital Prescription",
              desc: "Automated prescriptions and patient history tracking."
            }
          ].map((f, i) => (
            <div key={i}
              className="p-8 bg-gray-950 border border-gray-800 rounded-2xl hover:scale-105 transition">
              <h3 className="text-xl font-bold text-blue-400 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* REGISTER SECTION (PATIENT QUICK REGISTER) */}
      {showRegister && (
        <section className="py-20 px-6 bg-black/40 backdrop-blur-lg">
          <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-2xl border border-gray-800">

            <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
              Quick Patient Register
            </h2>

            <input className="w-full mb-3 p-3 bg-gray-800 rounded"
              placeholder="Name" />

            <input className="w-full mb-3 p-3 bg-gray-800 rounded"
              placeholder="Email" />

            <input className="w-full mb-3 p-3 bg-gray-800 rounded"
              placeholder="Phone" />

            <input className="w-full mb-3 p-3 bg-gray-800 rounded"
              type="password"
              placeholder="Password" />

            <button
              className="w-full py-3 bg-blue-600 rounded-xl hover:bg-blue-500"
              onClick={() => router.push("/register/patient")}
            >
              Continue Full Registration
            </button>

          </div>
        </section>
      )}

      {/* PRICING */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-12">
            Subscription Plans
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="p-8 bg-gray-900 rounded-2xl border border-blue-600">
              <h3 className="text-xl font-bold">Hospital Plan</h3>
              <p className="text-4xl font-bold my-4">৳1000 /month</p>
              <p className="text-gray-400 mb-6">
                Full hospital management system access
              </p>

              <button
                onClick={() => router.push("/register/hospital")}
                className="w-full py-3 bg-blue-600 rounded-xl hover:bg-blue-500"
              >
                Start Hospital
              </button>
            </div>

            <div className="p-8 bg-gray-900 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold">Patient Access</h3>
              <p className="text-4xl font-bold my-4">Free</p>
              <p className="text-gray-400 mb-6">
                Book appointments & track doctors
              </p>

              <button
                onClick={() => router.push("/register/patient")}
                className="w-full py-3 bg-gray-700 rounded-xl hover:bg-gray-600"
              >
                Join as Patient
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 py-10 border-t border-gray-800">
        © 2026 MedQube — Smart Healthcare System
      </footer>

    </div>
  );
}