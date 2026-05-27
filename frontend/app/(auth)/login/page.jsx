"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  ShieldCheck,
  Sparkles,
  Activity,
} from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.user?.role === "hospital") {
        window.location.href = "/hospital/dashboard";
      }

      if (data.user?.role === "patient") {
        window.location.href = "/patient-dashboard";
      }

      if (data.user?.role === "doctor") {
        window.location.href = "/doctor-dashboard";
      }

      if (data.user?.role === "admin") {
        window.location.href = "/admin-dashboard";
      }

    } catch (err) {
      console.log(err);
      alert("Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 flex items-center justify-center px-4 py-10">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute top-[40%] left-[45%] w-[220px] h-[220px] bg-purple-300/30 rounded-full blur-3xl"></div>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">

        <div className="relative overflow-hidden rounded-[35px] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">

          {/* Top Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

          <div className="p-7 sm:p-10">

            {/* Header */}
            <div className="text-center mb-10">

              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-cyan-200 shadow-lg">

                <Sparkles className="text-cyan-600" size={18} />

                <span className="text-xs font-semibold tracking-[3px] uppercase text-cyan-700">
                  Secure Access
                </span>
              </div>

              <div className="mt-7 flex justify-center">

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">

                  <ShieldCheck className="text-white" size={38} />
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-black">

                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h1>

              <p className="mt-3 text-gray-600 text-sm">
                Login to continue your healthcare journey
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-5">

              <Input
                icon={<Mail size={18} />}
                type="email"
                placeholder="Email Address"
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <Input
                icon={<Lock size={18} />}
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="relative overflow-hidden group w-full mt-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
            >

              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]"></div>

              <span className="relative z-10 flex items-center justify-center gap-2">

                <Activity size={18} />

                {loading ? "Logging in..." : "Login"}
              </span>
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Secure Healthcare Authentication System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Components
========================= */

const Input = ({ icon, ...props }) => {
  return (
    <div className="flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

      <div className="px-4 text-cyan-600 flex items-center justify-center">
        {icon}
      </div>

      <input
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-gray-800 placeholder:text-gray-400"
      />
    </div>
  );
};