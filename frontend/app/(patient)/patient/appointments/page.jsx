"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AppointmentModal from "../../../../components/patient/AppointmentModal.jsx";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/appointments/my-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data.appointments);
      } catch (err) { console.error(err); }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">My Appointments</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((app) => (
          <div 
            key={app._id} 
            // এখানে ক্লিক করলে আর নিচে নামবে না
            onClick={(e) => {
              e.preventDefault();
              setSelectedApp(app);
            }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">
                {app.doctorDetails?.fullName?.charAt(0) || "D"}
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {app.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{app.doctorDetails?.fullName || "Doctor"}</h3>
            <p className="text-sm text-gray-500 mb-6">{app.doctorDetails?.specialization || "Specialist"}</p>
            
            <div className="flex justify-between items-center border-t border-gray-50 pt-4">
              <span className="text-xs text-gray-400 font-semibold uppercase">📅 {app.patientInfo?.appointmentDate}</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">🕒 {app.patientInfo?.appointmentTime}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <AppointmentModal 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
        />
      )}
    </div>
  );
}