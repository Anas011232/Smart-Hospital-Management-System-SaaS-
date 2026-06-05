"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// ─── Section config for grouping fields ───────────────────────────────────────
const SECTIONS = [
  {
    id: "personal",
    label: "Personal Info",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    fields: [
      { name: "fullName", label: "Full Name", type: "text", placeholder: "Dr. Jane Smith", span: 2 },
      { name: "email", label: "Email Address", type: "email", placeholder: "doctor@hospital.com" },
      { name: "password", label: "Password", type: "password", placeholder: "••••••••••" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+880 1XXX XXXXXX" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
      { name: "dateOfBirth", label: "Date of Birth", type: "date" },
      { name: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
      { name: "nidNumber", label: "NID Number", type: "text", placeholder: "National ID" },
      { name: "address", label: "Address", type: "text", placeholder: "Full address", span: 2 },
    ],
  },
  {
    id: "professional",
    label: "Professional Details",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    fields: [
      { name: "specialization", label: "Specialization", type: "text", placeholder: "e.g. Cardiology" },
      { name: "designation", label: "Designation", type: "text", placeholder: "e.g. Senior Consultant" },
      { name: "department", label: "Department", type: "text", placeholder: "e.g. Cardiology Dept." },
      { name: "qualification", label: "Qualification", type: "text", placeholder: "e.g. MBBS, MD" },
      { name: "experienceYears", label: "Years of Experience", type: "number", placeholder: "0" },
      { name: "medicalRegistrationNumber", label: "Medical Reg. Number", type: "text", placeholder: "MRN-XXXXX" },
      { name: "licenseNumber", label: "License Number", type: "text", placeholder: "LIC-XXXXX" },
      { name: "languages", label: "Languages Spoken", type: "text", placeholder: "English, Bangla" },
      { name: "bio", label: "Bio", type: "textarea", placeholder: "Brief professional biography...", span: 2 },
    ],
  },
  {
    id: "schedule",
    label: "Schedule & Fees",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    fields: [
      { name: "consultationFee", label: "Consultation Fee (BDT)", type: "number", placeholder: "500" },
      { name: "availableDays", label: "Available Days", type: "text", placeholder: "Mon, Tue, Wed" },
      { name: "startTime", label: "Start Time", type: "time" },
      { name: "endTime", label: "End Time", type: "time" },
      { name: "maxPatientsPerDay", label: "Max Patients / Day", type: "number", placeholder: "20" },
    ],
  },
];

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ sections, activeSection, completedSections, onStepClick }) {
  return (
    <div className="flex items-center gap-1 mb-10">
      {sections.map((section, i) => {
        const isActive = activeSection === section.id;
        const isCompleted = completedSections.includes(section.id);
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onStepClick(section.id)}
            className="flex items-center gap-2 group"
          >
            <div
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300
                ${isActive
                  ? "bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 shadow-[0_0_16px_0_rgba(6,182,212,0.25)]"
                  : isCompleted
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800/60 border border-slate-700/50 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                }
              `}
            >
              <span
                className={`
                  flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${isActive ? "bg-cyan-500 text-slate-900" : isCompleted ? "bg-emerald-500 text-slate-900" : "bg-slate-700 text-slate-400"}
                `}
              >
                {isCompleted ? "✓" : i + 1}
              </span>
              <span className="hidden sm:block">{section.label}</span>
            </div>
            {i < sections.length - 1 && (
              <div className={`w-6 h-px mx-1 transition-colors duration-300 ${isCompleted ? "bg-emerald-500/40" : "bg-slate-700/60"}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Field renderer ────────────────────────────────────────────────────────────
function Field({ field, value, onChange }) {
  const base =
    "w-full bg-slate-900/70 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/15 focus:bg-slate-900 hover:border-slate-600/80";

  const spanClass = field.span === 2 ? "md:col-span-2" : "";

  return (
    <div className={`flex flex-col gap-1.5 ${spanClass}`}>
      <label className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {field.label}
      </label>

      {field.type === "select" ? (
        <select name={field.name} value={value} onChange={onChange} className={`${base} cursor-pointer`}>
          <option value="">Select {field.label}</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900">
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          rows={3}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={field.type}
          name={field.name}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          className={base}
        />
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AddDoctor() {
  const router = useRouter();

  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [completedSections, setCompletedSections] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── handlers (untouched logic) ──
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const hospitalId = localStorage.getItem("hospitalId");
  //     if (!hospitalId) {
  //       alert("Hospital ID missing");
  //       return;
  //     }
  //     const data = new FormData();
  //     Object.entries(form).forEach(([key, value]) => {
  //       data.append(key, value || "");
  //     });
  //     data.append("hospitalId", hospitalId);
  //     if (image) {
  //       data.append("photo", image);
  //     }
  //     await axios.post("http://localhost:5000/api/doctors", data);
  //     setSaveSuccess(true);
  //     setTimeout(() => router.push("/hospital/doctors"), 1200);
  //   } catch (err) {
  //     console.log("ERROR:", err.response?.data);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ── section navigation ──
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const hospitalId = localStorage.getItem("hospitalId");

    if (!hospitalId) {
      alert("Hospital ID missing");
      return;
    }

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value || "");
    });

    data.append("hospitalId", hospitalId);

    if (image) {
      data.append("photo", image);
    }

    const res = await axios.post(
      "http://localhost:5000/api/doctors",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setSaveSuccess(true);
    setTimeout(() => router.push("/hospital/doctors"), 1200);

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};
  const sectionIds = SECTIONS.map((s) => s.id);
  const activeIdx = sectionIds.indexOf(activeSection);

  const goNext = () => {
    if (!completedSections.includes(activeSection)) {
      setCompletedSections((prev) => [...prev, activeSection]);
    }
    if (activeIdx < SECTIONS.length - 1) {
      setActiveSection(sectionIds[activeIdx + 1]);
    }
  };

  const goPrev = () => {
    if (activeIdx > 0) setActiveSection(sectionIds[activeIdx - 1]);
  };

  const handleStepClick = (id) => setActiveSection(id);

  const currentSection = SECTIONS.find((s) => s.id === activeSection);
  const isLastStep = activeIdx === SECTIONS.length - 1;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* ── ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-violet-600/4 rounded-full blur-[100px]" />
        {/* fine grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
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
            <span className="text-slate-200 text-sm font-medium">Add New Doctor</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-400 font-medium">Draft</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── main ── */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ── header ── */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end gap-6">

          {/* avatar upload */}
          <div className="relative flex-shrink-0">
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleImage}
              className="sr-only"
            />
            <label
              htmlFor="avatar-upload"
              className="relative block w-24 h-24 rounded-2xl cursor-pointer group overflow-hidden border-2 border-slate-700/60 hover:border-cyan-500/50 transition-all duration-300"
            >
              {preview ? (
                <img src={preview} alt="Doctor preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors font-medium">Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </div>
            </label>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Add New Doctor
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm">
              Complete all three sections to register a new physician to your hospital network.
            </p>
          </div>
        </div>

        {/* ── step indicator ── */}
        <StepIndicator
          sections={SECTIONS}
          activeSection={activeSection}
          completedSections={completedSections}
          onStepClick={handleStepClick}
        />

        {/* ── form card ── */}
        <form onSubmit={handleSubmit}>
          <div className="relative rounded-2xl border border-slate-800/70 bg-slate-900/40 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">

            {/* card top accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            {/* section header */}
            <div className="flex items-center gap-3 px-6 pt-7 pb-5 border-b border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                {currentSection.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
                  Step {activeIdx + 1} of {SECTIONS.length}
                </p>
                <h2 className="text-base font-semibold text-slate-100 mt-0.5">
                  {currentSection.label}
                </h2>
              </div>
            </div>

            {/* fields grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentSection.fields.map((field) => (
                <Field
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* card footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/50">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeIdx === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-3">
                {/* progress dots */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {SECTIONS.map((s, i) => (
                    <div
                      key={s.id}
                      className={`rounded-full transition-all duration-300 ${
                        s.id === activeSection
                          ? "w-5 h-1.5 bg-cyan-400"
                          : completedSections.includes(s.id)
                          ? "w-1.5 h-1.5 bg-emerald-500"
                          : "w-1.5 h-1.5 bg-slate-700"
                      }`}
                    />
                  ))}
                </div>

                {isLastStep ? (
                  <button
                    type="submit"
                    disabled={loading || saveSuccess}
                    className={`
                      relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden
                      ${saveSuccess
                        ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                        : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 hover:from-cyan-400 hover:to-cyan-300 shadow-[0_0_24px_0_rgba(6,182,212,0.35)] hover:shadow-[0_0_32px_0_rgba(6,182,212,0.5)]"
                      }
                      disabled:opacity-60 disabled:cursor-not-allowed
                    `}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving Doctor…
                      </>
                    ) : saveSuccess ? (
                      <>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        Saved! Redirecting…
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        Save Doctor
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 hover:from-cyan-400 hover:to-cyan-300 shadow-[0_0_20px_0_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_0_rgba(6,182,212,0.45)] transition-all duration-300"
                  >
                    Continue
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── quick-jump section links ── */}
          <div className="mt-6 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStepClick(s.id)}
                className={`
                  flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200
                  ${activeSection === s.id
                    ? "bg-slate-800 border-slate-600 text-slate-200"
                    : "bg-transparent border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400"
                  }
                `}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </form>

        {/* ── footer note ── */}
        <p className="text-center text-xs text-slate-600 mt-10">
          All data is encrypted and stored in compliance with HIPAA guidelines.
        </p>
      </div>

      {/* ── global styles injected via style tag ── */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.4);
          cursor: pointer;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          transition: background-color 0s 600000s, color 0s 600000s;
        }
        select option {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
}