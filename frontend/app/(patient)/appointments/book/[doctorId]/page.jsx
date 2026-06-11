// 'use client';

// import { use } from 'react';
// import { useState } from 'react';
// import api from '@/lib/axios';

// export default function BookAppointment({
//   params,
// }) {

//   const { doctorId } = use(params);

//   const [form, setForm] = useState({
//     fullName: '',
//     age: '',
//     gender: '',
//     phone: '',

//     address: '',
//     emergencyContact: '',

//     symptoms: '',

//     bloodGroup: '',
//     diseaseHistory: '',
//     allergies: '',
//     currentMedications: '',

//     appointmentDate: '',
//     appointmentTime: '',

//     notes: '',
//   });

//   const handleChange = (e) => {

//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });

//   };

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     await api.post('/appointments', {
//       doctorId,
//       patientInfo: form,
//     });

//     alert('Appointment Request Sent');
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 p-6">

//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

//         <h1 className="text-3xl font-bold mb-8">
//           Book Appointment
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="grid md:grid-cols-2 gap-4"
//         >

//           <input name="fullName" placeholder="Full Name" className="border p-4 rounded-xl" onChange={handleChange} required />

//           <input name="age" placeholder="Age" className="border p-4 rounded-xl" onChange={handleChange} required />

//           <select name="gender" className="border p-4 rounded-xl" onChange={handleChange}>
//             <option value="">Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//           </select>

//           <input name="phone" placeholder="Phone Number" className="border p-4 rounded-xl" onChange={handleChange} required />

//           <input name="bloodGroup" placeholder="Blood Group" className="border p-4 rounded-xl" onChange={handleChange} />

//           <input name="emergencyContact" placeholder="Emergency Contact" className="border p-4 rounded-xl" onChange={handleChange} />

//           <input name="address" placeholder="Address" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

//           <textarea name="symptoms" placeholder="Symptoms" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} required />

//           <textarea name="diseaseHistory" placeholder="Disease History" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

//           <textarea name="allergies" placeholder="Allergies" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

//           <textarea name="currentMedications" placeholder="Current Medications" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

//           <input type="date" name="appointmentDate" className="border p-4 rounded-xl" onChange={handleChange} required />

//           <input type="time" name="appointmentTime" className="border p-4 rounded-xl" onChange={handleChange} required />

//           <textarea name="notes" placeholder="Additional Notes" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

//           <button
//             className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold"
//           >
//             Submit Appointment
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';

export default function BookAppointment() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

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

  // =========================
  // LOAD DOCTOR
  // =========================
  useEffect(() => {
    if (!doctorId) return;

    const loadDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/${doctorId}`);
        console.log("DOCTOR API =", data.doctor);

        setDoctor(data.doctor);
      } catch (err) {
        console.log(err);
      }
    };

    loadDoctor();
  }, [doctorId]);

  // =========================
  // GENERATE SLOTS AFTER DOCTOR READY
  // =========================
  useEffect(() => {
    if (!doctor) return;
    if (!doctor.startTime || !doctor.endTime) return;

    generateDates(doctor);
    
  }, [doctor]);

  // =========================
  // DATES GENERATION
  // =========================
const generateDates = (doc) => {
  const dates = [];

  const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const day = date.getDay();

    const matched = doc.availableDays?.some((d) => {
      const normalized = d.trim().toLowerCase();
      return dayMap[normalized] === day;
    });

    if (matched) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');

      dates.push(`${yyyy}-${mm}-${dd}`);
    }
  }

  setAvailableDates(dates);
};


  // =========================
  // FORM HANDLER
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post('/appointments', {
      doctorId,
      patientInfo: form,
    });

    console.log("✅ SUCCESS RESPONSE =", res.data);
    alert('Appointment Request Sent');

  } catch (err) {
    console.log("❌ ERROR FULL =", err);
    console.log("❌ ERROR RESPONSE =", err?.response);
    console.log("❌ BACKEND MESSAGE =", err?.response?.data?.message);
    console.log("❌ REQUEST DATA =", {
      doctorId,
      patientInfo: form,
    });

    alert(err?.response?.data?.message || 'Failed to book appointment');
  }
};

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-4">Book Appointment</h1>

        {/* DEBUG */}
        <p>Doctor: {doctor?.fullName}</p>
        <p>Start: {doctor?.startTime}</p>
        <p>End: {doctor?.endTime}</p>
        <p>Slots: {timeSlots.length}</p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mt-6">

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

          {/* DATE */}
          <select
            name="appointmentDate"
            value={form.appointmentDate}
            className="border p-4 rounded-xl"
            onChange={handleChange}
            required
          >
            <option value="">Select Date</option>

            {availableDates.length === 0 && (
              <option disabled>No available dates</option>
            )}

            {availableDates.map(date => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          {/* TIME */}
          <select
  name="appointmentTime"
  value={form.appointmentTime}
  className="border p-4 rounded-xl"
  onChange={handleChange}
  required
>
  <option value="">Select Time</option>

  {doctor?.startTime && doctor?.endTime && (
    <option value={`${doctor.startTime}-${doctor.endTime}`}>
      {doctor.startTime} - {doctor.endTime}
    </option>
  )}
</select>
         


          <textarea name="notes" placeholder="Notes" className="border p-4 rounded-xl md:col-span-2" onChange={handleChange} />

          <button className="md:col-span-2 bg-blue-600 text-white py-4 rounded-xl font-bold">
            Submit Appointment
          </button>

        </form>
      </div>
    </div>
  );
}