"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  HeartPulse,
  ShieldCheck,
  CalendarDays,
  VenusAndMars,
  Droplets,
  FileText,
  Users,
  Sparkles,
  Activity,
} from "lucide-react";

export default function PatientRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/patient/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      console.log(data);

      alert("Patient Registered Successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute top-[40%] left-[45%] w-[250px] h-[250px] bg-purple-300/30 rounded-full blur-3xl"></div>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 sm:py-14">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-cyan-200 shadow-lg">

            <Sparkles className="text-cyan-600" size={18} />

            <span className="text-xs sm:text-sm font-semibold tracking-[3px] uppercase text-cyan-700">
              Smart Healthcare System
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">

            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Patient Registration
            </span>
          </h1>

          <p className="text-gray-600 mt-4 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Modern responsive healthcare registration interface
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative rounded-[35px] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden"
        >

          {/* Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 p-5 sm:p-8 lg:p-12">

            {/* Left */}
            <div className="space-y-7">

              <Section
                title="Basic Information"
                icon={<User size={18} />}
              >

                <Input
                  icon={<User size={18} />}
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                />

                <Input
                  icon={<Mail size={18} />}
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                />

                <Input
                  icon={<Phone size={18} />}
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                />

                <Input
                  icon={<Lock size={18} />}
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </Section>

              <Section
                title="Profile Details"
                icon={<Activity size={18} />}
              >

                <Select
                  icon={<VenusAndMars size={18} />}
                  name="gender"
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>

                <Input
                  icon={<CalendarDays size={18} />}
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="address"
                  placeholder="Residential Address"
                  onChange={handleChange}
                />
              </Section>
            </div>

            {/* Right */}
            <div className="space-y-7">

              <Section
                title="Medical Information"
                icon={<HeartPulse size={18} />}
              >

                <Input
                  icon={<Droplets size={18} />}
                  name="bloodGroup"
                  placeholder="Blood Group"
                  onChange={handleChange}
                />

                <Input
                  icon={<ShieldCheck size={18} />}
                  name="allergies"
                  placeholder="Allergies"
                  onChange={handleChange}
                />

                <Textarea
                  icon={<FileText size={18} />}
                  name="medicalHistory"
                  placeholder="Medical History"
                  onChange={handleChange}
                />
              </Section>

              <Section
                title="Emergency Contact"
                icon={<Phone size={18} />}
              >

                <Input
                  icon={<User size={18} />}
                  name="emergencyName"
                  placeholder="Emergency Contact Name"
                  onChange={handleChange}
                />

                <Input
                  icon={<Phone size={18} />}
                  name="emergencyPhone"
                  placeholder="Emergency Phone"
                  onChange={handleChange}
                />

                <Input
                  icon={<Users size={18} />}
                  name="emergencyRelation"
                  placeholder="Relation"
                  onChange={handleChange}
                />
              </Section>
            </div>
          </div>

          {/* Button */}
          <div className="px-5 sm:px-8 lg:px-12 pb-10">

            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden w-full py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl text-white transition-all duration-500 hover:scale-[1.01] active:scale-[0.99]"
            >

              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]"></div>

              <span className="relative z-10">
                {loading ? "Registering..." : "Register Patient"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   Reusable Components
========================= */

const Section = ({ title, icon, children }) => {
  return (
    <div className="relative rounded-3xl border border-white/60 bg-white/50 backdrop-blur-2xl p-5 sm:p-6 shadow-lg">

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-100/20 to-blue-100/20"></div>

      <div className="relative z-10">

        <div className="flex items-center gap-3 mb-5">

          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
            {icon}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {title}
          </h2>
        </div>

        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const Input = ({ icon, ...props }) => {
  return (
    <div className="group flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

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

const Select = ({ icon, children, ...props }) => {
  return (
    <div className="flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

      <div className="px-4 text-cyan-600 flex items-center justify-center">
        {icon}
      </div>

      <select
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-gray-700"
      >
        {children}
      </select>
    </div>
  );
};

const Textarea = ({ icon, ...props }) => {
  return (
    <div className="flex items-start rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

      <div className="px-4 pt-5 text-cyan-600">
        {icon}
      </div>

      <textarea
        rows={5}
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none resize-none text-gray-800 placeholder:text-gray-400"
      />
    </div>
  );
};