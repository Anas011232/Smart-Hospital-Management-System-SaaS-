"use client";

import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.user?.role === "hospital") {
      window.location.href = "/hospital/dashboard";
    }

    if (data.user?.role === "patient") {
      window.location.href = "/patient-dashboard";
    }

     if (data.user?.role === "doctor") {
      window.location.href = "/doctor-dashboard";
    }



    if (data.user?.role === "admin") {
      window.location.href = "/admin-dashboard";
    }

    
  };

  return (
    <div>
      <h1>Login</h1>

      <input placeholder="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input type="password" placeholder="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="patient">Patient</option>
        <option value="hospital">Hospital</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}