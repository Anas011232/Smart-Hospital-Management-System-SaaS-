export default function AppointmentModal({ app, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="space-y-4">
          <InfoItem label="Doctor Name" value={app.doctorDetails?.fullName} />
          <InfoItem label="Date" value={app.patientInfo?.appointmentDate} />
          <InfoItem label="Time" value={app.patientInfo?.appointmentTime} />
          <InfoItem label="Serial No" value={`#${app.serialNumber}`} />
          <InfoItem label="Status" value={app.status.toUpperCase()} />
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-blue-800 text-sm font-medium">Symptoms:</p>
            <p className="text-blue-900 font-semibold">{app.patientInfo?.symptoms}</p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
        >
          Close Details
        </button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  );
}