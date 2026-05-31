"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddDoctor() {
  const router = useRouter();

  const [form, setForm] = useState({
    hospitalId: "",
    fullName: "",
    photo: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    address: "",
    nidNumber: "",
    specialization: "",
    designation: "",
    department: "",
    qualification: "",
    experienceYears: "",
    medicalRegistrationNumber: "",
    licenseNumber: "",
    consultationFee: "",
    availableDays: "",
    startTime: "",
    endTime: "",
    maxPatientsPerDay: "",
    bio: "",
    languages: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/doctors", {
      ...form,
      availableDays: form.availableDays.split(","),
      languages: form.languages.split(","),
    });

    router.push("/hospital/doctors");
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
    <div className="max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Add New Doctor
        </h1>
        <p className="text-slate-400 mt-2">
          Create and manage doctor profiles
        </p>
      </div>

      <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8">

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-3 md:grid-cols-2 gap-5"
        >
          {Object.keys(form).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="mb-2 text-sm text-slate-300 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>

              <input
                type={
                  key.toLowerCase().includes("email")
                    ? "email"
                    : key.toLowerCase().includes("password")
                    ? "password"
                    : key.toLowerCase().includes("date")
                    ? "date"
                    : key.toLowerCase().includes("fee") ||
                      key.toLowerCase().includes("year") ||
                      key.toLowerCase().includes("patient")
                    ? "number"
                    : "text"
                }
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="
                w-full
                bg-white/5
                border
                border-slate-700
                text-white
                px-4
                py-3
                rounded-xl
                outline-none
                transition-all
                duration-300
                focus:border-cyan-400
                focus:ring-2
                focus:ring-cyan-500/30
                hover:border-slate-500
              "
              />
            </div>
          ))}

          <div className="col-span-full mt-5">
            <button
              type="submit"
              className="
                w-full
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-semibold
                py-4
                rounded-2xl
                shadow-lg
                hover:scale-[1.02]
                hover:shadow-cyan-500/25
                transition-all
                duration-300
              "
            >
              Save Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}