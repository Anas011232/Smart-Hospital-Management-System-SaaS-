'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function DoctorPage() {

  const { hospitalId } = useParams();

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {

    api
      .get(`/doctors/hospital/${hospitalId}`)
      .then((res) =>
        setDoctors(res.data.doctors)
      );

  }, [hospitalId]);

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Doctors
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {doctors.map((doctor) => (

          <div
            key={doctor._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${doctor.photo}`}
              alt=""
              className="w-full h-56 object-cover"
            />

            <div className="p-5">

              <h2 className="text-xl font-bold">
                {doctor.fullName}
              </h2>

              <p className="text-blue-600">
                {doctor.specialization}
              </p>

              <Link
                href={`/appointments/book/${doctor._id}`}
                className="block mt-4 bg-blue-600 text-white text-center py-3 rounded-xl"
              >
                Book Appointment
              </Link>

            </div>
          </div>

        ))}

      </div>

    </div>
  );
}