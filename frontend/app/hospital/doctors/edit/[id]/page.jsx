"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditDoctor() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const loadDoctor = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/doctors/${id}`
      );
      setForm(res.data.doctor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctor();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateDoctor = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/doctors/${id}`,
        form
      );

      router.push("/hospital/doctors");
    } catch (err) {
      console.error("UPDATE ERROR:", err);
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Edit <span className="text-cyan-400">Doctor</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Update doctor information
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={updateDoctor}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {Object.keys(form).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm text-slate-300 mb-2 capitalize">
                {key}
              </label>

              <input
                name={key}
                value={form[key] || ""}
                onChange={handleChange}
                className="
                  p-3
                  rounded-xl
                  bg-white/5
                  border
                  border-slate-700
                  text-white
                  outline-none
                  transition
                  duration-300
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-500/30
                  hover:border-slate-500
                "
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}

          {/* BUTTON */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="
                w-full
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-semibold
                py-4
                rounded-2xl
                shadow-lg
                hover:scale-[1.02]
                hover:shadow-cyan-500/25
                transition-all
                duration-300
              "
            >
              Update Doctor
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}