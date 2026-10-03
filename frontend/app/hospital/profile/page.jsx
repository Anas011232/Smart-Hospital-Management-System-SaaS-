"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Mail,
  Phone,
  PhoneCall,
  Globe,
  MapPin,
  Hash,
  CalendarDays,
  Stethoscope,
  BedDouble,
  CreditCard,
  Star,
  Lock,
  Eye,
  EyeOff,
  ImagePlus,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Hospital,
  Layers,
  ChevronLeft,
} from "lucide-react";

/* ─────────────────────────── helpers ─────────────────────────── */

function GlowBlob({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="relative border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Icon size={16} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex-1 h-px bg-white/[0.05] ml-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </section>
  );
}

function Field({ icon: Icon, label, children, full = false }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-slate-500" />}
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-colors duration-200";

/* ─────────────────────────── main page ─────────────────────────── */

const EMPTY_FORM = {
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
  country: "",
  hospitalType: "",
  licenseNumber: "",
  establishedYear: "",
  totalDoctors: "",
  totalBeds: "",
  subscriptionPlan: "",
  subscriptionMonths: "",
};

export default function HospitalProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/hospital/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
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
          country: h.country || "",
          hospitalType: h.hospitalType || "",
          licenseNumber: h.licenseNumber || "",
          establishedYear: h.establishedYear || "",
          totalDoctors: h.totalDoctors ?? "",
          totalBeds: h.totalBeds ?? "",
          subscriptionPlan: h.subscriptionPlan || "",
          subscriptionMonths: h.subscriptionMonths || "",
        });
        setPreviewImage(h.hospitalImage || "");
      })
      .catch(() => setToast({ type: "error", text: "Failed to load hospital profile" }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });

      if (newPassword.trim()) {
        fd.append("password", newPassword.trim());
      }

      // route.js -> upload.single("image") — field-এর নাম "image" হতেই হবে
      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await api.put("/hospital/me", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setToast({ type: "success", text: "Profile updated successfully" });
        setNewPassword("");
        setImageFile(null);
        if (res.data.hospital?.hospitalImage) {
          setPreviewImage(res.data.hospital.hospitalImage);
        }
      } else {
        setToast({ type: "error", text: res.data.message || "Update failed" });
      }
    } catch (err) {
      setToast({
        type: "error",
        text: err.response?.data?.message || "Something went wrong while saving",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ── loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-['DM_Sans',sans-serif] relative overflow-x-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Sora:wght@700;800&display=swap');`}</style>

      <GlowBlob className="w-[600px] h-[600px] top-[-200px] left-[-200px] bg-blue-600" />
      <GlowBlob className="w-[500px] h-[500px] top-[300px] right-[-150px] bg-cyan-500" />
      <GlowBlob className="w-[400px] h-[400px] bottom-[100px] left-[30%] bg-violet-600" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* ── top bar ── */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/hospital/dashboard")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
            <Hospital size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
              Edit Profile
            </span>
          </div>
        </div>

        {/* ── hero / avatar ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          <div className="relative flex-shrink-0 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-white/[0.12] overflow-hidden shadow-2xl ring-4 ring-blue-500/10 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 flex items-center justify-center">
              {previewImage ? (
                <img src={previewImage} alt="Hospital" className="w-full h-full object-cover" />
              ) : (
                <Hospital size={32} className="text-cyan-400" />
              )}
            </div>
            <label
              htmlFor="hospitalImage"
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:border-blue-500/50 cursor-pointer transition-colors shadow-lg"
            >
              <ImagePlus size={15} />
            </label>
            <input
              id="hospitalImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center sm:text-left">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {form.hospitalName || "Your Hospital"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Update any field below — leave unchanged fields as they are.
            </p>
          </div>
        </div>

        {/* ── toast ── */}
        {toast && (
          <div
            className={`flex items-center gap-2 mb-6 px-4 py-3 rounded-xl text-sm border ${
              toast.type === "success"
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                : "bg-red-500/10 text-red-300 border-red-500/25"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.text}
          </div>
        )}

        {/* ══════════════ FORM ══════════════ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionCard icon={Building2} title="Basic Information" subtitle="Name, type & registration">
            <Field icon={Building2} label="Hospital Name">
              <input
                className={inputClass}
                value={form.hospitalName}
                onChange={(e) => handleChange("hospitalName", e.target.value)}
              />
            </Field>
            <Field icon={User} label="Owner / Admin Name">
              <input
                className={inputClass}
                value={form.ownerName}
                onChange={(e) => handleChange("ownerName", e.target.value)}
              />
            </Field>
            <Field icon={Layers} label="Hospital Type">
              <input
                className={inputClass}
                placeholder="e.g. General, Specialized, Clinic"
                value={form.hospitalType}
                onChange={(e) => handleChange("hospitalType", e.target.value)}
              />
            </Field>
            <Field icon={Hash} label="License Number">
              <input
                className={inputClass}
                value={form.licenseNumber}
                onChange={(e) => handleChange("licenseNumber", e.target.value)}
              />
            </Field>
            <Field icon={CalendarDays} label="Established Year">
              <input
                type="number"
                className={inputClass}
                value={form.establishedYear}
                onChange={(e) => handleChange("establishedYear", e.target.value)}
              />
            </Field>
          </SectionCard>

          <SectionCard icon={Mail} title="Contact Information" subtitle="How patients & staff reach you">
            <Field icon={Mail} label="Email Address">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Field>
            <Field icon={Phone} label="Phone Number">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Field>
            <Field icon={PhoneCall} label="Emergency Phone">
              <input
                className={inputClass}
                value={form.emergencyPhone}
                onChange={(e) => handleChange("emergencyPhone", e.target.value)}
              />
            </Field>
            <Field icon={Globe} label="Website">
              <input
                className={inputClass}
                placeholder="https://"
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </Field>
          </SectionCard>

          <SectionCard icon={MapPin} title="Address" subtitle="Physical location of the hospital">
            <Field icon={MapPin} label="Street Address" full>
              <input
                className={inputClass}
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Field>
            <Field icon={MapPin} label="City">
              <input
                className={inputClass}
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </Field>
            <Field icon={MapPin} label="State / Division">
              <input
                className={inputClass}
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </Field>
            <Field icon={Hash} label="Postal Code">
              <input
                className={inputClass}
                value={form.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
              />
            </Field>
            <Field icon={Globe} label="Country">
              <input
                className={inputClass}
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </Field>
          </SectionCard>

          <SectionCard icon={Stethoscope} title="Capacity" subtitle="Doctors & beds available">
            <Field icon={Stethoscope} label="Total Doctors">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.totalDoctors}
                onChange={(e) => handleChange("totalDoctors", e.target.value)}
              />
            </Field>
            <Field icon={BedDouble} label="Total Beds">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.totalBeds}
                onChange={(e) => handleChange("totalBeds", e.target.value)}
              />
            </Field>
          </SectionCard>

          {/* <SectionCard icon={CreditCard} title="Subscription" subtitle="Plan & billing duration">
            <Field icon={Star} label="Subscription Plan">
              <select
                className={inputClass}
                value={form.subscriptionPlan}
                onChange={(e) => handleChange("subscriptionPlan", e.target.value)}
              >
                <option value="" className="bg-slate-900">Select a plan</option>
                <option value="Free" className="bg-slate-900">Free</option>
                <option value="Pro" className="bg-slate-900">Pro</option>
                <option value="Premium" className="bg-slate-900">Premium</option>
                <option value="Enterprise" className="bg-slate-900">Enterprise</option>
              </select>
            </Field>
            <Field icon={CalendarDays} label="Subscription Months">
              <input
                type="number"
                min="1"
                className={inputClass}
                value={form.subscriptionMonths}
                onChange={(e) => handleChange("subscriptionMonths", e.target.value)}
              />
              <p className="text-[11px] text-slate-600 mt-1">
                বদলালে amount ও expiry নতুন করে হিসাব হয়ে যাবে।
              </p>
            </Field>
          </SectionCard> */}

          <SectionCard icon={Lock} title="Security" subtitle="Change your password (optional)">
            <Field icon={Lock} label="New Password" full>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputClass}
                  placeholder="Leave blank to keep current password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
          </SectionCard>

          {/* ── sticky save bar ── */}
          <div className="sticky bottom-4 z-20 flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold shadow-2xl shadow-blue-900/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <footer className="border-t border-white/[0.05] mt-10 pt-6 text-center">
          <p className="text-xs text-slate-600">
            {form.hospitalName} · Hospital Management Portal · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}