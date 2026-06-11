// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Building2,
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Globe,
//   MapPin,
//   BedDouble,
//   Stethoscope,
//   BadgeCheck,
//   Calendar,
//   ImagePlus,
//   CreditCard,
//   Sparkles,
// } from "lucide-react";

// export default function HospitalRegister() {
//   const router = useRouter();

//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   const [form, setForm] = useState({
//     hospitalName: "",
//     ownerName: "",
//     email: "",
//     phone: "",
//     emergencyPhone: "",
//     password: "",
//     confirmPassword: "",
//     website: "",
//     address: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "Bangladesh",
//     hospitalType: "General",
//     licenseNumber: "",
//     establishedYear: "",
//     totalDoctors: 0,
//     totalBeds: 0,
//     subscriptionPlan: "Basic",
//     subscriptionMonths: 1,
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImage = (e) => {
//     const file = e.target.files[0];

//     setImage(file);

//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (form.password !== form.confirmPassword) {
//       return alert("Passwords not match");
//     }

//     const fd = new FormData();

//     Object.keys(form).forEach((key) => {
//       fd.append(key, form[key]);
//     });

//     fd.append("image", image);

//     const res = await fetch(
//       "http://localhost:5000/api/hospital/register",
//       {
//         method: "POST",
//         body: fd,
//       }
//     );

//     const data = await res.json();

//     if (!data.success) return alert(data.message);

//     localStorage.setItem("token", data.token);

//     localStorage.setItem("hospitalId", data.hospital._id);

//     router.push("/hospital/dashboard");
//   };

//   const amount = form.subscriptionMonths * 1000;

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 py-10 px-4">

//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden">

//         <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>

//         <div className="absolute bottom-[-180px] right-[-120px] w-[450px] h-[450px] bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>

//         <div className="absolute top-[35%] left-[45%] w-[250px] h-[250px] bg-purple-300/30 rounded-full blur-3xl"></div>
//       </div>

//       {/* Grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

//       <div className="relative z-10 max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-10">

//           <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-cyan-200 shadow-lg">

//             <Sparkles className="text-cyan-600" size={18} />

//             <span className="text-sm font-semibold tracking-[3px] uppercase text-cyan-700">
//               Smart Hospital System
//             </span>
//           </div>

//           <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black">

//             <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Hospital Registration
//             </span>
//           </h1>

//           <p className="mt-4 text-gray-600 text-sm sm:text-base">
//             Premium Healthcare Management Registration Interface
//           </p>
//         </div>

//         {/* Main Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="relative overflow-hidden rounded-[35px] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
//         >

//           {/* Top Border */}
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

//           <div className="p-5 sm:p-8 lg:p-12 space-y-10">

//             {/* Upload */}
//             <div className="flex flex-col sm:flex-row items-center gap-6">

//               <label className="relative group cursor-pointer">

//                 <input
//                   type="file"
//                   onChange={handleImage}
//                   className="hidden"
//                 />

//                 <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">

//                   {preview ? (
//                     <img
//                       src={preview}
//                       alt="Hospital"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <ImagePlus className="text-white" size={38} />
//                   )}
//                 </div>

//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-3xl flex items-center justify-center text-white font-semibold text-sm">
//                   Upload Logo
//                 </div>
//               </label>

//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   Upload Hospital Logo
//                 </h2>

//                 <p className="text-gray-500 mt-2">
//                   Add your hospital logo or profile image
//                 </p>
//               </div>
//             </div>

//             {/* Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//               {/* Left */}
//               <Section
//                 title="Hospital Information"
//                 icon={<Building2 size={18} />}
//               >

//                 <Input
//                   icon={<Building2 size={18} />}
//                   name="hospitalName"
//                   placeholder="Hospital Name"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<User size={18} />}
//                   name="ownerName"
//                   placeholder="Owner Name"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Mail size={18} />}
//                   name="email"
//                   placeholder="Email Address"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Phone size={18} />}
//                   name="phone"
//                   placeholder="Phone Number"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Phone size={18} />}
//                   name="emergencyPhone"
//                   placeholder="Emergency Phone"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Globe size={18} />}
//                   name="website"
//                   placeholder="Website URL"
//                   onChange={handleChange}
//                 />
//               </Section>

//               {/* Right */}
//               <Section
//                 title="Security & Address"
//                 icon={<Lock size={18} />}
//               >

//                 <Input
//                   type="password"
//                   icon={<Lock size={18} />}
//                   name="password"
//                   placeholder="Password"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   type="password"
//                   icon={<Lock size={18} />}
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<MapPin size={18} />}
//                   name="address"
//                   placeholder="Address"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<MapPin size={18} />}
//                   name="city"
//                   placeholder="City"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<MapPin size={18} />}
//                   name="state"
//                   placeholder="State"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<MapPin size={18} />}
//                   name="postalCode"
//                   placeholder="Postal Code"
//                   onChange={handleChange}
//                 />
//               </Section>
//             </div>

//             {/* Bottom Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//               {/* Left */}
//               <Section
//                 title="Hospital Details"
//                 icon={<BadgeCheck size={18} />}
//               >

//                 <Input
//                   icon={<BadgeCheck size={18} />}
//                   name="licenseNumber"
//                   placeholder="License Number"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Calendar size={18} />}
//                   name="establishedYear"
//                   placeholder="Established Year"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Stethoscope size={18} />}
//                   name="totalDoctors"
//                   placeholder="Total Doctors"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<BedDouble size={18} />}
//                   name="totalBeds"
//                   placeholder="Total Beds"
//                   onChange={handleChange}
//                 />

//                 <Select
//                   name="hospitalType"
//                   onChange={handleChange}
//                 >
//                   <option>General</option>
//                   <option>Specialized</option>
//                   <option>Clinic</option>
//                   <option>Diagnostic</option>
//                   <option>Dental</option>
//                 </Select>
//               </Section>

//               {/* Right */}
//               <Section
//                 title="Subscription Plan"
//                 icon={<CreditCard size={18} />}
//               >

//                 <Select
//                   name="subscriptionPlan"
//                   onChange={handleChange}
//                 >
//                   <option>Basic</option>
//                   <option>Standard</option>
//                   <option>Premium</option>
//                 </Select>

//                 <Select
//                   name="subscriptionMonths"
//                   onChange={handleChange}
//                 >
//                   <option value={1}>1 Month</option>
//                   <option value={2}>2 Months</option>
//                   <option value={3}>3 Months</option>
//                   <option value={6}>6 Months</option>
//                 </Select>

//                 <div className="rounded-3xl p-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-xl">

//                   <p className="text-sm uppercase tracking-[3px] opacity-80">
//                     Subscription Amount
//                   </p>

//                   <h2 className="text-4xl font-black mt-2">
//                     ৳ {amount}
//                   </h2>

//                   <p className="mt-3 text-sm opacity-80">
//                     Premium healthcare platform access
//                   </p>
//                 </div>
//               </Section>
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               className="relative overflow-hidden group w-full py-5 rounded-2xl font-bold text-xl text-white transition-all duration-500 hover:scale-[1.01]"
//             >

//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

//               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]"></div>

//               <span className="relative z-10">
//                 Register Hospital
//               </span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ================================
//    Components
// ================================ */

// const Section = ({ title, icon, children }) => {
//   return (
//     <div className="relative rounded-3xl border border-white/60 bg-white/50 backdrop-blur-2xl p-6 shadow-lg">

//       <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-100/20 to-blue-100/20"></div>

//       <div className="relative z-10">

//         <div className="flex items-center gap-3 mb-6">

//           <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
//             {icon}
//           </div>

//           <h2 className="text-xl font-bold text-gray-800">
//             {title}
//           </h2>
//         </div>

//         <div className="space-y-4">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Input = ({ icon, ...props }) => {
//   return (
//     <div className="flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

//       <div className="px-4 text-cyan-600 flex items-center justify-center">
//         {icon}
//       </div>

//       <input
//         {...props}
//         className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-gray-800 placeholder:text-gray-400"
//       />
//     </div>
//   );
// };

// const Select = ({ children, ...props }) => {
//   return (
//     <select
//       {...props}
//       className="w-full rounded-2xl border border-gray-200 bg-white/80 px-5 py-4 leading-normal outline-none text-gray-700 transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,200,255,0.25)]"
//     >
//       {children}
//     </select>
//   );
// };

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

    localStorage.setItem("hospitalId", data.hospital._id);

    router.push("/hospital/dashboard");
  };

  const amount = form.subscriptionMonths * 1000;

  // Pre-defined deterministic particle positions (no Math.random())
  const particles = [
    { left: "10%", top: "20%", delay: "0s" },
    { left: "85%", top: "15%", delay: "3s" },
    { left: "30%", top: "70%", delay: "6s" },
    { left: "65%", top: "45%", delay: "9s" },
    { left: "90%", top: "80%", delay: "12s" },
    { left: "15%", top: "55%", delay: "15s" },
    { left: "75%", top: "25%", delay: "18s" },
    { left: "50%", top: "90%", delay: "21s" },
    { left: "20%", top: "85%", delay: "24s" },
    { left: "80%", top: "5%", delay: "27s" },
    { left: "40%", top: "35%", delay: "2s" },
    { left: "95%", top: "50%", delay: "5s" },
    { left: "5%", top: "65%", delay: "8s" },
    { left: "60%", top: "10%", delay: "11s" },
    { left: "25%", top: "95%", delay: "14s" },
    { left: "70%", top: "60%", delay: "17s" },
    { left: "35%", top: "40%", delay: "20s" },
    { left: "88%", top: "30%", delay: "23s" },
    { left: "12%", top: "75%", delay: "26s" },
    { left: "55%", top: "55%", delay: "1s" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 py-10 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-180px] right-[-120px] w-[450px] h-[450px] bg-violet-500/6 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[35%] left-[45%] w-[250px] h-[250px] bg-cyan-500/8 rounded-full blur-3xl animate-[float_16s_ease-in-out_infinite]"></div>
        <div className="absolute top-[60%] left-[50%] w-[250px] h-[250px] bg-emerald-500/6 rounded-full blur-3xl animate-[float_13s_ease-in-out_infinite_reverse]"></div>

        {/* Particle Dots (Deterministic - No Math.random()) */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-blue-400/15 rounded-full animate-[particle-fade_30s_linear_infinite]"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 shadow-lg animate-[badge-float_3s_ease-in-out_infinite]">
            <Sparkles className="text-blue-400 animate-[sparkle_2s_ease-in-out_infinite]" size={18} />
            <span className="text-sm font-semibold tracking-[3px] uppercase text-blue-400">
              Smart Hospital System
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black animate-[title-slide_1s_ease-out]">
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_6s_ease-in-out_infinite] bg-[size:200%_100%]">
              Hospital Registration
            </span>
          </h1>

          <p className="mt-4 text-slate-400 text-sm sm:text-base animate-[subtitle-slide_1.2s_ease-out]">
            Premium Healthcare Management Registration Interface
          </p>
        </div>

        {/* Main Form with Moving Orbit Border */}
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[32px] bg-slate-900/60 backdrop-blur-2xl shadow-[0_20px_80px_rgba(37,99,235,0.12)] animate-[card-enter_1s_ease-out] hover:shadow-[0_25px_100px_rgba(37,99,235,0.25)] transition-all duration-500"
        >
          {/* Primary Border (Static Dark) */}
          <div className="absolute inset-0 rounded-[32px] border border-slate-700/30 pointer-events-none"></div>

          {/* Moving Orbit Border Container */}
          <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
            {/* Outer Blurred Glow Trail */}
            <div 
              className="absolute inset-[-2px] rounded-[33px] animate-[orbit-border_8s_linear_infinite hover:hover:orbit-border-fast_4s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, transparent 85%, rgba(59,130,246,0.6) 90%, rgba(139,92,246,0.5) 92%, rgba(6,182,212,0.4) 94%, transparent 100%)',
                filter: 'blur(8px)'
              }}
            ></div>

            {/* Middle Intensity Ring */}
            <div 
              className="absolute inset-[-1px] rounded-[32.5px] animate-[orbit-border_8s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, transparent 88%, rgba(59,130,246,0.75) 91%, rgba(139,92,246,0.65) 93%, rgba(6,182,212,0.55) 95%, transparent 100%)',
                filter: 'blur(5px)'
              }}
            ></div>

            {/* Bright Moving Head */}
            <div 
              className="absolute inset-0 rounded-[32px] animate-[orbit-border_8s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, transparent 90%, rgba(59,130,246,1) 93%, rgba(139,92,246,0.9) 95%, rgba(6,182,212,0.8) 97%, transparent 100%)',
                filter: 'blur(2px)'
              }}
            ></div>

            {/* Inner Sharp Energy Line */}
            <div 
              className="absolute inset-0 rounded-[32px] animate-[orbit-border_8s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, transparent 92%, rgba(96,165,250,1) 94%, rgba(167,139,250,1) 96%, rgba(34,211,238,1) 98%, transparent 100%)',
              }}
            ></div>
          </div>

          {/* Pulsing Aura */}
          <div className="absolute inset-0 rounded-[32px] pointer-events-none">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-t from-blue-500/5 via-violet-500/3 to-transparent blur-2xl animate-[pulse-aura_4s_ease-in-out_infinite]"></div>
          </div>

          <div className="p-5 sm:p-8 lg:p-12 space-y-10">
            {/* Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <label className="relative group cursor-pointer">
                <input
                  type="file"
                  onChange={handleImage}
                  className="hidden"
                />

                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-700/30 shadow-xl bg-slate-900/60 flex items-center justify-center hover:border-blue-500/50 transition-all duration-300">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Hospital"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-3xl flex items-center justify-center w-full h-full">
                      <ImagePlus className="text-blue-400" size={38} />
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition rounded-3xl flex items-center justify-center text-blue-400 font-semibold text-sm">
                  Upload Logo
                </div>
              </label>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Upload Hospital Logo
                </h2>

                <p className="text-slate-400 mt-2">
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
                iconColor="blue"
              >
                <Input
                  icon={<Building2 size={18} />}
                  name="hospitalName"
                  placeholder="Hospital Name"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<User size={18} />}
                  name="ownerName"
                  placeholder="Owner Name"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<Mail size={18} />}
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<Phone size={18} />}
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  iconColor="emerald"
                />

                <Input
                  icon={<Phone size={18} />}
                  name="emergencyPhone"
                  placeholder="Emergency Phone"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<Globe size={18} />}
                  name="website"
                  placeholder="Website URL"
                  onChange={handleChange}
                  iconColor="blue"
                />
              </Section>

              {/* Right */}
              <Section
                title="Security & Address"
                icon={<Lock size={18} />}
                iconColor="emerald"
              >
                <Input
                  type="password"
                  icon={<Lock size={18} />}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  type="password"
                  icon={<Lock size={18} />}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  iconColor="emerald"
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="state"
                  placeholder="State"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={handleChange}
                  iconColor="emerald"
                />
              </Section>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left */}
              <Section
                title="Hospital Details"
                icon={<BadgeCheck size={18} />}
                iconColor="blue"
              >
                <Input
                  icon={<BadgeCheck size={18} />}
                  name="licenseNumber"
                  placeholder="License Number"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<Calendar size={18} />}
                  name="establishedYear"
                  placeholder="Established Year"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<Stethoscope size={18} />}
                  name="totalDoctors"
                  placeholder="Total Doctors"
                  onChange={handleChange}
                  iconColor="emerald"
                />

                <Input
                  icon={<BedDouble size={18} />}
                  name="totalBeds"
                  placeholder="Total Beds"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Select
                  name="hospitalType"
                  onChange={handleChange}
                  iconColor="violet"
                >
                  <option value="General" className="bg-slate-900">General</option>
                  <option value="Specialized" className="bg-slate-900">Specialized</option>
                  <option value="Clinic" className="bg-slate-900">Clinic</option>
                  <option value="Diagnostic" className="bg-slate-900">Diagnostic</option>
                  <option value="Dental" className="bg-slate-900">Dental</option>
                </Select>
              </Section>

              {/* Right */}
              <Section
                title="Subscription Plan"
                icon={<CreditCard size={18} />}
                iconColor="emerald"
              >
                <Select
                  name="subscriptionPlan"
                  onChange={handleChange}
                  iconColor="blue"
                >
                  <option value="Basic" className="bg-slate-900">Basic</option>
                  <option value="Standard" className="bg-slate-900">Standard</option>
                  <option value="Premium" className="bg-slate-900">Premium</option>
                </Select>

                <Select
                  name="subscriptionMonths"
                  onChange={handleChange}
                  iconColor="violet"
                >
                  <option value={1} className="bg-slate-900">1 Month</option>
                  <option value={2} className="bg-slate-900">2 Months</option>
                  <option value={3} className="bg-slate-900">3 Months</option>
                  <option value={6} className="bg-slate-900">6 Months</option>
                </Select>

                <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 text-white shadow-xl hover:scale-105 transition-all duration-300">
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
              className="relative overflow-hidden group w-full py-5 rounded-2xl font-bold text-xl text-white transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_8px_40px_rgba(37,99,235,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 animate-[gradient-shift_6s_ease-in-out_infinite] bg-[size:200%_100%]"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] animate-[shimmer_2s_linear_infinite]"></div>
              <span className="relative z-10">
                Register Hospital
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes orbit-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes hover:hover {
          @keyframes orbit-border-fast {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(5deg); }
          50% { transform: translate(-10px, 30px) rotate(-5deg); }
          75% { transform: translate(-20px, -10px) rotate(3deg); }
        }
        
        @keyframes particle-fade {
          0% { opacity: 0; transform: translateY(0); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-100vh); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes card-enter {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes badge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes title-slide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes subtitle-slide {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }
        
        @keyframes pulse-aura {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </div>
  );
}

/* ================================
   Components
================================ */

const Section = ({ title, icon, iconColor, children }) => {
  const iconBgColors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="relative rounded-2xl border border-slate-700/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-lg hover:border-slate-600/50 transition-all duration-300">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${iconBgColors[iconColor]} border shadow-lg`}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white">
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

const Input = ({ icon, iconColor, ...props }) => {
  const iconColors = {
    blue: "text-blue-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="group flex items-center rounded-xl border border-slate-700/30 bg-slate-900/60 overflow-hidden transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 hover:border-slate-600/50">
      <div className={`px-4 ${iconColors[iconColor]} flex items-center justify-center transition-all duration-300 hover:opacity-80`}>
        {icon}
      </div>

      <input
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-white placeholder:text-slate-500"
      />
    </div>
  );
};

const Select = ({ iconColor, children, ...props }) => {
  const iconColors = {
    blue: "text-blue-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="flex items-center rounded-xl border border-slate-700/30 bg-slate-900/60 overflow-hidden transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 hover:border-slate-600/50">
      <div className={`px-4 ${iconColors[iconColor]} flex items-center justify-center transition-all duration-300 hover:opacity-80`}>
        <CreditCard size={18} />
      </div>

      <select
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-white cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
};