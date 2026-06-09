'use client';
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FiFileText, FiDownload, FiCalendar, FiUser, FiActivity, FiSearch } from "react-icons/fi";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/prescriptions/my-prescriptions")
      .then((res) => {
        setPrescriptions(res.data.prescriptions || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.diagnosis?.toLowerCase().includes(q) ||
      p.doctorDetails?.ownerName?.toLowerCase().includes(q) ||
      p.doctorDetails?.fullName?.toLowerCase().includes(q)
    );
  });

  const getDoctorName = (pres) => {
    return pres.doctorDetails?.fullName || pres.doctorDetails?.ownerName || "Specialist";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-3 w-24 bg-slate-800 rounded animate-pulse mb-2" />
          <div className="h-8 w-56 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Clinical Records</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Prescriptions</h1>
          <p className="text-slate-400 text-sm mt-1">Digital prescriptions from your consultations</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 border border-slate-700/50 px-3 py-2">
          <FiFileText className="text-slate-400 w-4 h-4" />
          <span className="text-slate-300 text-sm font-semibold">{prescriptions.length} total</span>
        </div>
      </div>

      {/* Search */}
      {prescriptions.length > 0 && (
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by diagnosis or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
          />
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-12 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
            <FiFileText className="text-slate-600 w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="text-slate-200 font-semibold">
              {search ? "No matching prescriptions" : "No prescriptions yet"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {search
                ? "Try a different search term."
                : "Prescriptions will appear here after your consultations."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pres) => (
            <div
              key={pres._id}
              className="group rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-5 hover:border-slate-600/70 hover:bg-slate-900/80 transition-all duration-200"
            >
              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-violet-400 w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Doctor + Diagnosis */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm">Dr. {getDoctorName(pres)}</h3>
                        {pres.doctorDetails?.specialization && (
                          <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                            {pres.doctorDetails.specialization}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <FiActivity className="text-slate-500 w-3 h-3 flex-shrink-0" />
                        <p className="text-slate-300 text-xs">
                          <span className="text-slate-500">Diagnosis: </span>
                          <span className="font-semibold">{pres.diagnosis || "—"}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(pres.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </span>

                    {pres.medicines?.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        {pres.medicines.length} medicine{pres.medicines.length !== 1 ? "s" : ""}
                      </span>
                    )}

                    {pres.tests?.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        {pres.tests.length} test{pres.tests.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Advice snippet */}
                  {pres.advice && (
                    <p className="text-slate-500 text-xs line-clamp-1">
                      <span className="text-slate-600">Advice: </span>{pres.advice}
                    </p>
                  )}
                </div>

                {/* Download CTA */}
                {pres.pdfUrl && (
                  <a
                    href={`http://localhost:5000${pres.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/15 border border-blue-500/25 text-blue-300 text-xs font-semibold hover:bg-blue-600/25 hover:border-blue-500/40 transition-all duration-200 group/dl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiDownload className="w-3.5 h-3.5 group-hover/dl:-translate-y-0.5 transition-transform duration-200" />
                    <span className="hidden sm:inline">View PDF</span>
                  </a>
                )}
              </div>

              {/* Medicine Tags */}
              {pres.medicines?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
                  {pres.medicines.slice(0, 5).map((med, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-400 text-[10px] font-medium"
                    >
                      {typeof med === "string" ? med : med.name || med.medicine || "Medicine"}
                    </span>
                  ))}
                  {pres.medicines.length > 5 && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-500 text-[10px]">
                      +{pres.medicines.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}