"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddDoctor() {
  const router = useRouter();

  const [form, setForm] = useState({
    hospitalId: "",
    fullName: "",
    photo: "", // keep for backend compatibility
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

  // 📸 IMAGE HANDLER
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // append all form fields (same logic preserved)
      Object.keys(form).forEach((key) => {
        if (key === "availableDays" || key === "languages") {
          data.append(
            key,
            JSON.stringify(form[key].split(","))
          );
        } else {
          data.append(key, form[key]);
        }
      });

      // append image
      if (image) {
        data.append("photo", image);
      }

      await axios.post("http://localhost:5000/api/doctors", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/hospital/doctors");
    } catch (err) {
      console.error(err);
    }
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

          {/* 🖼️ IMAGE UPLOAD UI */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full border border-slate-600 overflow-hidden flex items-center justify-center bg-white/5">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
              ) : (
                <span className="text-slate-400 text-sm">Photo</span>
              )}
            </div>

            <label className="mt-3 text-cyan-400 cursor-pointer text-sm">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {/* FORM */}
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