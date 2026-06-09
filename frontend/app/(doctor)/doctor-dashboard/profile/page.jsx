"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorProfile() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

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
  try {
    const token = localStorage.getItem("token");

    // ডাটা পাঠানোর আগে ফরম্যাট ঠিক করা
    const payload = {
      ...form,
      // এরে থাকলে সেগুলোকে কমা দিয়ে স্ট্রিং এ রূপান্তর করা (ব্যাকএন্ডের সুবিধার জন্য)
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
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            My <span className="text-cyan-400">Profile</span>
          </h1>
          <p className="text-slate-400 mt-2">Manage your professional information</p>
        </div>

        {/* FORM */}
        <form onSubmit={updateDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.keys(form).map((key) => {
            // এই ফিল্ডগুলো হাইড করা হয়েছে
            if (["_id", "photo", "hospitalId", "role", "createdAt", "updatedAt"].includes(key)) return null;

            // শুধুমাত্র এই ফিল্ডগুলো এডিট করা যাবে (আপনি চাইলে এখানে আরও ফিল্ড যোগ করতে পারেন)
            const isEditable = ["consultationFee", "bio", "phone", "address"].includes(key);

            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-slate-300 mb-2 capitalize">{key}</label>
                <input
                  name={key}
                  value={form[key] || ""}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className={`p-3 rounded-xl bg-white/5 border transition duration-300 outline-none ${
                    isEditable 
                      ? "border-cyan-400 text-white focus:ring-2 focus:ring-cyan-500/30" 
                      : "border-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
                />
              </div>
            );
          })}

          {/* BUTTON */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}