"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddDoctor() {
  const router = useRouter();

  const [form, setForm] = useState({
    hospitalId: "",
    fullName: "",
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

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // 🔥 append all fields
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value || "");
      });

      // 🔥 IMPORTANT: backend expects req.file
      if (image) {
        data.append("photo", image);
      }

      await axios.post(
        "http://localhost:5000/api/doctors",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      router.push("/hospital/doctors");
    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Add New Doctor
          </h1>
          <p className="text-slate-400 mt-2">
            Create professional doctor profile
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* ================= IMAGE UPLOAD ================= */}
          <div className="flex flex-col items-center mb-10">

            <div className="w-32 h-32 rounded-full border-2 border-cyan-500 overflow-hidden bg-white/5 flex items-center justify-center shadow-lg">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 text-sm">
                  Upload Photo
                </span>
              )}
            </div>

            <label className="mt-4 cursor-pointer text-cyan-400 hover:text-cyan-300 text-sm font-medium">
              Choose Doctor Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {/* ================= FORM ================= */}
          <form
            onSubmit={handleSubmit}
            className="grid lg:grid-cols-3 md:grid-cols-2 gap-5"
          >
            {Object.entries(form).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="mb-2 text-sm text-slate-300 capitalize">
                  {key}
                </label>

                <input
                  name={key}
                  value={value}
                  onChange={handleChange}
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
                    focus:border-cyan-400
                    focus:ring-2
                    focus:ring-cyan-500/30
                    transition
                  "
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}

            {/* BUTTON */}
            <div className="col-span-full mt-6">
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
                  transition
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