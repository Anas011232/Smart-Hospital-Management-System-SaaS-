"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  MapPin,
  BedDouble,
  Stethoscope,
  BadgeCheck,
  Calendar,
  ImagePlus,
  CreditCard,
  Sparkles,
} from "lucide-react";

export default function HospitalRegister() {
  const router = useRouter();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    hospitalName: "",
    ownerName: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    password: "",
    confirmPassword: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    hospitalType: "General",
    licenseNumber: "",
    establishedYear: "",
    totalDoctors: 0,
    totalBeds: 0,
    subscriptionPlan: "Basic",
    subscriptionMonths: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords not match");
    }

    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      fd.append(key, form[key]);
    });

    fd.append("image", image);

    const res = await fetch(
      "http://localhost:5000/api/hospital/register",
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();

    if (!data.success) return alert(data.message);

    localStorage.setItem("token", data.token);

    router.push("/hospital/dashboard");
  };

  const amount = form.subscriptionMonths * 1000;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 py-10 px-4">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute bottom-[-180px] right-[-120px] w-[450px] h-[450px] bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute top-[35%] left-[45%] w-[250px] h-[250px] bg-purple-300/30 rounded-full blur-3xl"></div>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-cyan-200 shadow-lg">

            <Sparkles className="text-cyan-600" size={18} />

            <span className="text-sm font-semibold tracking-[3px] uppercase text-cyan-700">
              Smart Hospital System
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black">

            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hospital Registration
            </span>
          </h1>

          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Premium Healthcare Management Registration Interface
          </p>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[35px] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
        >

          {/* Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

          <div className="p-5 sm:p-8 lg:p-12 space-y-10">

            {/* Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6">

              <label className="relative group cursor-pointer">

                <input
                  type="file"
                  onChange={handleImage}
                  className="hidden"
                />

                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Hospital"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="text-white" size={38} />
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-3xl flex items-center justify-center text-white font-semibold text-sm">
                  Upload Logo
                </div>
              </label>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Upload Hospital Logo
                </h2>

                <p className="text-gray-500 mt-2">
                  Add your hospital logo or profile image
                </p>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left */}
              <Section
                title="Hospital Information"
                icon={<Building2 size={18} />}
              >

                <Input
                  icon={<Building2 size={18} />}
                  name="hospitalName"
                  placeholder="Hospital Name"
                  onChange={handleChange}
                />

                <Input
                  icon={<User size={18} />}
                  name="ownerName"
                  placeholder="Owner Name"
                  onChange={handleChange}
                />

                <Input
                  icon={<Mail size={18} />}
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                />

                <Input
                  icon={<Phone size={18} />}
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                />

                <Input
                  icon={<Phone size={18} />}
                  name="emergencyPhone"
                  placeholder="Emergency Phone"
                  onChange={handleChange}
                />

                <Input
                  icon={<Globe size={18} />}
                  name="website"
                  placeholder="Website URL"
                  onChange={handleChange}
                />
              </Section>

              {/* Right */}
              <Section
                title="Security & Address"
                icon={<Lock size={18} />}
              >

                <Input
                  type="password"
                  icon={<Lock size={18} />}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />

                <Input
                  type="password"
                  icon={<Lock size={18} />}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="state"
                  placeholder="State"
                  onChange={handleChange}
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={handleChange}
                />
              </Section>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left */}
              <Section
                title="Hospital Details"
                icon={<BadgeCheck size={18} />}
              >

                <Input
                  icon={<BadgeCheck size={18} />}
                  name="licenseNumber"
                  placeholder="License Number"
                  onChange={handleChange}
                />

                <Input
                  icon={<Calendar size={18} />}
                  name="establishedYear"
                  placeholder="Established Year"
                  onChange={handleChange}
                />

                <Input
                  icon={<Stethoscope size={18} />}
                  name="totalDoctors"
                  placeholder="Total Doctors"
                  onChange={handleChange}
                />

                <Input
                  icon={<BedDouble size={18} />}
                  name="totalBeds"
                  placeholder="Total Beds"
                  onChange={handleChange}
                />

                <Select
                  name="hospitalType"
                  onChange={handleChange}
                >
                  <option>General</option>
                  <option>Specialized</option>
                  <option>Clinic</option>
                  <option>Diagnostic</option>
                  <option>Dental</option>
                </Select>
              </Section>

              {/* Right */}
              <Section
                title="Subscription Plan"
                icon={<CreditCard size={18} />}
              >

                <Select
                  name="subscriptionPlan"
                  onChange={handleChange}
                >
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </Select>

                <Select
                  name="subscriptionMonths"
                  onChange={handleChange}
                >
                  <option value={1}>1 Month</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                </Select>

                <div className="rounded-3xl p-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-xl">

                  <p className="text-sm uppercase tracking-[3px] opacity-80">
                    Subscription Amount
                  </p>

                  <h2 className="text-4xl font-black mt-2">
                    ৳ {amount}
                  </h2>

                  <p className="mt-3 text-sm opacity-80">
                    Premium healthcare platform access
                  </p>
                </div>
              </Section>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="relative overflow-hidden group w-full py-5 rounded-2xl font-bold text-xl text-white transition-all duration-500 hover:scale-[1.01]"
            >

              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]"></div>

              <span className="relative z-10">
                Register Hospital
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================================
   Components
================================ */

const Section = ({ title, icon, children }) => {
  return (
    <div className="relative rounded-3xl border border-white/60 bg-white/50 backdrop-blur-2xl p-6 shadow-lg">

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-100/20 to-blue-100/20"></div>

      <div className="relative z-10">

        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
            {icon}
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            {title}
          </h2>
        </div>

        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const Input = ({ icon, ...props }) => {
  return (
    <div className="flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

      <div className="px-4 text-cyan-600 flex items-center justify-center">
        {icon}
      </div>

      <input
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-gray-800 placeholder:text-gray-400"
      />
    </div>
  );
};

const Select = ({ children, ...props }) => {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-gray-200 bg-white/80 px-5 py-4 leading-normal outline-none text-gray-700 transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,200,255,0.25)]"
    >
      {children}
    </select>
  );
};