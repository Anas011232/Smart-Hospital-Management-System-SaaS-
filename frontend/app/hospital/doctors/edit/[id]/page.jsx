"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  MapPin,
  DollarSign,
  ImagePlus,
} from "lucide-react";

export default function EditDoctor() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    address: "",
    fee: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadDoctor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);

      setForm(res.data.doctor);
      setPreview(res.data.doctor.image || null);

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDoctor();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📸 Image handler
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateDoctor = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // append text fields
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      // append image if selected
      if (image) {
        data.append("image", image);
      }

      await axios.put(
        `http://localhost:5000/api/doctors/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      router.push("/hospital/doctors");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const Input = ({ icon: Icon, ...props }) => (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
      <Icon className="text-gray-400 w-5 h-5" />
      <input
        {...props}
        className="bg-transparent w-full text-white outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Edit <span className="text-blue-500">Doctor</span>
        </h1>

        {/* 🖼️ Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500">
            {preview ? (
              <img
                src={preview}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <label className="mt-3 flex items-center gap-2 cursor-pointer text-sm text-blue-400 hover:text-blue-300">
            <ImagePlus size={16} />
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>
        </div>

        {/* FORM */}
        <form
          onSubmit={updateDoctor}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <Input icon={User} name="name" value={form.name} onChange={handleChange} placeholder="Doctor Name" />

          <Input icon={Mail} name="email" value={form.email} onChange={handleChange} placeholder="Email" />

          <Input icon={Phone} name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />

          <Input icon={Stethoscope} name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" />

          <Input icon={MapPin} name="address" value={form.address} onChange={handleChange} placeholder="Address" />

          <Input icon={DollarSign} name="fee" value={form.fee} onChange={handleChange} placeholder="Fee" />

          <button
            type="submit"
            className="md:col-span-2 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl transition transform hover:scale-[1.02]"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}