'use client';

import { use } from 'react';
import { useState } from 'react';
import api from '@/lib/axios';

export default function BookAppointment({
  params,
}) {

  const { doctorId } = use(params);

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: '',
    phone: '',

    address: '',
    emergencyContact: '',

    symptoms: '',

    bloodGroup: '',
    diseaseHistory: '',
    allergies: '',
    currentMedications: '',

    appointmentDate: '',
    appointmentTime: '',

    notes: '',
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await api.post('/appointments', {
      doctorId,
      patientInfo: form,
    });

    alert('Appointment Request Sent');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Book Appointment
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >

          <input name="fullName" placeholder="Full Name" className="border p-4 rounded-xl" onChange={handleChange} required />

          <input name="age" placeholder="Age" className="border p-4 rounded-xl" onChange={handleChange} required />

          <select name="gender" className="border p-4 rounded-xl" onChange={handleChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input name="phone" placeholder="Phone Number" className="border p-4 rounded-xl" onChange={handleChange} required />

          <input name="bloodGroup" placeholder="Blood Group" className="border p-4 rounded-xl" onChange={handleChange} />

          <input name="emergencyContact" placeholder="Emergency Contact" className="border p-4 rounded-xl" onChange={handleChange} />

          <input name="address" placeholder="Address" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

          <textarea name="symptoms" placeholder="Symptoms" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} required />

          <textarea name="diseaseHistory" placeholder="Disease History" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

          <textarea name="allergies" placeholder="Allergies" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

          <textarea name="currentMedications" placeholder="Current Medications" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

          <input type="date" name="appointmentDate" className="border p-4 rounded-xl" onChange={handleChange} required />

          <input type="time" name="appointmentTime" className="border p-4 rounded-xl" onChange={handleChange} required />

          <textarea name="notes" placeholder="Additional Notes" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

          <button
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold"
          >
            Submit Appointment
          </button>

        </form>

      </div>

    </div>
  );
}