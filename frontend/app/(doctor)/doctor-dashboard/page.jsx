'use client';
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Users, Clock3, CheckCircle2, AlertCircle, Check, X } from 'lucide-react';

export default function DoctorDashboardHome() {
  const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0, totalToday: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটা ফেচ করার ফাংশন
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/doctor");
      const data = res.data.appointments || [];
      setAppointments(data);
      
      setStats({
        pending: data.filter(a => a.status === "pending").length,
        accepted: data.filter(a => a.status === "accepted").length,
        completed: data.filter(a => a.status === "completed").length,
        totalToday: data.length
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // অ্যাপয়েন্টমেন্ট Accept করার লজিক
  const handleAccept = async (id) => {
    try {
      const res = await api.patch(`/appointments/accept/${id}`);
      if (res.data.success) {
        alert("Appointment Accepted!");
        fetchAppointments(); // লিস্ট রিফ্রেশ করার জন্য
      }
    } catch (err) {
      alert("Failed to accept appointment: " + err.message);
    }
  };

  // অ্যাপয়েন্টমেন্ট Reject করার লজিক
  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this appointment?")) {
      try {
        const res = await api.patch(`/appointments/reject/${id}`);
        if (res.data.success) {
          alert("Appointment Rejected!");
          fetchAppointments(); // লিস্ট রিফ্রেশ করার জন্য
        }
      } catch (err) {
        alert("Failed to reject appointment: " + err.message);
      }
    }
  };

  const cards = [
    { title: "Pending Requests", value: stats.pending, icon: <AlertCircle className="text-amber-600" />, color: "bg-amber-50" },
    { title: "Accepted Appointments", value: stats.accepted, icon: <CheckCircle2 className="text-green-600" />, color: "bg-green-50" },
    { title: "Completed Today", value: stats.completed, icon: <Users className="text-indigo-600" />, color: "bg-indigo-50" },
    { title: "Total Patients", value: stats.totalToday, icon: <Clock3 className="text-blue-600" />, color: "bg-blue-50" },
  ];

  if (loading) return <p className="p-6">Loading Dashboard Data...</p>;

  return (
    <div className="space-y-6">
      {/* ওয়েলকাম সেকশন */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Doctor!</h1>
        <p className="text-gray-500">Manage your pending requests and upcoming patient queue.</p>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={`${card.color} p-6 rounded-2xl border flex items-center gap-4`}>
            <div className="p-3 bg-white rounded-xl shadow-sm">{card.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-black text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ১. পেশেন্ট রিকোয়েস্ট অ্যাকসেপ্ট/রিজেক্ট সেকশন (Left Column) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-amber-600 flex items-center gap-2">
            <AlertCircle size={20} /> Pending Appointment Requests ({stats.pending})
          </h2>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {appointments.filter(a => a.status === "pending").length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center border border-dashed rounded-xl">No pending requests at the moment.</p>
            ) : (
              appointments.filter(a => a.status === "pending").map((app) => (
                <div key={app._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border hover:shadow-sm transition">
                  <div>
                    <p className="font-bold text-gray-800">{app.patientInfo?.fullName}</p>
                    <p className="text-xs text-gray-500">Date: {app.patientInfo?.appointmentDate} | Age: {app.patientInfo?.age}</p>
                    <p className="text-xs text-indigo-600 font-medium mt-1">Reason: {app.patientInfo?.symptoms || "General Checkup"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAccept(app._id)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      title="Accept Appointment"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => handleReject(app._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Reject Appointment"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ২. ইতিমধ্যে অ্যাকসেপ্ট হওয়া পেশেন্টদের তালিকা (Right Column) */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-green-700 flex items-center gap-2">
            <CheckCircle2 size={20} /> Approved for Live Queue ({stats.accepted})
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {appointments.filter(a => a.status === "accepted").length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center border border-dashed rounded-xl">No accepted patients yet.</p>
            ) : (
              appointments.filter(a => a.status === "accepted").map((app) => (
                <div key={app._id} className="p-3 bg-green-50/50 border border-green-100 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">SL #{app.serialNumber} - {app.patientInfo?.fullName}</p>
                    <p className="text-[11px] text-gray-500">Date: {app.patientInfo?.appointmentDate}</p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                    Ready
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}