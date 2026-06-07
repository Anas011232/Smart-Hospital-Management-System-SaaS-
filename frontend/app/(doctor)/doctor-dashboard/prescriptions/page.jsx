// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { FileText, User, Clock, ChevronRight, Loader2 } from 'lucide-react';

// export default function PrescriptionsList() {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/appointments/doctor/accepted", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setPatients(res.data.appointments);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error:", err);
//         setLoading(false);
//       }
//     };
//     fetchPatients();
//   }, []);

//   if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Prescriptions</h1>
//         <p className="text-gray-500">Manage patients for prescriptions</p>
//       </header>

//       {patients.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
//           <FileText className="mx-auto text-gray-300 mb-4" size={48} />
//           <h3 className="text-xl font-medium text-gray-600">No accepted patients found</h3>
//         </div>
//       ) : (
//         <div className="grid gap-4">
//           {patients.map((p) => (
//             <div key={p._id} className="bg-white p-6 rounded-2xl border flex items-center justify-between shadow-sm hover:shadow-md transition">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><User size={24} /></div>
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-800">{p.patientInfo?.name || "N/A"}</h3>
//                   <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={16} /> Serial: {p.serialNumber}</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => router.push(`/doctor-dashboard/prescribe/${p._id}`)}
//                 className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
//               >
//                 Write Prescription <ChevronRight size={18} className="inline" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }