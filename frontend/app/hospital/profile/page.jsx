"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Building2,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Award,
  Calendar,
  Bed,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react";

export default function HospitalProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    hospitalName: "",
    ownerName: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    hospitalType: "General",
    licenseNumber: "",
    establishedYear: "",
    totalBeds: "",
  });

  const [hospitalImage, setHospitalImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/hospital/me");
        if (res.data.success && res.data.hospital) {
          const h = res.data.hospital;
          setForm({
            hospitalName: h.hospitalName || "",
            ownerName: h.ownerName || "",
            email: h.email || "",
            phone: h.phone || "",
            emergencyPhone: h.emergencyPhone || "",
            website: h.website || "",
            address: h.address || "",
            city: h.city || "",
            state: h.state || "",
            postalCode: h.postalCode || "",
            country: h.country || "Bangladesh",
            hospitalType: h.hospitalType || "General",
            licenseNumber: h.licenseNumber || "",
            establishedYear: h.establishedYear || "",
            totalBeds: h.totalBeds || "",
          });
          if (h.hospitalImage) {
            setPreview(
              h.hospitalImage.startsWith("http")
                ? h.hospitalImage
                : `http://localhost:5000/${h.hospitalImage}`
            );
          }
        }
      } catch (err) {
        showToast(err?.response?.data?.message || "Failed to load hospital profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHospitalImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        data.append(key, val || "");
      });
      if (hospitalImage) {
        data.append("image", hospitalImage);
      }

      const res = await api.put("/hospital/me", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        showToast("Hospital profile updated successfully! ✅");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Loading hospital profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-8 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl font-bold text-xs flex items-center gap-2 ${
              toast.type === "error"
                ? "bg-red-500/20 text-red-300 border-red-500/40"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}
          >
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Building2 size={14} /> Hospital Profile Settings
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Hospital Profile</h1>
          <p className="text-slate-400 text-sm mt-1">
            Update your registered hospital information, contact details, and facility settings.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hospital Branding & Image */}
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Building2 size={18} className="text-cyan-400" />
            Hospital Identity & Logo
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Hospital Logo"
                  className="w-28 h-28 rounded-2xl object-cover ring-2 ring-cyan-500/40"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400">
                  <Building2 size={32} />
                  <span className="text-[10px] mt-1 font-semibold">No Logo</span>
                </div>
              )}
              <label
                htmlFor="hospital-image"
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold text-xs gap-1"
              >
                <Upload size={16} /> Change
              </label>
              <input
                id="hospital-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white">{form.hospitalName || "Hospital Name"}</h3>
              <p className="text-xs text-slate-400">
                Upload your official hospital logo or building photo to showcase in search results.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                value={form.hospitalName}
                onChange={handleChange}
                placeholder="Hospital Official Name"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Owner / Director Name</label>
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Owner Full Name"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Contact & Communication */}
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Mail size={18} className="text-violet-400" />
            Contact & Communication Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Official Email (Read-Only)</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800/50 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+880 1XXX XXXXXX"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Emergency Hotline Phone</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={handleChange}
                placeholder="Emergency hotline"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Website URL</label>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://www.hospital.com"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <MapPin size={18} className="text-emerald-400" />
            Location & Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Street Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full Street Address"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Dhaka / Chittagong..."
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">State / Division</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State or Division"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="1205"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Bangladesh"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Licensing & Capacity */}
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Award size={18} className="text-amber-400" />
            Licensing & Capacity Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Hospital Type</label>
              <select
                name="hospitalType"
                value={form.hospitalType}
                onChange={handleChange}
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="General">General Hospital</option>
                <option value="Specialized">Specialized Hospital</option>
                <option value="Clinic">Clinic & Diagnostic Center</option>
                <option value="Medical College">Medical College Hospital</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Medical License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="LIC-XXXXX"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Established Year</label>
              <input
                type="number"
                name="establishedYear"
                value={form.establishedYear}
                onChange={handleChange}
                placeholder="2010"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Total Beds</label>
              <input
                type="number"
                name="totalBeds"
                value={form.totalBeds}
                onChange={handleChange}
                placeholder="100"
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Footer Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? "Saving Changes..." : "Save Hospital Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
