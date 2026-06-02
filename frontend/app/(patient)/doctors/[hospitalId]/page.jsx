'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function DoctorPage() {
  const params = useParams();
  const hospitalId = params.hospitalId;

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (!hospitalId) return;

    api.get(`/doctors/hospital/${hospitalId}`)
      .then((res) => {
        setDoctors(res.data.doctors || []);
      })
      .catch(console.error);

  }, [hospitalId]);

  return (
    <div className="p-6">
      <h1>Doctors</h1>

      {doctors.length === 0 && (
        <p>No doctors found</p>
      )}

      {doctors.map((doctor) => (
        <div key={doctor._id} className="border p-3 mb-2">
          <h2>{doctor.fullName}</h2>
          <p>{doctor.specialization}</p>
        </div>
      ))}
    </div>
  );
}