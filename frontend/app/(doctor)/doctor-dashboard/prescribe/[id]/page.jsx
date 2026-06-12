'use client';
import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ClipboardList, Pill, FlaskConical, NotebookPen, Plus, Send, User } from "lucide-react";

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
      dosage: "1+0+1",
      duration: "7 Days",
      instruction: "After Meal",
    },
  ]);

  const [tests, setTests] = useState([""]);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    if (!appointmentId) return;

    // FIX: proper string template
    api
      .get(`/appointments/${appointmentId}`)
      .then((res) => {
        // FIX: backend usually returns {success, appointment}
        setAppointment(res.data.appointment || res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, [appointmentId]);

  const addMedicine = () =>
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "1+0+1",
        duration: "7 Days",
        instruction: "After Meal",
      },
    ]);

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
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

  if (!appointment) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl bg-slate-900/60 border border-slate-700/50 animate-pulse" />
          <div className="md:col-span-2 h-96 rounded-2xl bg-slate-900/60 border border-slate-700/50 animate-pulse" />
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-slate-700/60 bg-slate-800/40 text-white placeholder:text-slate-500 p-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-600/70";

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

        {/* বাম কলাম: পেশেন্ট ডিটেইলস */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 sm:p-6 h-fit">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4 pb-3 border-b border-slate-700/50 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400">
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

          <div className="mt-4 bg-slate-800/40 border border-slate-700/40 p-3.5 rounded-xl">
            <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
              Chief Complaints / Symptoms
            </p>
            <p className="text-slate-200 mt-1.5 text-sm font-medium">
              {appointment.patientInfo?.symptoms || "None reported"}
            </p>
          </div>
        </div>

        {/* ডান কলাম: প্রেসক্রিপশন বিল্ডার ফর্ম */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 sm:p-6 space-y-6"
        >
          <h2 className="text-lg sm:text-xl font-bold border-b border-slate-700/50 pb-3 text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-400">
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
                <Pill size={14} className="text-emerald-400" />
                Rx &mdash; Medicines
              </label>

              <button
                type="button"
                onClick={addMedicine}
                className="text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center gap-1 active:scale-95"
              >
                <Plus size={12} /> Add Medicine
              </button>
            </div>

            <div className="space-y-2">
              {medicines.map((med, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2 border border-slate-700/40 p-3 rounded-xl bg-slate-800/30 hover:border-slate-600/60 transition-colors duration-200"
                >
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    required
                    value={med.name}
                    onChange={(e) =>
                      handleMedChange(idx, "name", e.target.value)
                    }
                    className={`${inputClass} p-2 sm:col-span-1`}
                  />

                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1+0+1)"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedChange(idx, "dosage", e.target.value)
                    }
                    className={`${inputClass} p-2`}
                  />

                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 Days)"
                    value={med.duration}
                    onChange={(e) =>
                      handleMedChange(idx, "duration", e.target.value)
                    }
                    className={`${inputClass} p-2`}
                  />

                  <input
                    type="text"
                    placeholder="Instruction"
                    value={med.instruction}
                    onChange={(e) =>
                      handleMedChange(idx, "instruction", e.target.value)
                    }
                    className={`${inputClass} p-2`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* টেস্ট সেকশন */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <FlaskConical size={14} className="text-amber-400" />
                Investigations / Tests
              </label>

              <button
                type="button"
                onClick={addTest}
                className="text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center gap-1 active:scale-95"
              >
                <Plus size={12} /> Add Test
              </button>
            </div>

            <div className="space-y-2">
              {tests.map((test, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder="Test Name (e.g. CBC)"
                  value={test}
                  onChange={(e) =>
                    handleTestChange(idx, e.target.value)
                  }
                  className={inputClass}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <NotebookPen size={14} className="text-violet-400" />
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send size={18} />
            {submitting ? "Sending..." : "Complete & Send Prescription"}
          </button>
        </form>
      </div>
    </div>
  );
}