'use client';
import { use, useState } from 'react';
import api from '@/lib/axios';

export default function BookAppointment({ params }) {
  const { doctorId } = use(params);
  const [info, setInfo] = useState({ symptoms: '', date: '' });

  const handleBooking = async (e) => {
    e.preventDefault();
    await api.post('/appointments', { doctorId, patientInfo: info });
    alert("Request Sent!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border">
      <h2 className="text-2xl font-bold mb-6">Appointment Details</h2>
      <form onSubmit={handleBooking} className="space-y-4">
        <textarea 
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Describe your symptoms..."
          onChange={(e) => setInfo({...info, symptoms: e.target.value})}
        />
        <input 
          type="date" 
          className="w-full p-4 border rounded-xl outline-none"
          onChange={(e) => setInfo({...info, date: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}