// 'use client';
// import { useEffect, useState, use } from "react";
// import api from "@/lib/axios";
// import { useRouter } from "next/navigation";

// export default function PrescribePage({ params: paramsPromise }) {
//   const params = use(paramsPromise);
//   const appointmentId = params.id;
//   const router = useRouter();
//   const [appointment, setAppointment] = useState(null);

//   // ফর্ম স্টেট
//   const [diagnosis, setDiagnosis] = useState("");
//   const [medicines, setMedicines] = useState([{ name: "", dosage: "1+0+1", duration: "7 Days", instruction: "After Meal" }]);
//   const [tests, setTests] = useState([""]);
//   const [advice, setAdvice] = useState("");

//  useEffect(() => {
//     if (!appointmentId) return;

//     // পাথটি লক্ষ্য করুন: 'appointments' শব্দটি যুক্ত করা হয়েছে
//     api.get(`/appointments/${appointmentId}`)
//       .then((res) => {
//         setAppointment(res.data);
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//       });
//   }, [appointmentId]);

//   const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "1+0+1", duration: "7 Days", instruction: "After Meal" }]);
//   const handleMedChange = (index, field, value) => {
//     const updated = [...medicines];
//     updated[index][field] = value;
//     setMedicines(updated);
//   };

//   const addTest = () => setTests([...tests, ""]);
//   const handleTestChange = (index, value) => {
//     const updated = [...tests];
//     updated[index] = value;
//     setTests(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = { appointmentId, diagnosis, medicines, tests: tests.filter(Boolean), advice };
//     const res = await api.post("/prescriptions", payload);
//     if (res.data.success) {
//       alert("Prescription submitted and sent to patient!");
//       router.push("/doctor-dashboard/live-queue");
//     }
//   };

//   if (!appointment) return <p className="p-6">Loading patient data...</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* বাম কলাম: পেশেন্ট ডিটেইলস */}
//       <div className="bg-gray-50 p-5 rounded-xl border h-fit">
//         <h2 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Patient Profile</h2>
//         <p className="font-semibold text-xl text-indigo-700">{appointment.patientInfo?.fullName}</p>
//         <p className="text-gray-600 mt-1">Age: {appointment.patientInfo?.age || "N/A"} | Gender: {appointment.patientInfo?.gender || "N/A"}</p>
//         <div className="mt-4 bg-white p-3 rounded-lg border">
//           <p className="text-xs uppercase text-gray-400 font-bold">Chief Complaints / Symptoms</p>
//           <p className="text-gray-700 mt-1 text-sm font-medium">{appointment.patientInfo?.symptoms || "None reported"}</p>
//         </div>
//       </div>

//       {/* ডান কলাম: প্রেসক্রিপশন বিল্ডার ফর্ম */}
//       <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm space-y-6">
//         <h2 className="text-xl font-bold border-b pb-3 text-gray-800">Prescription Builder</h2>

//         <div>
//           <label className="block text-sm font-bold text-gray-700 mb-2">Diagnosis / Clinical Findings</label>
//           <input type="text" required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="e.g. Acute Fever" />
//         </div>

//         {/* মেডিসিন সেকশন */}
//         <div>
//           <div className="flex justify-between items-center mb-3">
//             <label className="block text-sm font-bold text-gray-700">Rx - Medicines</label>
//             <button type="button" onClick={addMedicine} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded">+ Add Medicine</button>
//           </div>
//           {medicines.map((med, idx) => (
//             <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2 border p-2 rounded-lg bg-gray-50">
//               <input type="text" placeholder="Medicine Name" required value={med.name} onChange={(e) => handleMedChange(idx, "name", e.target.value)} className="border p-2 rounded text-sm sm:col-span-1" />
//               <input type="text" placeholder="Dosage (e.g. 1+0+1)" value={med.dosage} onChange={(e) => handleMedChange(idx, "dosage", e.target.value)} className="border p-2 rounded text-sm" />
//               <input type="text" placeholder="Duration (e.g. 5 Days)" value={med.duration} onChange={(e) => handleMedChange(idx, "duration", e.target.value)} className="border p-2 rounded text-sm" />
//               <input type="text" placeholder="Instruction" value={med.instruction} onChange={(e) => handleMedChange(idx, "instruction", e.target.value)} className="border p-2 rounded text-sm" />
//             </div>
//           ))}
//         </div>

//         {/* টেস্ট সেকশন */}
//         <div>
//           <div className="flex justify-between items-center mb-3">
//             <label className="block text-sm font-bold text-gray-700">Investigations / Tests</label>
//             <button type="button" onClick={addTest} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded">+ Add Test</button>
//           </div>
//           {tests.map((test, idx) => (
//             <input key={idx} type="text" placeholder="Test Name (e.g. CBC)" value={test} onChange={(e) => handleTestChange(idx, e.target.value)} className="w-full border p-2 rounded mb-2 text-sm" />
//           ))}
//         </div>

//         <div>
//           <label className="block text-sm font-bold text-gray-700 mb-2">Advice / Special Instructions</label>
//           <textarea rows="3" value={advice} onChange={(e) => setAdvice(e.target.value)} className="w-full border p-3 rounded-lg text-sm" placeholder="e.g. Complete bed rest, drink plenty of water."></textarea>
//         </div>

//         <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition">
//           Complete & Send Prescription
//         </button>
//       </form>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function PrescribePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const appointmentId = params.id;
  const router = useRouter();

  const [appointment, setAppointment] = useState(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "1+0+1", duration: "7 Days", instruction: "After Meal" }
  ]);
  const [tests, setTests] = useState([""]);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    if (!appointmentId) return;

    api.get(`/appointments/${appointmentId}`)
      .then((res) => {
        setAppointment(res.data.appointment || res.data);
      })
      .catch((err) => console.error(err));
  }, [appointmentId]);

  const addMedicine = () =>
    setMedicines([...medicines, { name: "", dosage: "1+0+1", duration: "7 Days", instruction: "After Meal" }]);

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addTest = () => setTests([...tests, ""]);

  const handleTestChange = (index, value) => {
    const updated = [...tests];
    updated[index] = value;
    setTests(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      appointmentId,
      diagnosis,
      medicines,
      tests: tests.filter(Boolean),
      advice
    };

    const res = await api.post("/prescriptions", payload);

    if (res.data.success) {
      alert("Prescription submitted!");
      router.push("/doctor-dashboard/live-queue");
    }
  };

  if (!appointment) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading prescription...
      </div>
    );
  }

  const doctor = appointment?.doctorDetails;
  const patient = appointment?.patientInfo;

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* PRINT BUTTON */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          🖨 Print Prescription
        </button>
      </div>

      {/* PRESCRIPTION PAPER */}
      <div className="bg-white max-w-4xl mx-auto shadow-lg border print:shadow-none">

        {/* HEADER */}
        <div className="text-center border-b p-5">
          <h1 className="text-2xl font-bold text-indigo-700">
            🏥 Digital Prescription
          </h1>
          <p className="text-sm text-gray-500">
            Smart Hospital Management System
          </p>
        </div>

        {/* DOCTOR + PATIENT */}
        <div className="grid md:grid-cols-2 border-b">

          {/* DOCTOR */}
          <div className="p-5 border-r">
            <h2 className="font-bold text-gray-700 mb-2">Doctor</h2>

            <p className="text-xl font-bold text-indigo-700">
              Dr. {doctor?.fullName || "N/A"}
            </p>

            <p className="text-sm text-gray-600">
              {doctor?.qualification}
            </p>

            <p className="text-sm text-gray-600">
              {doctor?.designation}
            </p>

            <p className="text-sm text-gray-600">
              Dept: {doctor?.department}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              BMDC: {doctor?.medicalRegistrationNumber}
            </p>
          </div>

          {/* PATIENT */}
          <div className="p-5">
            <h2 className="font-bold text-gray-700 mb-2">Patient</h2>

            <p className="text-lg font-semibold">
              {patient?.fullName}
            </p>

            <p className="text-sm text-gray-600">
              Age: {patient?.age || "N/A"} | Gender: {patient?.gender || "N/A"}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Symptoms: {patient?.symptoms}
            </p>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="p-6 space-y-6">

          {/* DIAGNOSIS */}
          <div>
            <label className="font-bold">Diagnosis</label>
            <input
              className="w-full border p-3 rounded mt-2"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* MEDICINE */}
          <div>
            <div className="flex justify-between">
              <h3 className="font-bold">Medicines</h3>
              <button
                type="button"
                onClick={addMedicine}
                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded"
              >
                + Add
              </button>
            </div>

            {medicines.map((m, i) => (
              <div key={i} className="grid md:grid-cols-4 gap-2 mt-2 border p-3 bg-gray-50">
                <input value={m.name} onChange={(e) => handleMedChange(i, "name", e.target.value)} placeholder="Medicine" className="border p-2" />
                <input value={m.dosage} onChange={(e) => handleMedChange(i, "dosage", e.target.value)} className="border p-2" />
                <input value={m.duration} onChange={(e) => handleMedChange(i, "duration", e.target.value)} className="border p-2" />
                <input value={m.instruction} onChange={(e) => handleMedChange(i, "instruction", e.target.value)} className="border p-2" />
              </div>
            ))}
          </div>

          {/* TEST */}
          <div>
            <h3 className="font-bold">Tests</h3>
            {tests.map((t, i) => (
              <input
                key={i}
                value={t}
                onChange={(e) => handleTestChange(i, e.target.value)}
                className="w-full border p-2 mt-2"
              />
            ))}
          </div>

          {/* ADVICE */}
          <div>
            <h3 className="font-bold">Advice</h3>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full border p-3 mt-2"
              rows="3"
            />
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded font-bold"
          >
            Save Prescription
          </button>

        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-500 border-t p-3">
          Hospital Management System • Doctor Signature: ____________
        </div>

      </div>
    </div>
  );
}