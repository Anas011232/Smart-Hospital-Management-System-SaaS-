"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/appointments/my-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data.appointments);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Appointments</h1>

      <div className="space-y-6">
        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">You have no appointments yet.</p>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {app.doctorDetails?.fullName?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {app.doctorDetails?.fullName || "Doctor Name Unavailable"}
                    </h2>
                    <p className="text-sm text-gray-500">{app.doctorDetails?.specialization || "Specialist"}</p>
                  </div>
                </div>

                {/* Appointment Meta */}
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-gray-400 uppercase text-[10px] font-bold">Date</p>
                    <p className="font-semibold">{app.patientInfo?.appointmentDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase text-[10px] font-bold">Serial</p>
                    <p className="font-semibold text-blue-600 text-lg">#{app.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase text-[10px] font-bold">Status</p>
                    <span className={`px-3 py-1 rounded-full font-bold text-[11px] 
                      ${app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}