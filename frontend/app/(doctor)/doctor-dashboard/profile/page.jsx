// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function DoctorProfile() {
//   const [form, setForm] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/doctors/me/profile", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setForm(res.data.doctor);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const updateDoctor = async (e) => {
//   e.preventDefault();
//   try {
//     const token = localStorage.getItem("token");

//     // ডাটা পাঠানোর আগে ফরম্যাট ঠিক করা
//     const payload = {
//       ...form,
//       // এরে থাকলে সেগুলোকে কমা দিয়ে স্ট্রিং এ রূপান্তর করা (ব্যাকএন্ডের সুবিধার জন্য)
//       availableDays: Array.isArray(form.availableDays) ? form.availableDays.join(",") : form.availableDays,
//       languages: Array.isArray(form.languages) ? form.languages.join(",") : form.languages,
//       // নাম্বার ফিল্ডগুলো নিশ্চিত করা
//       consultationFee: Number(form.consultationFee) || 0,
//     };

//     await axios.put(`http://localhost:5000/api/doctors/${form._id}`, payload, {
//       headers: { 
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });
//     alert("Profile updated successfully!");
//   } catch (err) {
//     console.error("UPDATE ERROR:", err.response?.data || err.message);
//     alert(err.response?.data?.message || "Failed to update profile. Check console for details.");
//   }
// };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 flex items-center justify-center">
//       <div className="w-full max-w-4xl backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8">
        
//         {/* HEADER */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white">
//             My <span className="text-cyan-400">Profile</span>
//           </h1>
//           <p className="text-slate-400 mt-2">Manage your professional information</p>
//         </div>

//         {/* FORM */}
//         <form onSubmit={updateDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {Object.keys(form).map((key) => {
//             // এই ফিল্ডগুলো হাইড করা হয়েছে
//             if (["_id", "photo", "hospitalId", "role", "createdAt", "updatedAt"].includes(key)) return null;

//             // শুধুমাত্র এই ফিল্ডগুলো এডিট করা যাবে (আপনি চাইলে এখানে আরও ফিল্ড যোগ করতে পারেন)
//             const isEditable = ["consultationFee", "bio", "phone", "address"].includes(key);

//             return (
//               <div key={key} className="flex flex-col">
//                 <label className="text-sm text-slate-300 mb-2 capitalize">{key}</label>
//                 <input
//                   name={key}
//                   value={form[key] || ""}
//                   onChange={handleChange}
//                   readOnly={!isEditable}
//                   className={`p-3 rounded-xl bg-white/5 border transition duration-300 outline-none ${
//                     isEditable 
//                       ? "border-cyan-400 text-white focus:ring-2 focus:ring-cyan-500/30" 
//                       : "border-slate-700 text-slate-500 cursor-not-allowed"
//                   }`}
//                 />
//               </div>
//             );
//           })}

//           {/* BUTTON */}
//           <div className="md:col-span-2 mt-6">
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300"
//             >
//               Update Profile
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle2, Save, Lock } from "lucide-react";
import { motion } from "framer-motion";

const easing = [0.4, 0, 0.2, 1];

export default function DoctorProfile() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/doctors/me/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm(res.data.doctor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateDoctor = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      // ডাটা পাঠানোর আগে ফরম্যাট ঠিক করা
      const payload = {
        ...form,
        // এরে থাকলে সেগুলোকে কমা দিয়ে স্ট্রিং এ রূপান্তর করা (ব্যাকএন্ডের সুবিধার জন্য)
        availableDays: Array.isArray(form.availableDays) ? form.availableDays.join(",") : form.availableDays,
        languages: Array.isArray(form.languages) ? form.languages.join(",") : form.languages,
        // নাম্বার ফিল্ডগুলো নিশ্চিত করা
        consultationFee: Number(form.consultationFee) || 0,
      };

      await axios.put(`http://localhost:5000/api/doctors/${form._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update profile. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const pageBg = "min-h-screen bg-[radial-gradient(ellipse_at_top,_#0b1020_0%,_#05070f_55%,_#070a14_100%)] relative overflow-hidden flex items-center justify-center pt-5 pb-5";

  const GridOverlay = () => (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  );

  if (loading) {
    return (
      <div className={pageBg}>
        <GridOverlay />
        <div className="relative w-full max-w-4xl mx-4 sm:mx-6 rounded-3xl border border-white/[0.08] bg-slate-900/55 backdrop-blur-xl p-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-48 bg-slate-800/60 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-800/40 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-slate-800/40 rounded animate-pulse" />
                <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageBg}>
      <GridOverlay />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: easing }}
        className="relative w-full max-w-4xl mx-4 sm:mx-6 rounded-3xl border border-white/[0.08] bg-slate-900/55 backdrop-blur-xl shadow-[0_8px_60px_-12px_rgba(0,0,0,0.6)] p-6 sm:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-3xl" />

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easing }}
          className="text-center mb-8 flex flex-col items-center gap-2"
        >
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 shadow-[0_0_30px_-6px_rgba(59,130,246,0.35)]">
            <UserCircle2 size={28} className="text-blue-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-400 text-sm">Manage your professional information</p>
        </motion.div>

        {/* FORM */}
        <form onSubmit={updateDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(form).map((key, idx) => {
            // এই ফিল্ডগুলো হাইড করা হয়েছে
            if (["_id", "photo", "hospitalId", "role", "createdAt", "updatedAt"].includes(key)) return null;

            // শুধুমাত্র এই ফিল্ডগুলো এডিট করা যাবে (আপনি চাইলে এখানে আরও ফিল্ড যোগ করতে পারেন)
            const isEditable = ["consultationFee", "bio", "phone", "address"].includes(key);
            const hasValue = form[key] !== undefined && form[key] !== null && form[key] !== "";
            const isFocused = focusedField === key;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03, ease: easing }}
                className="relative flex flex-col"
              >
                <motion.label
                  initial={false}
                  animate={{
                    top: isFocused || hasValue ? "-0.55rem" : "0.85rem",
                    fontSize: isFocused || hasValue ? "0.7rem" : "0.8rem",
                    color: isFocused ? "#93c5fd" : "#94a3b8",
                  }}
                  transition={{ duration: 0.18, ease: easing }}
                  className="absolute left-3 px-1.5 bg-slate-900/80 rounded capitalize tracking-wide flex items-center gap-1.5 pointer-events-none z-10"
                  style={{ top: "0.85rem" }}
                >
                  {key}
                  {!isEditable && <Lock size={10} className="text-slate-600" />}
                </motion.label>
                <motion.input
                  name={key}
                  value={form[key] || ""}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(key)}
                  onBlur={() => setFocusedField(null)}
                  readOnly={!isEditable}
                  whileFocus={isEditable ? { scale: 1.01 } : {}}
                  className={`p-3 pt-4 rounded-xl border bg-slate-800/40 outline-none text-sm transition-all duration-200 ${
                    isEditable
                      ? `text-white border-white/[0.08] focus:border-blue-400/60 ${isFocused ? "shadow-[0_0_0_3px_rgba(59,130,246,0.18),0_0_24px_-6px_rgba(59,130,246,0.35)]" : ""} hover:border-white/[0.15]`
                      : "text-slate-500 border-white/[0.04] cursor-not-allowed"
                  }`}
                />
              </motion.div>
            );
          })}

          {/* BUTTON */}
          <div className="md:col-span-2 mt-4">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={!saving ? { scale: 1.01 } : {}}
              whileTap={!saving ? { scale: 0.98 } : {}}
              className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold py-3.5 rounded-2xl shadow-[0_8px_30px_-8px_rgba(59,130,246,0.45)] hover:shadow-[0_8px_40px_-6px_rgba(139,92,246,0.5)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/15 to-violet-400/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <Save size={18} className={saving ? "animate-pulse" : ""} />
              {saving ? "Saving..." : "Update Profile"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}