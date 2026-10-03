// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function PatientProfile() {
//   const [patient, setPatient] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/patient/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPatient(res.data.patient);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (!patient) return <ProfileSkeleton />;

//   const initials = patient.name
//     ? patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
//     : "?";

//   return (
//     <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
//       {/* Background Decorative Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-20 right-1/3 w-70 h-70 bg-emerald-500/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative max-w-5xl mx-auto space-y-6">
//         {/* Page Header */}
//         <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
//           <div className="flex items-start gap-4">
//             <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-xl flex-shrink-0">
//               {initials}
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold text-white tracking-tight">
//                 {patient.name}
//               </h1>
//               <p className="text-sm text-slate-400 mt-1">
//                 {patient.email}
//                 {patient.phone && ` · ${patient.phone}`}
//               </p>
//               <div className="flex items-center gap-2 mt-3">
//                 <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
//                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
//                   Active patient
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Personal Details */}
//         <Section
//           icon={
//             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//             </svg>
//           }
//           iconBg="bg-blue-500/15 text-blue-400 border-blue-500/20"
//           title="Personal details"
//         >
//           <FieldGrid>
//             <Field label="Full name" value={patient.name} />
//             <Field label="Email" value={patient.email} />
//             <Field label="Phone" value={patient.phone} />
//             <Field label="Gender" value={patient.profile?.gender} />
//             <Field label="Date of birth" value={patient.profile?.dateOfBirth} />
//             <Field label="Blood group" value={patient.medical?.bloodGroup} badge badgeColor="red" />
//           </FieldGrid>
//         </Section>

//         {/* Medical Records */}
//         <Section
//           icon={
//             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
//             </svg>
//           }
//           iconBg="bg-red-500/15 text-red-400 border-red-500/20"
//           title="Medical records"
//         >
//           <div className="divide-y divide-slate-700/50">
//             {/* Allergies */}
//             <div className="px-5 py-4">
//               <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
//                 Allergies
//               </p>
//               {patient.medical?.allergies?.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {patient.medical.allergies.map((a, i) => (
//                     <span
//                       key={i}
//                       className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/20 text-red-400"
//                     >
//                       <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
//                       {a}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-slate-500">No allergies recorded</p>
//               )}
//             </div>

//             {/* Medical History */}
//             <div className="px-5 py-4">
//               <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
//                 Medical history
//               </p>
//               {patient.medical?.medicalHistory?.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {patient.medical.medicalHistory.map((item, i) => (
//                     <span
//                       key={i}
//                       className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-500/15 border border-slate-500/20 text-slate-400"
//                     >
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-slate-500">No history recorded</p>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* Emergency Contact */}
//         <Section
//           icon={
//             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
//             </svg>
//           }
//           iconBg="bg-violet-500/15 text-violet-400 border-violet-500/20"
//           title="Emergency contact"
//         >
//           <FieldGrid cols={3}>
//             <Field label="Contact name" value={patient.emergencyContact?.name} />
//             <Field label="Relation" value={patient.emergencyContact?.relation} />
//             <Field label="Phone" value={patient.emergencyContact?.phone} />
//           </FieldGrid>
//         </Section>

//       </div>
//     </div>
//   );
// }

// /* ─── Sub-components ─── */

// function Section({ icon, iconBg, title, children }) {
//   return (
//     <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden group hover:border-opacity-40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
//       <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
//         <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
//           {icon}
//         </div>
//         <h2 className="text-sm font-semibold text-white">{title}</h2>
//       </div>
//       {children}
//     </div>
//   );
// }

// function FieldGrid({ children, cols = 3 }) {
//   return (
//     <div
//       className={`grid divide-x divide-y divide-slate-700/50`}
//       style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
//     >
//       {children}
//     </div>
//   );
// }

// function Field({ label, value, badge = false, badgeColor }) {
//   const badgeStyles = {
//     red: "bg-red-500/15 border-red-500/20 text-red-400",
//   };

//   return (
//     <div className="px-5 py-4">
//       <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
//         {label}
//       </p>
//       {value ? (
//         badge ? (
//           <span className={`inline-flex text-xs font-semibold px-3 py-1.5 rounded-full border ${badgeStyles[badgeColor]}`}>
//             {value}
//           </span>
//         ) : (
//           <p className="text-sm font-semibold text-white">{value}</p>
//         )
//       ) : (
//         <p className="text-sm text-slate-500">—</p>
//       )}
//     </div>
//   );
// }

// function ProfileSkeleton() {
//   return (
//     <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-20 right-1/3 w-70 h-70 bg-emerald-500/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative max-w-5xl mx-auto space-y-6">
//         {/* Header skeleton */}
//         <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-2xl bg-slate-500/15 animate-pulse flex-shrink-0"></div>
//             <div className="space-y-2 flex-1">
//               <div className="h-6 w-40 bg-slate-500/15 rounded-xl animate-pulse"></div>
//               <div className="h-4 w-56 bg-slate-500/10 rounded-lg animate-pulse"></div>
//             </div>
//           </div>
//         </div>

//         {/* Card skeletons */}
//         {[6, 4, 3].map((fields, i) => (
//           <div key={i} className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
//             <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
//               <div className="w-8 h-8 rounded-xl bg-slate-500/15 animate-pulse"></div>
//               <div className="h-4 w-28 bg-slate-500/15 rounded-xl animate-pulse"></div>
//             </div>
//             <div className="grid grid-cols-3 divide-x divide-y divide-slate-700/50">
//               {Array.from({ length: fields }).map((_, j) => (
//                 <div key={j} className="px-5 py-4 space-y-2">
//                   <div className="h-3 w-16 bg-slate-500/10 rounded-lg animate-pulse"></div>
//                   <div className="h-4 w-24 bg-slate-500/15 rounded-xl animate-pulse"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/patient/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(res.data.patient);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ patient লোড হলে form state বানিয়ে নেয় (flat structure, editing এর জন্য সুবিধাজনক)
  const buildFormFromPatient = (p) => ({
    name: p.name || "",
    phone: p.phone || "",
    gender: p.profile?.gender || "",
    dateOfBirth: p.profile?.dateOfBirth || "",
    address: p.profile?.address || "",
    bloodGroup: p.medical?.bloodGroup || "",
    allergies: p.medical?.allergies?.join(", ") || "",
    medicalHistory: p.medical?.medicalHistory?.join(", ") || "",
    emergencyName: p.emergencyContact?.name || "",
    emergencyPhone: p.emergencyContact?.phone || "",
    emergencyRelation: p.emergencyContact?.relation || "",
  });

  const startEditing = () => {
    setForm(buildFormFromPatient(patient));
    setSaveSuccess(false);
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setForm(null);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/patient/me",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatient(res.data.patient);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!patient) return <ProfileSkeleton />;

  const initials = patient.name
    ? patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-70 h-70 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto space-y-6">

        {/* Success toast */}
        {saveSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 flex items-center gap-2.5 animate-[fadeIn_0.3s_ease-out]">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-emerald-400">Profile updated successfully</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 flex items-center gap-2.5">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Page Header */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-xl flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full max-w-sm bg-slate-800/70 border border-slate-600/60 rounded-xl px-3.5 py-2 text-lg font-bold text-white outline-none transition-all focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/15"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {patient.name}
                  </h1>
                )}
                <p className="text-sm text-slate-400 mt-1">
                  {patient.email}
                  {!isEditing && patient.phone && ` · ${patient.phone}`}
                </p>
                {isEditing && (
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="mt-2 w-full max-w-xs bg-slate-800/70 border border-slate-600/60 rounded-xl px-3.5 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/15"
                  />
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active patient
                  </span>
                </div>
              </div>

              {/* Edit / Save / Cancel controls */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200 transition-all duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-900 hover:from-blue-400 hover:to-cyan-300 shadow-[0_0_20px_0_rgba(59,130,246,0.3)] transition-all duration-200 disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mt-6">
            <Section
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
              iconBg="bg-blue-500/15 text-blue-400 border-blue-500/20"
              title="Personal details"
            >
              {isEditing ? (
                <EditFieldGrid>
                  <EditField label="Full name" name="name" value={form.name} onChange={handleChange} />
                  <EditField label="Email" value={patient.email} disabled />
                  <EditField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                  <EditField
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    type="select"
                    options={["Male", "Female", "Other"]}
                  />
                  <EditField label="Date of birth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" />
                  <EditField
                    label="Blood group"
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    type="select"
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                  />
                  <EditField label="Address" name="address" value={form.address} onChange={handleChange} span={3} />
                </EditFieldGrid>
              ) : (
                <FieldGrid>
                  <Field label="Full name" value={patient.name} />
                  <Field label="Email" value={patient.email} />
                  <Field label="Phone" value={patient.phone} />
                  <Field label="Gender" value={patient.profile?.gender} />
                  <Field label="Date of birth" value={patient.profile?.dateOfBirth} />
                  <Field label="Blood group" value={patient.medical?.bloodGroup} badge badgeColor="red" />
                </FieldGrid>
              )}
              {isEditing && (
                <div className="grid divide-x divide-y divide-slate-700/50" style={{ gridTemplateColumns: "1fr" }}>
                  <EditField label="Address" name="address" value={form.address} onChange={handleChange} textarea hideIfInGrid />
                </div>
              )}
            </Section>
          </div>

          {/* Medical Records */}
          <div className="mt-6">
            <Section
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              }
              iconBg="bg-red-500/15 text-red-400 border-red-500/20"
              title="Medical records"
            >
              {isEditing ? (
                <div className="divide-y divide-slate-700/50">
                  <div className="px-5 py-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                      Allergies <span className="normal-case text-slate-600 font-normal">(comma separated)</span>
                    </label>
                    <input
                      name="allergies"
                      value={form.allergies}
                      onChange={handleChange}
                      placeholder="e.g. Penicillin, Dust, Peanuts"
                      className="w-full bg-slate-800/70 border border-slate-600/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-red-500/70 focus:ring-2 focus:ring-red-500/15"
                    />
                  </div>
                  <div className="px-5 py-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                      Medical history <span className="normal-case text-slate-600 font-normal">(comma separated)</span>
                    </label>
                    <input
                      name="medicalHistory"
                      value={form.medicalHistory}
                      onChange={handleChange}
                      placeholder="e.g. Diabetes, Asthma"
                      className="w-full bg-slate-800/70 border border-slate-600/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-red-500/70 focus:ring-2 focus:ring-red-500/15"
                    />
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {/* Allergies */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                      Allergies
                    </p>
                    {patient.medical?.allergies?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {patient.medical.allergies.map((a, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/20 text-red-400"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No allergies recorded</p>
                    )}
                  </div>

                  {/* Medical History */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                      Medical history
                    </p>
                    {patient.medical?.medicalHistory?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {patient.medical.medicalHistory.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-500/15 border border-slate-500/20 text-slate-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No history recorded</p>
                    )}
                  </div>
                </div>
              )}
            </Section>
          </div>

          {/* Emergency Contact */}
          <div className="mt-6">
            <Section
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              }
              iconBg="bg-violet-500/15 text-violet-400 border-violet-500/20"
              title="Emergency contact"
            >
              {isEditing ? (
                <EditFieldGrid cols={3}>
                  <EditField label="Contact name" name="emergencyName" value={form.emergencyName} onChange={handleChange} />
                  <EditField label="Relation" name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} />
                  <EditField label="Phone" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} />
                </EditFieldGrid>
              ) : (
                <FieldGrid cols={3}>
                  <Field label="Contact name" value={patient.emergencyContact?.name} />
                  <Field label="Relation" value={patient.emergencyContact?.relation} />
                  <Field label="Phone" value={patient.emergencyContact?.phone} />
                </FieldGrid>
              )}
            </Section>
          </div>

          {/* Bottom save bar (mobile-friendly, shows only while editing) */}
          {isEditing && (
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-900 hover:from-blue-400 hover:to-cyan-300 shadow-[0_0_24px_0_rgba(59,130,246,0.35)] transition-all duration-200 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Sub-components (read-only view — unchanged) ─── */

function Section({ icon, iconBg, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden group hover:border-opacity-40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FieldGrid({ children, cols = 3 }) {
  return (
    <div
      className={`grid divide-x divide-y divide-slate-700/50`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

function Field({ label, value, badge = false, badgeColor }) {
  const badgeStyles = {
    red: "bg-red-500/15 border-red-500/20 text-red-400",
  };

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      {value ? (
        badge ? (
          <span className={`inline-flex text-xs font-semibold px-3 py-1.5 rounded-full border ${badgeStyles[badgeColor]}`}>
            {value}
          </span>
        ) : (
          <p className="text-sm font-semibold text-white">{value}</p>
        )
      ) : (
        <p className="text-sm text-slate-500">—</p>
      )}
    </div>
  );
}

/* ─── Sub-components (edit mode — new) ─── */

function EditFieldGrid({ children, cols = 3 }) {
  return (
    <div
      className="grid divide-x divide-y divide-slate-700/50"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

function EditField({ label, name, value, onChange, type = "text", options = [], span, disabled = false, textarea = false, hideIfInGrid = false }) {
  if (hideIfInGrid) {
    // used standalone below the grid for full-width Address field
  }

  const spanStyle = span ? { gridColumn: `span ${span} / span ${span}` } : undefined;

  const base =
    "w-full bg-slate-800/70 border border-slate-600/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/15 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="px-5 py-4" style={spanStyle}>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">
        {label}
      </label>
      {type === "select" ? (
        <select name={name} value={value} onChange={onChange} disabled={disabled} className={`${base} cursor-pointer`}>
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900">
              {opt}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea name={name} value={value} onChange={onChange} disabled={disabled} rows={2} className={`${base} resize-none`} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} disabled={disabled} className={base} />
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-70 h-70 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-500/15 animate-pulse flex-shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 w-40 bg-slate-500/15 rounded-xl animate-pulse"></div>
              <div className="h-4 w-56 bg-slate-500/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Card skeletons */}
        {[6, 4, 3].map((fields, i) => (
          <div key={i} className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
              <div className="w-8 h-8 rounded-xl bg-slate-500/15 animate-pulse"></div>
              <div className="h-4 w-28 bg-slate-500/15 rounded-xl animate-pulse"></div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-y divide-slate-700/50">
              {Array.from({ length: fields }).map((_, j) => (
                <div key={j} className="px-5 py-4 space-y-2">
                  <div className="h-3 w-16 bg-slate-500/10 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-24 bg-slate-500/15 rounded-xl animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}