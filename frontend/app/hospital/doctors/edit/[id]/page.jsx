"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";

export default function EditDoctor() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
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
    photo: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // =====================
  // LOAD DOCTOR
  // =====================
  const loadDoctor = async () => {
    try {
      const res = await api.get(`/doctors/${id}`);
      const doc = res.data.doctor || {};

      setForm({
        ...doc,
        availableDays: Array.isArray(doc.availableDays)
          ? doc.availableDays.join(", ")
          : doc.availableDays || "",
        languages: Array.isArray(doc.languages)
          ? doc.languages.join(", ")
          : doc.languages || "",
      });
    } catch (err) {
      console.warn("Load doctor error:", err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDoctor();
  }, [id]);

  // =====================
  // HANDLE INPUT
  // =====================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =====================
  // DAY TOGGLE HELPER
  // =====================
  const handleDayClick = (dayStr) => {
    let currentDays = form.availableDays
      ? form.availableDays.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (dayStr === "Everyday") {
      currentDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    } else {
      const existingIdx = currentDays.findIndex((d) => d.toLowerCase().startsWith(dayStr.toLowerCase()));
      if (existingIdx !== -1) {
        currentDays.splice(existingIdx, 1);
      } else {
        currentDays.push(dayStr);
      }
    }
    setForm({ ...form, availableDays: currentDays.join(", ") });
  };

  // =====================
  // IMAGE HANDLER
  // =====================
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =====================
  // UPDATE DOCTOR
  // =====================
  const updateDoctor = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "_id" || key === "photo") return;
        data.append(key, value || "");
      });

      if (image) {
        data.append("photo", image);
      }

      await api.put(`/doctors/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSaveSuccess(true);
      setTimeout(() => router.push("/hospital/doctors"), 1200);
    } catch (err) {
      console.warn("UPDATE ERROR:", err?.response?.data?.message || err.message);
      alert(err?.response?.data?.message || "Failed to update doctor profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-cyan-400 font-medium">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading Doctor Profile…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* ── ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      {/* ── topbar ── */}
      <div className="relative border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/hospital/doctors")}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors text-sm group"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Doctors
            </button>
            <span className="text-slate-700">/</span>
            <span className="text-slate-200 text-sm font-medium">Edit Doctor Profile</span>
          </div>
        </div>
      </div>

      {/* ── main container ── */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Header with Photo Upload */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-6 border-b border-slate-800/60 pb-8">
          <div className="relative flex-shrink-0">
            <input
              type="file"
              id="avatar-edit"
              accept="image/*"
              onChange={handleImage}
              className="sr-only"
            />
            <label
              htmlFor="avatar-edit"
              className="relative block w-24 h-24 rounded-2xl cursor-pointer group overflow-hidden border-2 border-slate-700/60 hover:border-cyan-500/50 transition-all duration-300 shadow-xl"
            >
              {preview ? (
                <img src={preview} alt="Doctor preview" className="w-full h-full object-cover" />
              ) : form.photo ? (
                <img src={`http://localhost:5000${form.photo}`} alt={form.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-3xl">👨‍⚕️</div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-cyan-300">
                Change Photo
              </div>
            </label>
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              {form.specialization || "Doctor"}
            </span>
            <h1 className="text-3xl font-bold text-white tracking-tight">{form.fullName || "Edit Doctor"}</h1>
            <p className="text-slate-400 mt-1 text-sm">Update appointment schedule, fees, and professional information.</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={updateDoctor} className="space-y-8">

          {/* Section 1: Schedule & Appointment Settings */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                🗓️
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Appointment Schedule & Fee Settings</h2>
                <p className="text-xs text-slate-400">Configure available consultation days, timings, and fees</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Consultation Fee */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Consultation Fee (BDT)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={form.consultationFee || ""}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Max Patients */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Max Patients Per Day
                </label>
                <input
                  type="number"
                  name="maxPatientsPerDay"
                  value={form.maxPatientsPerDay || ""}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Start Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Chamber Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                />
              </div>

              {/* End Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Chamber End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                />
              </div>

              {/* Available Days */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Available Days (Comma Separated)
                </label>
                <input
                  type="text"
                  name="availableDays"
                  value={form.availableDays || ""}
                  onChange={handleChange}
                  placeholder="Saturday, Sunday, Monday, Tuesday"
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />

                {/* Day Quick-Select Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-500 self-center mr-1">Quick Select:</span>
                  {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Everyday"].map((day) => {
                    const isSelected = form.availableDays?.toLowerCase().includes(day.toLowerCase());
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayClick(day)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                          isSelected
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20"
                            : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                👤
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Personal Information</h2>
                <p className="text-xs text-slate-400">Doctor's contact and personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Gender</label>
                <select
                  name="gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Professional Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                🩺
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Professional Information</h2>
                <p className="text-xs text-slate-400">Qualifications, specialization, and department</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={form.specialization || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Department</label>
                <input
                  type="text"
                  name="department"
                  value={form.department || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={form.qualification || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Experience (Years)</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={form.experienceYears || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Medical Reg. Number</label>
                <input
                  type="text"
                  name="medicalRegistrationNumber"
                  value={form.medicalRegistrationNumber || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Bio / Summary</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={form.bio || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/hospital/doctors")}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-400 border border-slate-700/60 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saveSuccess}
              className={`
                px-8 py-3.5 rounded-xl font-bold text-sm text-slate-900 transition-all duration-300 flex items-center gap-2
                ${saveSuccess
                  ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 hover:scale-[1.01]"
                }
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Updating Doctor…
                </>
              ) : saveSuccess ? (
                "✓ Saved! Redirecting…"
              ) : (
                "Update Doctor Profile"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}