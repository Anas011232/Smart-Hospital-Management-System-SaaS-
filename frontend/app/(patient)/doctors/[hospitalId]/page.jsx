// 'use client';

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import api from "@/lib/axios";

// export default function DoctorPage() {
//   const { hospitalId } = useParams();

//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);

//   // ✅ safe base url
//   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

//   useEffect(() => {
//     if (!hospitalId) return;

//     setLoading(true);

//     api
//       .get(`/doctors/hospital/${hospitalId}`)
//       .then((res) => {
//         setDoctors(res.data?.doctors || []);
//       })
//       .catch((err) => {
//         console.log("LOAD ERROR:", err);
//         setDoctors([]);
//       })
//       .finally(() => setLoading(false));
//   }, [hospitalId]);

//   // ✅ FIXED IMAGE HANDLER
//   const getImage = (photo) => {
//     if (!photo) return "/doctor-placeholder.png";

//     // already full URL
//     if (photo.startsWith("http")) return photo;

//     // fix double slash issue
//     const path = photo.startsWith("/") ? photo : `/${photo}`;

//     return `${BASE_URL}${path}`;
//   };

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-gray-500">
//         Loading doctors...
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">

//       <h1 className="text-4xl font-bold mb-8">
//         👨‍⚕️ Doctors List
//       </h1>

//       {doctors.length === 0 && (
//         <div className="text-center text-gray-500 mt-20">
//           No doctors found 😢
//         </div>
//       )}

//       {/* GRID */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

//         {doctors.map((doctor) => (
//           <div
//             key={doctor._id}
//             onClick={() => setSelectedDoctor(doctor)}
//             className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
//           >

//             {/* IMAGE */}
//             <img
//               src={getImage(doctor.photo)}
//               alt={doctor.fullName}
//               className="w-full h-60 object-cover"
//               onError={(e) => {
//                 e.target.src = "/doctor-placeholder.png";
//               }}
//             />

//             {/* INFO */}
//             <div className="p-5">

//               <h2 className="text-xl font-bold">
//                 {doctor.fullName}
//               </h2>

//               <p className="text-blue-600 mt-1">
//                 🩺 {doctor.specialization}
//               </p>

//               <p className="text-sm text-gray-500 mt-2">
//                 💰 Fee: {doctor.consultationFee} BDT
//               </p>

//               <p className="text-sm text-gray-500">
//                 ⭐ Rating: {doctor.rating || 0}
//               </p>

//             </div>
//           </div>
//         ))}

//       </div>

//       {/* MODAL */}
//       {selectedDoctor && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

//           <div className="bg-white w-[90%] md:w-[600px] rounded-2xl p-6 relative">

//             <button
//               onClick={() => setSelectedDoctor(null)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>

//             <img
//               src={getImage(selectedDoctor.photo)}
//               className="w-full h-60 object-cover rounded-xl mb-4"
//               onError={(e) => {
//                 e.target.src = "/doctor-placeholder.png";
//               }}
//             />

//             <h2 className="text-2xl font-bold">
//               {selectedDoctor.fullName}
//             </h2>

//             <p className="text-blue-600 mt-1">
//               🩺 {selectedDoctor.specialization}
//             </p>

//             <div className="mt-4 space-y-2 text-sm text-gray-600">

//               <p>📧 {selectedDoctor.email}</p>
//               <p>📞 {selectedDoctor.phone}</p>
//               <p>🏥 {selectedDoctor.department}</p>
//               <p>🎓 {selectedDoctor.qualification}</p>
//               <p>⏳ Experience: {selectedDoctor.experienceYears} years</p>
//               <p>💰 Fee: {selectedDoctor.consultationFee} BDT</p>
//               <p>📍 {selectedDoctor.address}</p>

//               <p className="mt-2">
//                 🕒 {selectedDoctor.startTime} - {selectedDoctor.endTime}
//               </p>

//               <p>
//                 🟢 Active: {selectedDoctor.isActive ? "Yes" : "No"}
//               </p>

//             </div>

//             <Link
//               href={`/appointments/book/${selectedDoctor._id}`}
//               className="block mt-5 bg-blue-600 text-white text-center py-3 rounded-xl hover:bg-blue-700"
//             >
//               Book Appointment
//             </Link>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function DoctorPage() {
  const { hospitalId } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:5000";

  const getImage = (photo) => {
    if (!photo) return "/doctor-placeholder.png";

    if (photo.startsWith("http")) return photo;

    const path = photo.startsWith("/")
      ? photo
      : `/${photo}`;

    return `${BASE_URL}${path}`;
  };

  // Load Specializations
  useEffect(() => {
    if (!hospitalId) return;

    api
      .get(`/doctors/specializations/${hospitalId}`)
      .then((res) => {
        setSpecializations(
          res.data?.specializations || []
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, [hospitalId]);

  // Load Doctors
  useEffect(() => {
    if (!hospitalId) return;

    fetchDoctors();
  }, [hospitalId, search, specialization, sortBy]);

  const fetchDoctors = async () => {
  try {
    setLoading(true);

    const res = await api.get(
      `/doctors/hospital/${hospitalId}/filter`,
      {
        params: {
          search,
          specialization,
          sortBy,
        },
      }
    );

    setDoctors(res.data?.doctors || []);
  } catch (err) {
    console.error("Doctor Load Error:", err);
    setDoctors([]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Find a Doctor
        </h1>

        {/* Filters */}

        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Search doctor by name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={specialization}
              onChange={(e) =>
                setSpecialization(e.target.value)
              }
              className="border rounded-xl p-3"
            >
              <option value="all">
                All Specializations
              </option>

              {specializations.map((spec) => (
                <option
                  key={spec}
                  value={spec}
                >
                  {spec}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="border rounded-xl p-3"
            >
              <option value="">
                Sort Doctors
              </option>

              <option value="fee-low">
                Fee: Low to High
              </option>

              <option value="fee-high">
                Fee: High to Low
              </option>

              <option value="exp">
                Experience: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No doctors found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() =>
                  setSelectedDoctor(doctor)
                }
                className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={getImage(doctor.photo)}
                  alt={doctor.fullName}
                  className="w-full h-60 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "/doctor-placeholder.png";
                  }}
                />

                <div className="p-5">

                  <h2 className="font-bold text-xl">
                    {doctor.fullName}
                  </h2>

                  <p className="text-blue-600 mt-1">
                    {doctor.specialization}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">
                    Consultation Fee:{" "}
                    {doctor.consultationFee} BDT
                  </p>

                  <p className="text-sm text-gray-500">
                    Experience:{" "}
                    {doctor.experienceYears || 0} Years
                  </p>

                  <p className="text-sm text-gray-500">
                    Rating: {doctor.rating || 0}
                  </p>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}

        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white w-[95%] md:w-[650px] rounded-2xl p-6 relative">

              <button
                onClick={() =>
                  setSelectedDoctor(null)
                }
                className="absolute top-4 right-4 text-xl"
              >
                ✕
              </button>

              <img
                src={getImage(
                  selectedDoctor.photo
                )}
                className="w-full h-64 object-cover rounded-xl"
                alt=""
              />

              <h2 className="text-3xl font-bold mt-5">
                {selectedDoctor.fullName}
              </h2>

              <p className="text-blue-600 mt-1">
                {selectedDoctor.specialization}
              </p>

              <div className="mt-5 space-y-2 text-gray-600">

                <p>
                  Department:{" "}
                  {selectedDoctor.department}
                </p>

                <p>
                  Qualification:{" "}
                  {selectedDoctor.qualification}
                </p>

                <p>
                  Experience:{" "}
                  {selectedDoctor.experienceYears} Years
                </p>

                <p>
                  Fee:{" "}
                  {selectedDoctor.consultationFee} BDT
                </p>

                <p>
                  Phone: {selectedDoctor.phone}
                </p>

                <p>
                  Email: {selectedDoctor.email}
                </p>

                <p>
                  Available:{" "}
                  {selectedDoctor.startTime} -{" "}
                  {selectedDoctor.endTime}
                </p>

                <p>
                  {selectedDoctor.bio}
                </p>

              </div>

              <Link
                href={`/appointments/book/${selectedDoctor._id}`}
                className="block mt-6 bg-blue-600 text-white text-center py-3 rounded-xl hover:bg-blue-700"
              >
                Book Appointment
              </Link>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
