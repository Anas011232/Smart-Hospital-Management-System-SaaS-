// "use client";

// import { useState } from "react";
// import {
//   Mail,
//   Lock,
//   ShieldCheck,
//   Sparkles,
//   Activity,
//   UserCog,
// } from "lucide-react";

// // import Navbar from "@/components/Navbar";
// // import Footer from "@/components/Footer";

// export default function Login() {
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     role: "patient",
//   });

//   const handleLogin = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:5000/api/auth/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(form),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Login Failed");
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       if (data.user?.role === "hospital") {
//         window.location.href = "/hospital/dashboard";
//         return;
//       }

//       if (data.user?.role === "patient") {
//         window.location.href = "/patient-dashboard";
//         return;
//       }

//       if (data.user?.role === "doctor") {
//         window.location.href = "/doctor-dashboard";
//         return;
//       }

//       if (data.user?.role === "admin") {
//         window.location.href = "/admin-dashboard";
//         return;
//       }

//     } catch (err) {
//       console.error(err);
//       alert("Server Connection Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (

//     <div>
//       {/* <Navbar></Navbar> */}
//       <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 flex items-center justify-center px-4 py-10">

//         {/* Background */}
//         <div className="absolute inset-0 overflow-hidden">

//           <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>

//           <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>

//           <div className="absolute top-[40%] left-[45%] w-[220px] h-[220px] bg-purple-300/30 rounded-full blur-3xl"></div>

//         </div>




//         {/* Grid */}
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

//         {/* Card */}
//         <div className="relative z-10 w-full max-w-md">

//           <div className="relative overflow-hidden rounded-[35px] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">

//             {/* Top Glow */}
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

//             <div className="p-7 sm:p-10">

//               {/* Header */}
//               <div className="text-center mb-10">

//                 <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-cyan-200 shadow-lg">

//                   <Sparkles className="text-cyan-600" size={18} />

//                   <span className="text-xs font-semibold tracking-[3px] uppercase text-cyan-700">
//                     Secure Access
//                   </span>

//                 </div>

//                 <div className="mt-7 flex justify-center">

//                   <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">

//                     <ShieldCheck className="text-white" size={38} />

//                   </div>

//                 </div>

//                 <h1 className="mt-6 text-4xl font-black">

//                   <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
//                     Welcome Back
//                   </span>

//                 </h1>

//                 <p className="mt-3 text-gray-600 text-sm">
//                   Login to continue your healthcare journey
//                 </p>

//               </div>

//               {/* Inputs */}
//               <div className="space-y-5">

//                 <Input
//                   icon={<Mail size={18} />}
//                   type="email"
//                   placeholder="Email Address"
//                   value={form.email}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       email: e.target.value,
//                     })
//                   }
//                 />

//                 <Input
//                   icon={<Lock size={18} />}
//                   type="password"
//                   placeholder="Password"
//                   value={form.password}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       password: e.target.value,
//                     })
//                   }
//                 />

//                 {/* Role Select */}
//                 <div className="flex items-center rounded-2xl border border-gray-200 bg-white/80 overflow-hidden transition-all duration-300 focus-within:border-cyan-400">

//                   <div className="px-4 text-cyan-600 flex items-center justify-center">
//                     <UserCog size={18} />
//                   </div>

//                   <select
//                     value={form.role}
//                     onChange={(e) =>
//                       setForm({
//                         ...form,
//                         role: e.target.value,
//                       })
//                     }
//                     className="w-full bg-transparent px-4 py-4 outline-none text-gray-800"
//                   >
//                     <option value="patient">Patient</option>
//                     <option value="hospital">Hospital</option>
//                     <option value="doctor">Doctor</option>
//                     <option value="admin">Admin</option>
//                   </select>

//                 </div>

//               </div>

//               {/* Login Button */}
//               <button
//                 onClick={handleLogin}
//                 disabled={loading}
//                 className="relative overflow-hidden group w-full mt-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
//               >

//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]"></div>

//                 <span className="relative z-10 flex items-center justify-center gap-2">

//                   <Activity size={18} />

//                   {loading ? "Logging in..." : "Login"}

//                 </span>

//               </button>

//               <p className="text-center text-sm text-gray-500 mt-6">
//                 Secure Healthcare Authentication System
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* <Footer></Footer> */}

//     </div>

//   );
// }

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


"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  ShieldCheck,
  Sparkles,
  Activity,
  UserCog,
} from "lucide-react";
import Navbar from "../../../components/Navbar.jsx";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login Failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "hospital") {
        window.location.href = "/hospital/dashboard";
        return;
      }

      if (data.user?.role === "patient") {
        window.location.href = "/patient-dashboard";
        return;
      }

      if (data.user?.role === "doctor") {
        window.location.href = "/doctor-dashboard";
        return;
      }

      if (data.user?.role === "admin") {
        window.location.href = "/admin-dashboard";
        return;
      }

    } catch (err) {
      console.error(err);
      alert("Server Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  // Pre-defined deterministic particle positions (NO Math.random - fixes hydration error)
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
    { left: "48%", top: "28%", delay: "4s" },
    { left: "72%", top: "88%", delay: "7s" },
    { left: "28%", top: "42%", delay: "10s" },
    { left: "93%", top: "68%", delay: "13s" },
    { left: "18%", top: "92%", delay: "16s" },
    { left: "62%", top: "3%", delay: "19s" },
    { left: "44%", top: "78%", delay: "22s" },
    { left: "77%", top: "52%", delay: "25s" },
    { left: "33%", top: "12%", delay: "28s" },
    { left: "86%", top: "95%", delay: "31s" },
    { left: "8%", top: "38%", delay: "34s" },
    { left: "59%", top: "67%", delay: "37s" },
    { left: "96%", top: "22%", delay: "40s" },
    { left: "23%", top: "58%", delay: "43s" },
    { left: "51%", top: "48%", delay: "46s" },
  ];

  return (

    <div> 

      <div>
        <Navbar></Navbar>
      </div>

    <div className="min-h-screen relative overflow-hidden pt-25 bg-slate-950 flex items-center justify-center px-4 py-10">
      {/* Orbit Ring Container - ALL ANIMATIONS WORKING */}

      

      <div className="relative">
        {/* Outer Large Blurred Glow Ring */}
        <div className="absolute -inset-12 opacity-40 hover:opacity-70 transition-opacity duration-500">
          <div 
            className="absolute inset-0 rounded-[4rem] animate-[rotate-360_15s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(59,130,246,0.3) 50%, transparent 60%, transparent 100%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div 
            className="absolute inset-0 rounded-[4rem] animate-[rotate-360_15s_linear_infinite_0.5s]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(139,92,246,0.25) 50%, transparent 60%, transparent 100%)',
              filter: 'blur(25px)'
            }}
          ></div>
          <div 
            className="absolute inset-0 rounded-[4rem] animate-[rotate-360_15s_linear_infinite_1s]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(6,182,212,0.2) 50%, transparent 60%, transparent 100%)',
              filter: 'blur(30px)'
            }}
          ></div>
        </div>

        {/* Middle Medium Intensity Neon Ring */}
        <div className="absolute -inset-8 opacity-50 hover:opacity-80 transition-opacity duration-500">
          <div 
            className="absolute inset-0 rounded-[3.5rem] animate-[rotate-360_12s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 35%, rgba(59,130,246,0.45) 45%, rgba(139,92,246,0.4) 50%, rgba(6,182,212,0.35) 55%, transparent 65%, transparent 100%)',
              filter: 'blur(12px)'
            }}
          ></div>
          <div 
            className="absolute inset-0 rounded-[3.5rem] animate-[rotate-360_12s_linear_infinite_0.7s]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 35%, rgba(148,163,184,0.35) 45%, rgba(59,130,246,0.3) 50%, transparent 65%, transparent 100%)',
              filter: 'blur(15px)'
            }}
          ></div>
        </div>

        {/* Inner Subtle Soft Glow Ring */}
        <div className="absolute -inset-4 opacity-60 hover:opacity-90 transition-opacity duration-500">
          <div 
            className="absolute inset-0 rounded-[3rem] animate-[rotate-360_10s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 30%, rgba(59,130,246,0.5) 40%, rgba(139,92,246,0.45) 50%, rgba(6,182,212,0.4) 60%, transparent 70%, transparent 100%)',
              filter: 'blur(8px)'
            }}
          ></div>
        </div>

        {/* Energy Particle Trail - ALL 3 PARTICLES WITH DELAY */}
        <div className="absolute -inset-6 opacity-30 hover:opacity-60 transition-opacity duration-500">
          <div 
            className="absolute inset-0 rounded-[3.2rem] animate-[rotate-360_10s_linear_infinite]"
          >
            <div className="absolute w-3 h-3 bg-blue-400 rounded-full blur-sm shadow-[0_0_40px_4px_rgba(59,130,246,0.9)]" style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
          </div>
          <div 
            className="absolute inset-0 rounded-[3.2rem] animate-[rotate-360_10s_linear_infinite_1.2s]"
          >
            <div className="absolute w-3 h-3 bg-violet-400 rounded-full blur-sm shadow-[0_0_40px_4px_rgba(139,92,246,0.9)]" style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
          </div>
          <div 
            className="absolute inset-0 rounded-[3.2rem] animate-[rotate-360_10s_linear_infinite_2.4s]"
          >
            <div className="absolute w-3 h-3 bg-cyan-400 rounded-full blur-sm shadow-[0_0_40px_4px_rgba(6,182,212,0.9)]" style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
          </div>
        </div>

        {/* Pulsing Aura Under Card */}
        <div className="absolute -inset-14 opacity-20 hover:opacity-40 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-[4.5rem] bg-gradient-to-t from-blue-500/15 via-violet-500/10 to-transparent blur-3xl animate-[pulse-aura_5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* Background Decorative Elements - ALL ANIMATIONS */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-violet-500/6 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-cyan-500/8 rounded-full blur-3xl animate-[float_16s_ease-in-out_infinite]"></div>
        <div className="absolute top-[60%] left-[50%] w-[250px] h-[250px] bg-purple-500/6 rounded-full blur-3xl animate-[float_13s_ease-in-out_infinite_reverse]"></div>

        {/* Particle Dots - DETERMINISTIC (NO Math.random) - ANIMATION STILL WORKS */}
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

      {/* Login Card - ALL ANIMATIONS */}
      <div className="relative z-10 w-full max-w-md">
        <div 
          className="relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-700/30 shadow-[0_20px_80px_rgba(37,99,235,0.12)] animate-[card-enter_1s_ease-out] hover:shadow-[0_25px_100px_rgba(37,99,235,0.25)] hover:border-slate-600/50 transition-all duration-500"
        >
          {/* Top Glow - ANIMATED */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 animate-[shimmer_3s_linear_infinite] bg-[size:200%_100%]"></div>

          <div className="p-7 sm:p-10">
            {/* Header - ALL ANIMATIONS */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 shadow-lg animate-[badge-float_3s_ease-in-out_infinite] hover:border-blue-500/40 transition-all duration-300">
                <Sparkles className="text-blue-400 animate-[sparkle_2s_ease-in-out_infinite]" size={18} />
                <span className="text-xs font-semibold tracking-[3px] uppercase text-blue-400">
                  Secure Access
                </span>
              </div>

              <div className="mt-7 flex justify-center">
                <div className="relative">
                  {/* Rotating Rings - ANIMATED */}
                  <div className="absolute inset-0 w-20 h-20 rounded-3xl border border-blue-500/20 animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-0 w-20 h-20 rounded-3xl border border-violet-500/15 animate-[spin_8s_linear_infinite_reverse]"></div>
                  
                  {/* Main Logo - ALL ANIMATIONS */}
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-2xl animate-[logo-bounce_4s_ease-in-out_infinite] hover:scale-110 transition-all duration-300">
                    <ShieldCheck className="text-white animate-[icon-pulse_2s_ease-in-out_infinite]" size={38} />
                  </div>

                  {/* Glow Effect - ANIMATED */}
                  <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-cyan-500/30 blur-xl animate-[glow_3s_ease-in-out_infinite]"></div>
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-black animate-[title-slide_1s_ease-out]">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_6s_ease-in-out_infinite] bg-[size:200%_100%]">
                  Welcome Back
                </span>
              </h1>

              <p className="mt-3 text-slate-400 text-sm animate-[subtitle-slide_1.2s_ease-out]">
                Login to continue your healthcare journey
              </p>
            </div>

            {/* Inputs - ALL ANIMATIONS */}
            <div className="space-y-5">
              <Input
                icon={<Mail className="animate-[icon-fade_2s_ease-in-out_infinite]" size={18} />}
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <Input
                icon={<Lock className="animate-[icon-fade_2s_ease-in-out_infinite_1s]" size={18} />}
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              {/* Role Select - ANIMATED */}
              <div className="flex items-center rounded-2xl border border-slate-700/30 bg-slate-900/60 overflow-hidden transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 animate-[input-slide_1.4s_ease-out] hover:border-slate-600/50">
                <div className="px-4 text-blue-400 flex items-center justify-center animate-[icon-fade_2s_ease-in-out_infinite_2s]">
                  <UserCog size={18} />
                </div>

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                  className="w-full bg-transparent px-4 py-4 outline-none text-white cursor-pointer hover:bg-slate-800/50 transition-all duration-200"
                >
                  <option value="patient" className="bg-slate-900">Patient</option>
                  <option value="hospital" className="bg-slate-900">Hospital</option>
                  <option value="doctor" className="bg-slate-900">Doctor</option>
                  <option value="admin" className="bg-slate-900">Admin</option>
                </select>
              </div>
            </div>

            {/* Login Button - ALL ANIMATIONS */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="relative overflow-hidden group w-full mt-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed animate-[button-slide_1.6s_ease-out] hover:shadow-[0_8px_40px_rgba(37,99,235,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 animate-[gradient-shift_6s_ease-in-out_infinite] bg-[size:200%_100%]"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] animate-[shimmer_2s_linear_infinite]"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Activity className="animate-[activity-spin_2s_linear_infinite]" size={18} />
                {loading ? "Logging in..." : "Login"}
              </span>

              {loading && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 overflow-hidden">
                  <div className="h-full bg-white animate-[progress_1s_linear_infinite] w-[20%]"></div>
                </div>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 mt-6 animate-[footer-slide_1.8s_ease-out]">
              Secure Healthcare Authentication System
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* ALL ANIMATIONS KEPT - Only removed Math.random() */}
      <style jsx>{`
        @keyframes rotate-360 {
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
        
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
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
        
        @keyframes logo-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes title-slide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes subtitle-slide {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes input-slide {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes button-slide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes footer-slide {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes icon-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes activity-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        
        @keyframes pulse-aura {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}

const Input = ({ icon, ...props }) => {
  return (
    <div className="flex items-center rounded-2xl border border-slate-700/30 bg-slate-900/60 overflow-hidden transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 hover:border-slate-600/50 hover:bg-slate-900/80">
      <div className="px-4 text-blue-400 flex items-center justify-center transition-all duration-300 hover:text-blue-300">
        {icon}
      </div>

      <input
        {...props}
        className="w-full bg-transparent px-4 py-4 leading-normal outline-none text-white placeholder:text-slate-500 transition-all duration-200"
      />
    </div>
  );
};