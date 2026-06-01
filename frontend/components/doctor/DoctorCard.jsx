export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl">
      <img
        src={`http://localhost:5000${doctor.photo}`}
        className="w-20 h-20 rounded-full object-cover"
      />

      <h2>{doctor.fullName}</h2>

      <p>{doctor.specialization}</p>

      <p>{doctor.phone}</p>

      <p>
        Fee:
        {doctor.consultationFee} BDT
      </p>
    </div>
  );
}