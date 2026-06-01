"use client";

import { useState } from "react";
import DoctorCard from "../../components/doctor/DoctorCard";

export default function AIDoctor() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/ai/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setReply(data.reply || "");
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">

      {/* HEADER */}
      <div className="text-center py-12">
        <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm mb-4">
          🤖 AI Powered Hospital Assistant
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight">
          AI Doctor Assistant
        </h1>

        <p className="text-slate-400 mt-3">
          Describe symptoms & get instant specialist recommendations
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto px-6">

        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl">

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: I have fever for 3 days, headache and weakness..."
            className="w-full bg-white/5 border border-slate-700 rounded-2xl p-5 text-white outline-none focus:border-cyan-400 transition"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="mt-5 w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-lg transition hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Analyzing Symptoms...
              </span>
            ) : (
              "Ask AI Doctor"
            )}
          </button>

        </div>

        {/* AI RESPONSE */}
        {reply && (
          <div className="mt-8 p-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-md shadow-lg">
            <h2 className="text-cyan-300 font-semibold text-lg mb-2">
              🧠 AI Recommendation
            </h2>
            <p className="text-slate-200 leading-relaxed">{reply}</p>
          </div>
        )}

        {/* DOCTORS */}
        {doctors.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">
              👨‍⚕️ Recommended Specialists
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ollama run llama3