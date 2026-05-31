"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditDoctor() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({});

  const loadDoctor = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/doctors/${id}`
    );
    setForm(res.data.doctor);
  };

  useEffect(() => {
    loadDoctor();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateDoctor = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:5000/api/doctors/${id}`,
      form
    );

    router.push("/hospital/doctors");
  };

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4">Edit Doctor</h1>

      <form className="grid grid-cols-2 gap-3" onSubmit={updateDoctor}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            value={form[key] || ""}
            onChange={handleChange}
            className="p-2 text-black rounded"
          />
        ))}

        <button className="col-span-2 bg-blue-600 p-3 rounded">
          Update
        </button>
      </form>
    </div>
  );
}