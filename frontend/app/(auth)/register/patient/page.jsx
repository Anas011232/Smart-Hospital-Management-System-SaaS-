// "use client";

// import { useState } from "react";
// import {
//   User,
//   Mail,
//   Phone,
//   Lock,
//   MapPin,
//   HeartPulse,
//   ShieldCheck,
//   CalendarDays,
//   VenusAndMars,
//   Droplets,
//   FileText,
//   Users,
//   Sparkles,
//   Activity,
// } from "lucide-react";

// export default function PatientRegister() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     gender: "",
//     dateOfBirth: "",
//     address: "",
//     bloodGroup: "",
//     allergies: "",
//     medicalHistory: "",
//     emergencyName: "",
//     emergencyPhone: "",
//     emergencyRelation: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     const res = await fetch(
//       "http://localhost:5000/api/patient/register",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       alert("Patient Registered Successfully ✅");

//       window.location.href = "/patient-dashboard";
//       return;
//     }

//     alert(data.message || "Registration Failed ❌");

//   } catch (err) {
//     console.log(err);
//     alert("Something went wrong ❌");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100">

//       {/* Background */}
//       <div className="absolute inset-0 overflow-hidden">

//         <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>

//         <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>

//         <div className="absolute top-[40%] left-[45%] w-[250px] h-[250px] bg-purple-300/30 rounded-full blur-3xl"></div>
//       </div>

//       {/* Grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 sm:py-14">

//         {/* Header */}
//         <div className="text-center mb-10 sm:mb-14">

//           <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-cyan-200 shadow-lg">

//             <Sparkles className="text-cyan-600" size={18} />

//             <span className="text-xs sm:text-sm font-semibold tracking-[3px] uppercase text-cyan-700">
//               Smart Healthcare System
//             </span>
//           </div>

//           <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">

//             <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Patient Registration
//             </span>
//           </h1>

//           <p className="text-gray-600 mt-4 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
//             Modern responsive healthcare registration interface
//           </p>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="relative rounded-[35px] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden"
//         >

//           {/* Top Border */}
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 p-5 sm:p-8 lg:p-12">

//             {/* Left */}
//             <div className="space-y-7">

//               <Section
//                 title="Basic Information"
//                 icon={<User size={18} />}
//               >

//                 <Input
//                   icon={<User size={18} />}
//                   name="name"
//                   placeholder="Full Name"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Mail size={18} />}
//                   name="email"
//                   type="email"
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
//                   icon={<Lock size={18} />}
//                   name="password"
//                   type="password"
//                   placeholder="Password"
//                   onChange={handleChange}
//                 />
//               </Section>

//               <Section
//                 title="Profile Details"
//                 icon={<Activity size={18} />}
//               >

//                 <Select
//                   icon={<VenusAndMars size={18} />}
//                   name="gender"
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </Select>

//                 <Input
//                   icon={<CalendarDays size={18} />}
//                   type="date"
//                   name="dateOfBirth"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<MapPin size={18} />}
//                   name="address"
//                   placeholder="Residential Address"
//                   onChange={handleChange}
//                 />
//               </Section>
//             </div>

//             {/* Right */}
//             <div className="space-y-7">

//               <Section
//                 title="Medical Information"
//                 icon={<HeartPulse size={18} />}
//               >

//                 <Input
//                   icon={<Droplets size={18} />}
//                   name="bloodGroup"
//                   placeholder="Blood Group"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<ShieldCheck size={18} />}
//                   name="allergies"
//                   placeholder="Allergies"
//                   onChange={handleChange}
//                 />

//                 <Textarea
//                   icon={<FileText size={18} />}
//                   name="medicalHistory"
//                   placeholder="Medical History"
//                   onChange={handleChange}
//                 />
//               </Section>

//               <Section
//                 title="Emergency Contact"
//                 icon={<Phone size={18} />}
//               >

//                 <Input
//                   icon={<User size={18} />}
//                   name="emergencyName"
//                   placeholder="Emergency Contact Name"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Phone size={18} />}
//                   name="emergencyPhone"
//                   placeholder="Emergency Phone"
//                   onChange={handleChange}
//                 />

//                 <Input
//                   icon={<Users size={18} />}
//                   name="emergencyRelation"
//                   placeholder="Relation"
//                   onChange={handleChange}
//                 />
//               </Section>
//             </div>
//           </div>

//           {/* Button */}
//           <div className="px-5 sm:px-8 lg:px-12 pb-10">

//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative overflow-hidden w-full py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl text-white transition-all duration-500 hover:scale-[1.01] active:scale-[0.99]"
//             >

//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

//               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]"></div>

//               <span className="relative z-10">
//                 {loading ? "Registering..." : "Register Patient"}
//               </span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    Reusable Components
// ========================= */

// const Section = ({ title, icon, children }) => {
//   return (
//     <div className="relative rounded-3xl border border-white/60 bg-white/50 backdrop-blur-2xl p-5 sm:p-6 shadow-lg">

//       <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-100/20 to-blue-100/20"></div>

//       <div className="relative z-10">

//         <div className="flex items-center gap-3 mb-5">

//           <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
//             {icon}
//           </div>

//           <h2 className="text-lg sm:text-xl font-bold text-gray-800">
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
//     <div className="group flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

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

// const Select = ({ icon, children, ...props }) => {
//   return (
//     <div className="flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

//       <div className="px-4 text-cyan-600 flex items-center justify-center">
//         {icon}
//       </div>

//       <select
//         {...props}
//         className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-gray-700"
//       >
//         {children}
//       </select>
//     </div>
//   );
// };

// const Textarea = ({ icon, ...props }) => {
//   return (
//     <div className="flex items-start rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,200,255,0.25)]">

//       <div className="px-4 pt-5 text-cyan-600">
//         {icon}
//       </div>

//       <textarea
//         rows={5}
//         {...props}
//         className="w-full bg-transparent px-4 py-4 leading-normal outline-none resize-none text-gray-800 placeholder:text-gray-400"
//       />
//     </div>
//   );
// };


"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  HeartPulse,
  ShieldCheck,
  CalendarDays,
  VenusAndMars,
  Droplets,
  FileText,
  Users,
  Sparkles,
  Activity,
} from "lucide-react";
import Navbar from "../../../../components/Navbar";
export default function PatientRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/patient/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Patient Registered Successfully ✅");

        window.location.href = "/patient-dashboard";
        return;
      }

      alert(data.message || "Registration Failed ❌");

    } catch (err) {
      console.log(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
        <div> 

      <div>
        <Navbar></Navbar>
      </div>
    <div className="min-h-screen pt-18 relative overflow-hidden bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-violet-500/6 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-cyan-500/8 rounded-full blur-3xl animate-[float_16s_ease-in-out_infinite]"></div>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 shadow-lg animate-[badge-float_3s_ease-in-out_infinite]">
            <Sparkles className="text-blue-400 animate-[sparkle_2s_ease-in-out_infinite]" size={18} />
            <span className="text-xs sm:text-sm font-semibold tracking-[3px] uppercase text-blue-400">
              Smart Healthcare System
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight animate-[title-slide_1s_ease-out]">
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_6s_ease-in-out_infinite] bg-[size:200%_100%]">
              Patient Registration
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto animate-[subtitle-slide_1.2s_ease-out]">
            Modern responsive healthcare registration interface
          </p>
        </div>

        {/* Form with Orbit Border */}
        <form
          onSubmit={handleSubmit}
          className="relative rounded-[32px] bg-slate-900/60 backdrop-blur-2xl shadow-[0_20px_80px_rgba(37,99,235,0.12)] overflow-hidden animate-[card-enter_1s_ease-out] hover:shadow-[0_25px_100px_rgba(37,99,235,0.25)] transition-all duration-500"
        >
          {/* Primary Border (Static Dark) */}
          <div className="absolute inset-0 rounded-[32px] border border-slate-700/30 pointer-events-none"></div>

          {/* Orbit Ring Container */}
          <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
            {/* Outer Blurred Glow Trail */}
            <div 
              className="absolute inset-[-2px] rounded-[33px] animate-[orbit-border_8s_linear_infinite]"
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 p-5 sm:p-8 lg:p-12">
            {/* Left */}
            <div className="space-y-7">
              <Section
                title="Basic Information"
                icon={<User size={18} />}
                iconColor="blue"
              >
                <Input
                  icon={<User size={18} />}
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<Mail size={18} />}
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<Phone size={18} />}
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<Lock size={18} />}
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  iconColor="emerald"
                />
              </Section>

              <Section
                title="Profile Details"
                icon={<Activity size={18} />}
                iconColor="violet"
              >
                <Select
                  icon={<VenusAndMars size={18} />}
                  name="gender"
                  onChange={handleChange}
                  iconColor="blue"
                >
                  <option value="" className="bg-slate-900">Select Gender</option>
                  <option value="male" className="bg-slate-900">Male</option>
                  <option value="female" className="bg-slate-900">Female</option>
                </Select>

                <Input
                  icon={<CalendarDays size={18} />}
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<MapPin size={18} />}
                  name="address"
                  placeholder="Residential Address"
                  onChange={handleChange}
                  iconColor="emerald"
                />
              </Section>
            </div>

            {/* Right */}
            <div className="space-y-7">
              <Section
                title="Medical Information"
                icon={<HeartPulse size={18} />}
                iconColor="emerald"
              >
                <Input
                  icon={<Droplets size={18} />}
                  name="bloodGroup"
                  placeholder="Blood Group"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<ShieldCheck size={18} />}
                  name="allergies"
                  placeholder="Allergies"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Textarea
                  icon={<FileText size={18} />}
                  name="medicalHistory"
                  placeholder="Medical History"
                  onChange={handleChange}
                  iconColor="emerald"
                />
              </Section>

              <Section
                title="Emergency Contact"
                icon={<Phone size={18} />}
                iconColor="blue"
              >
                <Input
                  icon={<User size={18} />}
                  name="emergencyName"
                  placeholder="Emergency Contact Name"
                  onChange={handleChange}
                  iconColor="blue"
                />

                <Input
                  icon={<Phone size={18} />}
                  name="emergencyPhone"
                  placeholder="Emergency Phone"
                  onChange={handleChange}
                  iconColor="violet"
                />

                <Input
                  icon={<Users size={18} />}
                  name="emergencyRelation"
                  placeholder="Relation"
                  onChange={handleChange}
                  iconColor="emerald"
                />
              </Section>
            </div>
          </div>

          {/* Button */}
          <div className="px-5 sm:px-8 lg:px-12 pb-10">
            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden w-full py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl text-white transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_8px_40px_rgba(37,99,235,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 animate-[gradient-shift_6s_ease-in-out_infinite] bg-[size:200%_100%]"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] animate-[shimmer_2s_linear_infinite]"></div>
              <span className="relative z-10">
                {loading ? "Registering..." : "Register Patient"}
              </span>

              {loading && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 overflow-hidden">
                  <div className="h-full bg-white animate-[progress_1s_linear_infinite] w-[20%]"></div>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes orbit-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>
    </div>
  );
}

/* =========================
   Reusable Components
========================= */

const Section = ({ title, icon, iconColor, children }) => {
  const iconBgColors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="relative rounded-2xl border border-slate-700/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-lg hover:border-slate-600/50 transition-all duration-300">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-3 rounded-xl ${iconBgColors[iconColor]} border shadow-lg`}>
            {icon}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
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

const Select = ({ icon, iconColor, children, ...props }) => {
  const iconColors = {
    blue: "text-blue-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="flex items-center rounded-xl border border-slate-700/30 bg-slate-900/60 overflow-hidden transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 hover:border-slate-600/50">
      <div className={`px-4 ${iconColors[iconColor]} flex items-center justify-center transition-all duration-300 hover:opacity-80`}>
        {icon}
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

const Textarea = ({ icon, iconColor, ...props }) => {
  const iconColors = {
    blue: "text-blue-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="flex items-start rounded-xl border border-slate-700/30 bg-slate-900/60 overflow-hidden transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 hover:border-slate-600/50">
      <div className={`px-4 pt-5 ${iconColors[iconColor]} transition-all duration-300 hover:opacity-80`}>
        {icon}
      </div>

      <textarea
        rows={5}
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none resize-none text-white placeholder:text-slate-500"
      />
    </div>
  );
};

