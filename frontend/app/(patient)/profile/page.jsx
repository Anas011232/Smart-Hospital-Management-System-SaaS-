"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientProfile() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/patient/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatient(res.data.patient);
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  if (!patient) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Medical Profile</h1>

      <div className="grid gap-6">
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-blue-600">Personal Details</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <InfoItem label="Full Name" value={patient.name} />
            <InfoItem label="Email" value={patient.email} />
            <InfoItem label="Phone" value={patient.phone} />
            <InfoItem label="Gender" value={patient.profile?.gender} />
            <InfoItem label="DOB" value={patient.profile?.dateOfBirth} />
            <InfoItem label="Blood Group" value={patient.medical?.bloodGroup} />
          </div>
        </div>

        {/* Medical Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-red-600">Medical Records</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Allergies</p>
              <div className="flex gap-2 mt-2">
                {patient.medical?.allergies?.map((a, i) => (
                  <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm">{a}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Medical History</p>
              <p className="mt-2 text-gray-700">{patient.medical?.medicalHistory?.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-orange-600">Emergency Contact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <InfoItem label="Name" value={patient.emergencyContact?.name} />
            <InfoItem label="Relation" value={patient.emergencyContact?.relation} />
            <InfoItem label="Phone" value={patient.emergencyContact?.phone} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase">{label}</p>
      <p className="font-semibold text-gray-800 mt-1">{value || "N/A"}</p>
    </div>
  );
}