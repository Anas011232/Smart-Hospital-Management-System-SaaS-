"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800 sticky top-0 bg-gray-950/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-blue-500">MedQube</h1>
        <div className="flex gap-4">
          <button onClick={() => router.push("/login")} className="hover:text-blue-400 transition">Login</button>
          <button onClick={() => router.push("/pricing")} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Smart Hospital Management <br />
          <span className="text-blue-500">Made Simple</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
          MedQube provides a seamless queue management system, real-time doctor tracking, and automated digital prescriptions for modern hospitals.
        </p>
        <button onClick={() => router.push("/pricing")} className="px-8 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-500 transition">
          View Subscription Plans
        </button>
      </main>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: "Real-time Queue", desc: "Patients track live serials from anywhere." },
            { title: "Digital Prescription", desc: "Printable PDF records in one click." },
            { title: "Smart Dashboard", desc: "Easy doctor and staff management." }
          ].map((f, i) => (
            <div key={i} className="p-8 bg-gray-950 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold mb-3 text-blue-400">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section (The Core Subscription) */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Simple & Transparent Pricing</h2>
          <div className="p-8 bg-gray-900 rounded-3xl border-2 border-blue-600 shadow-2xl shadow-blue-900/20">
            <h3 className="text-2xl font-bold mb-2">Hospital Subscription</h3>
            <div className="text-5xl font-bold my-6">৳1,000 <span className="text-lg text-gray-400 font-normal">/month</span></div>
            <ul className="text-left text-gray-300 space-y-4 mb-8 max-w-sm mx-auto">
              <li>✅ Unlimited Doctor Profiles</li>
              <li>✅ Real-time Queue Tracking</li>
              <li>✅ Digital Prescription System</li>
              <li>✅ Patient Notification System</li>
              <li>✅ Priority Support</li>
            </ul>
            <button 
              onClick={() => router.push("/register/hospital")} 
              className="w-full py-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition font-bold"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-10 border-t border-gray-800">
        © 2026 MedQube. Empowering Healthcare Digitally.
      </footer>
    </div>
  );
}