"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const slides = [
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
    "https://images.unsplash.com/photo-1580281657527-47f249e8f46f",
    "https://images.unsplash.com/photo-1584467735871-8e85353a8413",
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f",
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">

      {/* BACKGROUND SLIDER */}
      <div className="fixed inset-0 -z-10">
        {slides.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.25)",
              transform: "scale(1.08)",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 border-b border-white/10 backdrop-blur-xl bg-black/40">
        <h1 className="text-xl md:text-2xl font-bold text-cyan-400">
          MedQube
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register/hospital")}
            className="px-4 py-2 text-sm rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO (SMALL SLIDER HEIGHT) */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 h-[65vh]">

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
          Smart Hospital <br />
          <span className="text-cyan-400">Management System</span>
        </h1>

        <p className="text-gray-300 max-w-2xl mt-4 text-base md:text-lg">
          Next-generation SaaS platform for hospitals, doctors, and patients with real-time operations.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
          >
            Enter Dashboard
          </button>

          <button
            onClick={() => router.push("/register/hospital")}
            className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Register Hospital
          </button>

          <button
            onClick={() => router.push("/register/patient")}
            className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
          >
            Patient Signup
          </button>

        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-6 flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-cyan-400" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20 px-6 md:px-12 grid md:grid-cols-3 gap-8">

        {[
          {
            title: "Trusted by Hospitals",
            desc: "Used by growing healthcare networks worldwide",
          },
          {
            title: "Secure System",
            desc: "End-to-end encrypted patient data protection",
          },
          {
            title: "Real-Time Updates",
            desc: "Instant queue & doctor availability tracking",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h3 className="text-cyan-300 font-bold text-lg">
              {item.title}
            </h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* STATS */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          {[
            { count: "500+", label: "Hospitals" },
            { count: "10K+", label: "Doctors" },
            { count: "1M+", label: "Patients" },
            { count: "99.9%", label: "Uptime" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-extrabold">
                {s.count}
              </div>
              <div className="text-gray-400 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          How MedQube Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {[
            {
              step: "1",
              title: "Register Hospital",
              desc: "Create your hospital account in minutes",
            },
            {
              step: "2",
              title: "Add Doctors & Staff",
              desc: "Manage departments and schedules easily",
            },
            {
              step: "3",
              title: "Go Digital",
              desc: "Start managing patients in real-time",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-white/10 bg-black/40"
            >
              <div className="text-cyan-400 text-3xl font-bold">
                {s.step}
              </div>
              <h3 className="text-xl font-semibold mt-3">
                {s.title}
              </h3>
              <p className="text-gray-400 mt-2">{s.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            "Live Queue System",
            "Doctor Dashboard",
            "Digital Prescription",
            "Patient Records",
            "Emergency System",
            "Analytics Dashboard",
          ].map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:scale-105 transition"
            >
              <h3 className="text-cyan-300 font-bold text-lg">{t}</h3>
              <p className="text-gray-400 mt-2">
                Smart automation for healthcare workflow.
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold">
          Ready to Transform Healthcare?
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Join MedQube and bring your hospital into the digital era.
        </p>

        <button
          onClick={() => router.push("/register/hospital")}
          className="mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition"
        >
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-16">

        <div className="grid md:grid-cols-4 gap-10 text-gray-400">

          <div>
            <h3 className="text-white font-bold mb-3">MedQube</h3>
            <p>Smart hospital SaaS platform for modern healthcare systems.</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Product</h3>
            <p>Features</p>
            <p>Pricing</p>
            <p>Security</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Company</h3>
            <p>About</p>
            <p>Careers</p>
            <p>Contact</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Legal</h3>
            <p>Privacy Policy</p>
            <p>Terms</p>
            <p>Support</p>
          </div>

        </div>

        <div className="text-center text-gray-500 mt-10">
          © 2026 MedQube — All rights reserved
        </div>

      </footer>

    </div>
  );
}