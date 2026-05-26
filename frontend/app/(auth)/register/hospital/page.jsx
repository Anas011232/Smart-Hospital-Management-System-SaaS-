"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    setPreview(URL.createObjectURL(file));
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
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-zinc-900 p-8 rounded-2xl space-y-4"
      >
        <h1 className="text-3xl font-bold">
          Hospital Registration
        </h1>

        {/* IMAGE */}
        <div className="flex items-center gap-4">
          <input type="file" onChange={handleImage} />
          {preview && (
            <img
              src={preview}
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
        </div>

        {/* INPUTS */}
        <input name="hospitalName" placeholder="Hospital Name" onChange={handleChange} className="input" />
        <input name="ownerName" placeholder="Owner Name" onChange={handleChange} className="input" />
        <input name="email" placeholder="Email" onChange={handleChange} className="input" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
        <input name="emergencyPhone" placeholder="Emergency Phone" onChange={handleChange} className="input" />

        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="input" />

        <input name="website" placeholder="Website" onChange={handleChange} className="input" />
        <input name="address" placeholder="Address" onChange={handleChange} className="input" />
        <input name="city" placeholder="City" onChange={handleChange} className="input" />
        <input name="state" placeholder="State" onChange={handleChange} className="input" />
        <input name="postalCode" placeholder="Postal Code" onChange={handleChange} className="input" />
        <input name="licenseNumber" placeholder="License Number" onChange={handleChange} className="input" />
        <input name="establishedYear" placeholder="Established Year" onChange={handleChange} className="input" />

        <input name="totalDoctors" placeholder="Total Doctors" onChange={handleChange} className="input" />
        <input name="totalBeds" placeholder="Total Beds" onChange={handleChange} className="input" />

        {/* SELECT */}
        <select name="hospitalType" onChange={handleChange} className="input">
          <option>General</option>
          <option>Specialized</option>
          <option>Clinic</option>
          <option>Diagnostic</option>
          <option>Dental</option>
        </select>

        <select name="subscriptionPlan" onChange={handleChange} className="input">
          <option>Basic</option>
          <option>Standard</option>
          <option>Premium</option>
        </select>

        <select name="subscriptionMonths" onChange={handleChange} className="input">
          <option value={1}>1 Month</option>
          <option value={2}>2 Months</option>
          <option value={3}>3 Months</option>
          <option value={6}>6 Months</option>
        </select>

        {/* PRICE */}
        <div className="bg-zinc-800 p-4 rounded-xl">
          Subscription Amount: <b>৳ {amount}</b>
        </div>

        <button className="bg-blue-600 w-full p-3 rounded-xl">
          Register Hospital
        </button>
      </form>

      {/* styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          background: #27272a;
          border-radius: 10px;
          outline: none;
        }
      `}</style>
    </div>
  );
}