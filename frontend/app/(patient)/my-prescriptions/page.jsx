// 'use client';
// import { useEffect, useState } from "react";
// import api from "@/lib/axios";

// export default function MyPrescriptions() {
//   const [prescriptions, setPrescriptions] = useState([]);

//   useEffect(() => {
//     api.get("/prescriptions/my-prescriptions").then((res) => {
//       setPrescriptions(res.data.prescriptions || []);
//     });
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">My Digital Prescriptions</h1>
//       <div className="grid gap-4">
//         {prescriptions.map((pres) => (
//           <div key={pres._id} className="border p-4 rounded-xl bg-white shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
//             <div>
//               <h3 className="font-bold text-lg text-gray-800">Dr. {pres.doctorDetails?.ownerName || "Specialist"}</h3>
//               <p className="text-sm text-gray-500">Diagnosis: <span className="font-semibold text-gray-700">{pres.diagnosis}</span></p>
//               <p className="text-xs text-gray-400 mt-1">Date: {new Date(pres.createdAt).toLocaleDateString()}</p>
//             </div>
//             <a
//               href={`http://localhost:5000${pres.pdfUrl}`} // ব্যাকএন্ড বেস URL সহ
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-indigo-600 text-white text-center px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm text-sm"
//             >
//               View / Download PDF
//             </a>
//           </div>
//         ))}
//         {prescriptions.length === 0 && (
//           <p className="text-gray-500 text-center bg-gray-50 p-8 rounded-xl border">No prescriptions found.</p>
//         )}
//       </div>
//     </div>
//   );
// }