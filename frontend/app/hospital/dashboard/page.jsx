"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function Dashboard() {
  const [hospital, setHospital] =
    useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    api
      .get("/hospital/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setHospital(res.data.hospital);
      });
  }, []);

  if (!hospital)
    return <p>Loading...</p>;

  return (
    <div>
      <h1>
        {hospital.hospitalName}
      </h1>

      <p>{hospital.email}</p>

      <p>{hospital.phone}</p>

      <p>{hospital.address}</p>

      <p>
        Total Doctors:
        {hospital.totalDoctors}
      </p>

      <p>
        Total Beds:
        {hospital.totalBeds}
      </p>
    </div>
  );
}