"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddDoctor() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    address: "",
    nidNumber: "",
    specialization: "",
    designation: "",
    department: "",
    qualification: "",
    experienceYears: "",
    medicalRegistrationNumber: "",
    licenseNumber: "",
    consultationFee: "",
    availableDays: "",
    startTime: "",
    endTime: "",
    maxPatientsPerDay: "",
    bio: "",
    languages: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  // IMAGE
  // ===============================
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ===============================
  // SUBMIT
  // ===============================
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const hospitalId = localStorage.getItem("hospitalId");

    console.log("HOSPITAL ID:", hospitalId);

    if (!hospitalId) {
      alert("Hospital ID missing");
      return;
    }

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value || "");
    });

    data.append("hospitalId", hospitalId); // 🔥 IMPORTANT

    if (image) {
      data.append("photo", image);
    }

    await axios.post("http://localhost:5000/api/doctors", data);

    router.push("/hospital/doctors");

  } catch (err) {
    console.log("ERROR:", err.response?.data);
  } finally {
    setLoading(false);
  }
};

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Add New Doctor
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >

        {/* INPUT FIELDS */}
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            name={key}
            value={value}
            onChange={handleChange}
            placeholder={key}
            className="p-3 rounded bg-slate-800 border border-slate-700"
          />
        ))}

        {/* IMAGE UPLOAD */}
        <div className="col-span-full">
          <input type="file" onChange={handleImage} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 mt-3 rounded object-cover"
            />
          )}
        </div>

        {/* BUTTON */}
        <div className="col-span-full">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 px-6 py-3 rounded"
          >
            {loading ? "Saving..." : "Save Doctor"}
          </button>
        </div>

      </form>
    </div>
  );
}