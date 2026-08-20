// 'use client';
// import { useEffect, useState, use } from "react";
// import api from "@/lib/axios";
// import { useRouter } from "next/navigation";
// import { ClipboardList, Pill, FlaskConical, NotebookPen, Plus, Send, User } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const easing = [0.4, 0, 0.2, 1];

// export default function PrescribePage({ params: paramsPromise }) {
//   const params = use(paramsPromise);
//   const appointmentId = params.id;
//   const router = useRouter();

//   const [appointment, setAppointment] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   // ফর্ম স্টেট
//   const [diagnosis, setDiagnosis] = useState("");

//   const [medicines, setMedicines] = useState([
//     {
//       name: "",
//       dosage: "1+0+1",
//       duration: "7 Days",
//       instruction: "After Meal",
//     },
//   ]);

//   const [tests, setTests] = useState([""]);
//   const [advice, setAdvice] = useState("");

//   useEffect(() => {
//     if (!appointmentId) return;

//     // FIX: proper string template
//     api
//       .get(`/appointments/${appointmentId}`)
//       .then((res) => {
//         // FIX: backend usually returns {success, appointment}
//         setAppointment(res.data.appointment || res.data);
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//       });
//   }, [appointmentId]);

//   const addMedicine = () =>
//     setMedicines([
//       ...medicines,
//       {
//         name: "",
//         dosage: "1+0+1",
//         duration: "7 Days",
//         instruction: "After Meal",
//       },
//     ]);

//   const handleMedChange = (index, field, value) => {
//     const updated = [...medicines];
//     updated[index][field] = value;
//     setMedicines(updated);
//   };

//   const addTest = () => setTests([...tests, ""]);

//   const handleTestChange = (index, value) => {
//     const updated = [...tests];
//     updated[index] = value;
//     setTests(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     const payload = {
//       appointmentId,
//       diagnosis,
//       medicines,
//       tests: tests.filter(Boolean),
//       advice,
//     };

//     try {
//       const res = await api.post("/prescriptions", payload);

//       if (res.data.success) {
//         alert("Prescription submitted and sent to patient!");
//         router.push("/doctor-dashboard/live-queue");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const pageBg = "min-h-screen bg-[radial-gradient(ellipse_at_top,_#0b1020_0%,_#05070f_55%,_#070a14_100%)] relative overflow-hidden";

//   const GridOverlay = () => (
//     <div
//       className="pointer-events-none absolute inset-0 opacity-[0.04]"
//       style={{
//         backgroundImage:
//           "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
//         backgroundSize: "48px 48px",
//       }}
//     />
//   );

//   if (!appointment) {
//     return (
//       <div className={pageBg}>
//         <GridOverlay />
//         <div className="relative p-4 sm:p-6">
//           <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="h-64 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
//             <div className="md:col-span-2 h-96 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const inputClass =
//     "w-full border border-white/[0.08] bg-slate-800/40 text-white placeholder:text-slate-500 p-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-blue-400/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.18),0_0_24px_-6px_rgba(59,130,246,0.35)] focus:scale-[1.01] hover:border-white/[0.15]";

//   return (
//     <motion.div
//       className={pageBg}
//       initial={{ opacity: 0, scale: 0.98 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.4, ease: easing }}
//     >
//       <GridOverlay />
//       <div className="relative p-4 sm:p-6">
//         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

//           {/* বাম কলাম: পেশেন্ট ডিটেইলস */}
//           <motion.div
//             initial={{ opacity: 0, x: -12 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.35, ease: easing }}
//             className="relative bg-slate-900/55 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 h-fit"
//           >
//             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
//             <h2 className="font-semibold text-base sm:text-lg text-white mb-4 pb-3 border-b border-white/[0.06] flex items-center gap-2">
//               <span className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 text-blue-300">
//                 <User size={16} />
//               </span>
//               Patient Profile
//             </h2>

//             <p className="font-bold text-xl text-white">
//               {appointment.patientInfo?.fullName}
//             </p>

//             <p className="text-slate-400 mt-1 text-sm">
//               Age: {appointment.patientInfo?.age || "N/A"} &middot; Gender:{" "}
//               {appointment.patientInfo?.gender || "N/A"}
//             </p>

//             <div className="mt-4 bg-slate-800/40 border border-white/[0.06] p-3.5 rounded-xl">
//               <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
//                 Chief Complaints / Symptoms
//               </p>
//               <p className="text-slate-200 mt-1.5 text-sm font-medium">
//                 {appointment.patientInfo?.symptoms || "None reported"}
//               </p>
//             </div>
//           </motion.div>

//           {/* ডান কলাম: প্রেসক্রিপশন বিল্ডার ফর্ম */}
//           <motion.form
//             initial={{ opacity: 0, x: 12 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.35, delay: 0.05, ease: easing }}
//             onSubmit={handleSubmit}
//             className="relative md:col-span-2 bg-slate-900/55 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-6"
//           >
//             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
//             <h2 className="text-lg sm:text-xl font-bold border-b border-white/[0.06] pb-3 text-white flex items-center gap-2">
//               <span className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 text-violet-300">
//                 <ClipboardList size={18} />
//               </span>
//               Prescription Builder
//             </h2>

//             <div>
//               <label className="block text-sm font-semibold text-slate-300 mb-2">
//                 Diagnosis / Clinical Findings
//               </label>

//               <input
//                 type="text"
//                 required
//                 value={diagnosis}
//                 onChange={(e) => setDiagnosis(e.target.value)}
//                 className={inputClass}
//                 placeholder="e.g. Acute Fever"
//               />
//             </div>

//             {/* মেডিসিন সেকশন */}
//             <div>
//               <div className="flex justify-between items-center mb-3">
//                 <label className="block text-sm font-semibold text-slate-300 flex items-center gap-1.5">
//                   <Pill size={14} className="text-emerald-300" />
//                   Rx &mdash; Medicines
//                 </label>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   type="button"
//                   onClick={addMedicine}
//                   className="text-xs font-medium bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.45)] hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-200 flex items-center gap-1"
//                 >
//                   <Plus size={12} /> Add Medicine
//                 </motion.button>
//               </div>

//               <div className="space-y-2">
//                 <AnimatePresence initial={false}>
//                   {medicines.map((med, idx) => (
//                     <motion.div
//                       key={idx}
//                       layout
//                       initial={{ opacity: 0, y: -8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.25, ease: easing }}
//                       className="grid grid-cols-1 sm:grid-cols-4 gap-2 border border-white/[0.06] p-3 rounded-xl bg-slate-800/30 hover:border-white/[0.12] transition-colors duration-200"
//                     >
//                       <input
//                         type="text"
//                         placeholder="Medicine Name"
//                         required
//                         value={med.name}
//                         onChange={(e) =>
//                           handleMedChange(idx, "name", e.target.value)
//                         }
//                         className={`${inputClass} p-2 sm:col-span-1`}
//                       />

//                       <input
//                         type="text"
//                         placeholder="Dosage (e.g. 1+0+1)"
//                         value={med.dosage}
//                         onChange={(e) =>
//                           handleMedChange(idx, "dosage", e.target.value)
//                         }
//                         className={`${inputClass} p-2`}
//                       />

//                       <input
//                         type="text"
//                         placeholder="Duration (e.g. 5 Days)"
//                         value={med.duration}
//                         onChange={(e) =>
//                           handleMedChange(idx, "duration", e.target.value)
//                         }
//                         className={`${inputClass} p-2`}
//                       />

//                       <input
//                         type="text"
//                         placeholder="Instruction"
//                         value={med.instruction}
//                         onChange={(e) =>
//                           handleMedChange(idx, "instruction", e.target.value)
//                         }
//                         className={`${inputClass} p-2`}
//                       />
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </div>

//             {/* টেস্ট সেকশন */}
//             <div>
//               <div className="flex justify-between items-center mb-3">
//                 <label className="block text-sm font-semibold text-slate-300 flex items-center gap-1.5">
//                   <FlaskConical size={14} className="text-amber-300" />
//                   Investigations / Tests
//                 </label>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   type="button"
//                   onClick={addTest}
//                   className="text-xs font-medium bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.45)] hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-200 flex items-center gap-1"
//                 >
//                   <Plus size={12} /> Add Test
//                 </motion.button>
//               </div>

//               <div className="space-y-2">
//                 <AnimatePresence initial={false}>
//                   {tests.map((test, idx) => (
//                     <motion.input
//                       key={idx}
//                       layout
//                       initial={{ opacity: 0, y: -8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.25, ease: easing }}
//                       type="text"
//                       placeholder="Test Name (e.g. CBC)"
//                       value={test}
//                       onChange={(e) =>
//                         handleTestChange(idx, e.target.value)
//                       }
//                       className={inputClass}
//                     />
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
//                 <NotebookPen size={14} className="text-violet-300" />
//                 Advice / Special Instructions
//               </label>

//               <textarea
//                 rows="3"
//                 value={advice}
//                 onChange={(e) => setAdvice(e.target.value)}
//                 className={`${inputClass} resize-none`}
//                 placeholder="e.g. Complete bed rest, drink plenty of water."
//               ></textarea>
//             </div>

//             <motion.button
//               type="submit"
//               disabled={submitting}
//               whileHover={!submitting ? { scale: 1.01 } : {}}
//               whileTap={!submitting ? { scale: 0.98 } : {}}
//               className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold py-3.5 rounded-2xl shadow-[0_8px_30px_-8px_rgba(59,130,246,0.45)] hover:shadow-[0_8px_40px_-6px_rgba(139,92,246,0.5)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
//             >
//               <Send size={18} />
//               {submitting ? "Sending..." : "Complete & Send Prescription"}
//             </motion.button>
//           </motion.form>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

'use client';
import { useEffect, useState, use, useRef } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ClipboardList, Pill, FlaskConical, NotebookPen, Plus, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const easing = [0.4, 0, 0.2, 1];

// শেয়ার্ড ইনপুট স্টাইল — মডিউল স্কোপে যাতে SmartInput ও PrescribePage দুটোই ব্যবহার করতে পারে
const inputClass =
  "w-full border border-white/[0.08] bg-slate-800/40 text-white placeholder:text-slate-500 p-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-blue-400/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.18),0_0_24px_-6px_rgba(59,130,246,0.35)] focus:scale-[1.01] hover:border-white/[0.15]";

// প্রি-সেট অপশন লিস্ট
const DOSAGE_OPTIONS = [
  "1+0+0", "0+1+0", "0+0+1",
  "1+1+0", "1+0+1", "0+1+1",
  "1+1+1",
  "2+0+0", "0+2+0", "0+0+2",
  "2+0+1", "1+0+2", "2+1+0", "0+1+2", "1+2+0", "0+2+1",
  "2+1+1", "1+2+1", "1+1+2",
  "2+2+1", "1+2+2", "2+2+2",
];

const DURATION_OPTIONS = [
  "1 Day", "2 Days", "3 Days", "4 Days", "5 Days", "6 Days", "7 Days",
];

const INSTRUCTION_OPTIONS = [
  "Before Meal", "After Meal", "With Food", "Empty Stomach",
  "At Bedtime", "Before Breakfast", "After Breakfast",
  "Before Lunch", "After Lunch", "Before Dinner", "After Dinner",
  "With Plenty of Water",
];

/**
 * SmartInput — একটি reusable autocomplete input।
 * প্রতিটি instance নিজের open/highlight state রাখে, তাই একাধিক medicine
 * row-এ আলাদা আলাদা dropdown একসাথে/স্বাধীনভাবে কাজ করে — কোনো shared
 * index ছাড়াই। মেডিসিন-নেম autocomplete-এর সাথে এটা সম্পূর্ণ স্বতন্ত্র।
 */
function SmartInput({ value, onChange, options, placeholder, onFocus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const query = (value || "").toLowerCase().trim();
  const filtered = query
    ? options.filter((opt) => {
        const lower = opt.toLowerCase();
        return lower.startsWith(query) || lower.includes(" " + query);
      })
    : options;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (opt) => {
    onChange(opt);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1 >= filtered.length ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 < 0 ? filtered.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && filtered[highlightIndex]) {
        e.preventDefault();
        selectOption(filtered[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightIndex(-1);
        }}
        onFocus={() => {
          setIsOpen(true);
          onFocus?.();
        }}
        onKeyDown={handleKeyDown}
        className={`${inputClass} p-2`}
      />

      <AnimatePresence>
        {isOpen && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: easing }}
            className="absolute left-0 top-full mt-2 w-full min-w-[160px] bg-slate-950/95 backdrop-blur-xl border border-white/[0.12] rounded-xl max-h-56 overflow-y-auto shadow-2xl shadow-black/50 z-[9999]"
          >
            {filtered.map((opt, i) => (
              <li
                key={opt}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(opt)}
                className={`p-2.5 text-sm cursor-pointer border-b border-white/[0.06] last:border-b-0 transition-colors duration-150 ${
                  i === highlightIndex
                    ? "bg-blue-600/30 text-white"
                    : "text-slate-200 hover:bg-blue-600/20"
                }`}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PrescribePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const appointmentId = params.id;
  const router = useRouter();

  const [appointment, setAppointment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ফর্ম স্টেট
  const [diagnosis, setDiagnosis] = useState("");

  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "",
      duration: "",
      instruction: "",
    },
  ]);

  const [tests, setTests] = useState([""]);
  const [advice, setAdvice] = useState("");

  // মেডিসিন সাজেশন স্টেট
  const [suggestions, setSuggestions] = useState([]);
  const [activeMedIndex, setActiveMedIndex] = useState(null);
  const wrapperRefs = useRef([]);

  // যেকোনো field (name/dosage/duration/instruction)-এ focus হলে সেই row-কে
  // z-index-এ উপরে তুলে ধরে, যাতে dropdown পরের row-এর নিচে চাপা না পড়ে
  const [activeRowIndex, setActiveRowIndex] = useState(null);

  useEffect(() => {
    if (!appointmentId) return;

    api
      .get(`/appointments/${appointmentId}`)
      .then((res) => {
        setAppointment(res.data.appointment || res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, [appointmentId]);

  // মেডিসিন সার্চ (Debounce)
  useEffect(() => {
    if (activeMedIndex === null) {
      setSuggestions([]);
      return;
    }

    const query = medicines[activeMedIndex]?.name;
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/medicines/search?query=${query}`);
        setSuggestions(res.data || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [medicines, activeMedIndex]);

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMedIndex === null) return;
      const activeWrapper = wrapperRefs.current[activeMedIndex];
      if (activeWrapper && !activeWrapper.contains(e.target)) {
        setActiveMedIndex(null);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMedIndex]);

  const addMedicine = () =>
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "",
        duration: "",
        instruction: "",
      },
    ]);

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
    if (field === "name") setActiveMedIndex(index);
  };

  const selectMedicine = (index, medObj) => {
    const updated = [...medicines];
    updated[index].name = `${medObj.medicine_name} ${medObj.strength || ""}`.trim();
    setMedicines(updated);
    setSuggestions([]);
    setActiveMedIndex(null);
  };

  const addTest = () => setTests([...tests, ""]);

  const handleTestChange = (index, value) => {
    const updated = [...tests];
    updated[index] = value;
    setTests(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      appointmentId,
      diagnosis,
      medicines,
      tests: tests.filter(Boolean),
      advice,
    };

    try {
      const res = await api.post("/prescriptions", payload);

      if (res.data.success) {
        alert("Prescription submitted and sent to patient!");
        router.push("/doctor-dashboard/live-queue");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const pageBg =
    "min-h-screen bg-[radial-gradient(ellipse_at_top,_#0b1020_0%,_#05070f_55%,_#070a14_100%)] relative overflow-hidden";

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

  if (!appointment) {
    return (
      <div className={pageBg}>
        <GridOverlay />
        <div className="relative p-4 sm:p-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
            <div className="md:col-span-2 h-96 rounded-2xl bg-slate-900/50 border border-white/[0.06] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={pageBg}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: easing }}
    >
      <GridOverlay />
      <div className="relative p-4 sm:p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* বাম কলাম: পেশেন্ট ডিটেইলস */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: easing }}
            className="relative bg-slate-900/55 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 h-fit"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
            <h2 className="font-semibold text-base sm:text-lg text-white mb-4 pb-3 border-b border-white/[0.06] flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 text-blue-300">
                <User size={16} />
              </span>
              Patient Profile
            </h2>

            <p className="font-bold text-xl text-white">
              {appointment.patientInfo?.fullName}
            </p>

            <p className="text-slate-400 mt-1 text-sm">
              Age: {appointment.patientInfo?.age || "N/A"} &middot; Gender:{" "}
              {appointment.patientInfo?.gender || "N/A"}
            </p>

            <div className="mt-4 bg-slate-800/40 border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
                Chief Complaints / Symptoms
              </p>
              <p className="text-slate-200 mt-1.5 text-sm font-medium">
                {appointment.patientInfo?.symptoms || "None reported"}
              </p>
            </div>
          </motion.div>

          {/* ডান কলাম: প্রেসক্রিপশন বিল্ডার ফর্ম */}
          <motion.form
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: easing }}
            onSubmit={handleSubmit}
            className="relative md:col-span-2 bg-slate-900/55 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
            <h2 className="text-lg sm:text-xl font-bold border-b border-white/[0.06] pb-3 text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 text-violet-300">
                <ClipboardList size={18} />
              </span>
              Prescription Builder
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Diagnosis / Clinical Findings
              </label>

              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className={inputClass}
                placeholder="e.g. Acute Fever"
              />
            </div>

            {/* মেডিসিন সেকশন */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Pill size={14} className="text-emerald-300" />
                  Rx &mdash; Medicines
                </label>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addMedicine}
                  className="text-xs font-medium bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.45)] hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-200 flex items-center gap-1"
                >
                  <Plus size={12} /> Add Medicine
                </motion.button>
              </div>

              {/* Each medicine row gets its own stacking context so a suggestion
                  dropdown always sits above rows below it, regardless of DOM order. */}
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {medicines.map((med, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: easing }}
                      className="relative grid grid-cols-1 sm:grid-cols-4 gap-2 border border-white/[0.06] p-3 rounded-xl bg-slate-800/30 hover:border-white/[0.12] transition-colors duration-200"
                      style={{ zIndex: activeRowIndex === idx ? 50 : 1 }}
                      onFocusCapture={() => setActiveRowIndex(idx)}
                    >
                      {/* Medicine Name + Suggestion Dropdown */}
                      <div
                        className="relative sm:col-span-1"
                        ref={(el) => (wrapperRefs.current[idx] = el)}
                      >
                        <input
                          type="text"
                          placeholder="Medicine Name"
                          required
                          autoComplete="off"
                          value={med.name}
                          onChange={(e) =>
                            handleMedChange(idx, "name", e.target.value)
                          }
                          onFocus={() => setActiveMedIndex(idx)}
                          className={`${inputClass} p-2`}
                        />

                        <AnimatePresence>
                          {activeMedIndex === idx && suggestions.length > 0 && (
                            <motion.ul
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: easing }}
                              className="absolute left-0 top-full mt-2 w-full min-w-[220px] bg-slate-950/95 backdrop-blur-xl border border-white/[0.12] rounded-xl max-h-56 overflow-y-auto shadow-2xl shadow-black/50 z-[9999]"
                            >
                              {suggestions.map((item) => (
                                <li
                                  key={item._id}
                                  onClick={() => selectMedicine(idx, item)}
                                  className="p-3 hover:bg-blue-600/20 cursor-pointer border-b border-white/[0.06] last:border-b-0 transition-colors duration-150"
                                >
                                  <div className="font-semibold text-sm text-white">
                                    {item.medicine_name} {item.strength}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {item.generic_name} &middot; {item.manufacturer_name}
                                  </div>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>

                      <SmartInput
                        value={med.dosage}
                        onChange={(value) => handleMedChange(idx, "dosage", value)}
                        options={DOSAGE_OPTIONS}
                        placeholder="Dosage (e.g. 1+0+1)"
                        onFocus={() => setActiveRowIndex(idx)}
                      />

                      <SmartInput
                        value={med.duration}
                        onChange={(value) => handleMedChange(idx, "duration", value)}
                        options={DURATION_OPTIONS}
                        placeholder="Duration (e.g. 5 Days)"
                        onFocus={() => setActiveRowIndex(idx)}
                      />

                      <SmartInput
                        value={med.instruction}
                        onChange={(value) => handleMedChange(idx, "instruction", value)}
                        options={INSTRUCTION_OPTIONS}
                        placeholder="Instruction"
                        onFocus={() => setActiveRowIndex(idx)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* টেস্ট সেকশন */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <FlaskConical size={14} className="text-amber-300" />
                  Investigations / Tests
                </label>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addTest}
                  className="text-xs font-medium bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.45)] hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-200 flex items-center gap-1"
                >
                  <Plus size={12} /> Add Test
                </motion.button>
              </div>

              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {tests.map((test, idx) => (
                    <motion.input
                      key={idx}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: easing }}
                      type="text"
                      placeholder="Test Name (e.g. CBC)"
                      value={test}
                      onChange={(e) => handleTestChange(idx, e.target.value)}
                      className={inputClass}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <NotebookPen size={14} className="text-violet-300" />
                Advice / Special Instructions
              </label>

              <textarea
                rows="3"
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="e.g. Complete bed rest, drink plenty of water."
              ></textarea>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { scale: 1.01 } : {}}
              whileTap={!submitting ? { scale: 0.98 } : {}}
              className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold py-3.5 rounded-2xl shadow-[0_8px_30px_-8px_rgba(59,130,246,0.45)] hover:shadow-[0_8px_40px_-6px_rgba(139,92,246,0.5)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            >
              <Send size={18} />
              {submitting ? "Sending..." : "Complete & Send Prescription"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
}