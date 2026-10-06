'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { FiUser, FiCalendar, FiClock, FiPhone, FiActivity, FiHeart, FiMessageSquare, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const formatTime12h = (timeStr) => {
  if (!timeStr) return "";
  if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) return timeStr;
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const isDayMatching = (availableDays, dateObj) => {
  if (!availableDays) return true;

  let daysArray = [];
  if (Array.isArray(availableDays)) {
    daysArray = availableDays
      .flatMap((item) => String(item).split(","))
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  } else if (typeof availableDays === "string") {
    daysArray = availableDays
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }

  if (daysArray.length === 0) return true;

  if (daysArray.some((d) => ["everyday", "daily", "all", "all days", "every day"].includes(d))) {
    return true;
  }

  const targetDayNum = dateObj.getDay();

  const dayMap = {
    0: ["sun", "sunday", "su"],
    1: ["mon", "monday", "mo"],
    2: ["tue", "tues", "tuesday", "tu"],
    3: ["wed", "wednesday", "we"],
    4: ["thu", "thur", "thurs", "thursday", "th"],
    5: ["fri", "friday", "fr"],
    6: ["sat", "saturday", "sa"],
  };

  const validRepresentations = dayMap[targetDayNum] || [];

  return daysArray.some((d) => {
    const cleanD = d.toLowerCase().trim();
    return validRepresentations.some(
      (rep) => cleanD === rep || cleanD.startsWith(rep) || rep.startsWith(cleanD)
    );
  });
};

export default function BookAppointment() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [checkingDate, setCheckingDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setDoctor(data.doctor);
      } catch (err) {
        console.log(err);
      }
    };

    loadDoctor();
  }, [doctorId]);

  // =========================
  // GENERATE AVAILABLE DATES
  // =========================
  useEffect(() => {
    if (!doctor) return;
    generateDates(doctor);
  }, [doctor]);

  const generateDates = (doc) => {
    const dates = [];

    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const matched = isDayMatching(doc.availableDays, date);

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
  // CHAMBER TIME FORMATTER
  // =========================
  const getChamberTimeString = (doc) => {
    if (!doc) return "Chamber Hours";
    if (doc.startTime && doc.endTime) {
      return `${formatTime12h(doc.startTime)} - ${formatTime12h(doc.endTime)}`;
    }
    return "Regular Chamber Hours";
  };

  // =========================
  // CHECK AVAILABILITY FOR DATE
  // =========================
  const checkAvailabilityForDate = async (selectedDate) => {
    if (!selectedDate || !doctorId) return;

    setCheckingDate(true);
    try {
      const { data } = await api.get(`/appointments/check-availability/${doctorId}`, {
        params: { date: selectedDate },
      });

      setAvailabilityStatus(data);

      const chamberTimeStr = doctor?.startTime && doctor?.endTime
        ? `${formatTime12h(doctor.startTime)} - ${formatTime12h(doctor.endTime)}`
        : "Regular Chamber Hours";

      setForm((prev) => ({
        ...prev,
        appointmentTime: chamberTimeStr,
      }));
    } catch (err) {
      console.warn("Check availability error:", err);
    } finally {
      setCheckingDate(false);
    }
  };

  // =========================
  // FORM HANDLER
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "appointmentDate") {
      checkAvailabilityForDate(value);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availabilityStatus?.isFull) {
      alert(`Appointments are full for this date (${availabilityStatus.bookedCount}/${availabilityStatus.maxPatients}). Please select another date.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/appointments', {
        doctorId,
        patientInfo: form,
      });

      alert(`Appointment Request Sent Successfully!\nSerial Number: ${res.data.serialNumber || 'Assigned'}`);
      setForm((prev) => ({
        ...prev,
        symptoms: '',
        notes: '',
      }));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const chamberTimeDisplay = getChamberTimeString(doctor);

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-70 h-70 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Appointment</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Book Appointment</h1>
              <p className="text-slate-400 mt-1 text-sm">Schedule a consultation with your doctor</p>
            </div>
            {doctor && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-2xl px-4 py-3">
                <div className="w-12 h-12 bg-blue-500/15 rounded-xl flex items-center justify-center text-lg font-bold text-blue-400">
                  {doctor.fullName?.charAt(0) || 'D'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{doctor.fullName}</p>
                  <p className="text-xs text-blue-400 font-medium">{doctor.specialization || doctor.specialty || 'Doctor'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Chamber: <span className="text-emerald-400 font-semibold">{chamberTimeDisplay}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section: Patient Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <FiUser className="text-blue-400 w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">Patient Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name <span className="text-blue-400">*</span></label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    placeholder="Patient's Full Name"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Age <span className="text-blue-400">*</span></label>
                  <input
                    name="age"
                    value={form.age}
                    type="number"
                    placeholder="e.g. 30"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 cursor-pointer"
                    onChange={handleChange}
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select Gender</option>
                    <option value="Male" className="bg-slate-900">Male</option>
                    <option value="Female" className="bg-slate-900">Female</option>
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number <span className="text-blue-400">*</span></label>
                  <input
                    name="phone"
                    value={form.phone}
                    placeholder="+880 1XXX XXXXXX"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Blood Group</label>
                  <input
                    name="bloodGroup"
                    value={form.bloodGroup}
                    placeholder="e.g. A+"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                    onChange={handleChange}
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Emergency Contact</label>
                  <input
                    name="emergencyContact"
                    value={form.emergencyContact}
                    placeholder="Contact Number"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                    onChange={handleChange}
                  />
                </div>

                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    placeholder="Full Address"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section: Medical Information */}
            <div className="space-y-4 pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  <FiHeart className="text-violet-400 w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">Medical Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Symptoms <span className="text-blue-400">*</span></label>
                  <textarea
                    name="symptoms"
                    value={form.symptoms}
                    placeholder="Describe your current symptoms in detail..."
                    rows={3}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Appointment Schedule & Availability */}
            <div className="space-y-4 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <FiCalendar className="text-emerald-400 w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Appointment Date & Chamber Time</h2>
                    <p className="text-xs text-slate-400">Available only on doctor's chamber days within daily capacity limit</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Date */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Available Chamber Dates <span className="text-blue-400">*</span></label>
                  <select
                    name="appointmentDate"
                    value={form.appointmentDate}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 cursor-pointer"
                    onChange={handleChange}
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-400">-- Choose an available date --</option>
                    {availableDates.length === 0 ? (
                      <option disabled className="bg-slate-900 text-slate-500">No chamber dates available</option>
                    ) : (
                      availableDates.map((date) => (
                        <option key={date} value={date} className="bg-slate-900">
                          {formatDateDisplay(date)}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Select Time (Chamber Hours only) */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Chamber Timing <span className="text-blue-400">*</span></label>
                  <select
                    name="appointmentTime"
                    value={form.appointmentTime}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 cursor-pointer"
                    onChange={handleChange}
                    required
                  >
                    <option value={chamberTimeDisplay} className="bg-slate-900 font-semibold">
                      Chamber Hours ({chamberTimeDisplay})
                    </option>
                  </select>
                </div>
              </div>

              {/* Availability Status Banner */}
              {checkingDate && (
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  Checking date capacity and appointment availability…
                </div>
              )}

              {availabilityStatus && !checkingDate && (
                <div>
                  {availabilityStatus.isFull ? (
                    <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                      <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-red-200">Daily Appointment Capacity Full!</p>
                        <p className="text-red-300/80 mt-0.5">
                          Maximum limit ({availabilityStatus.bookedCount}/{availabilityStatus.maxPatients} patients) reached for this date. Please select another available chamber date.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-emerald-200">Chamber Hours: {chamberTimeDisplay}</span>
                      </div>
                      {availabilityStatus.maxPatients > 0 && (
                        <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold text-[11px] border border-emerald-500/30">
                          {availabilityStatus.remaining} slots remaining
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                placeholder="Any special requests or details for the doctor..."
                rows={2}
                className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-700/50 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Serial number will be assigned sequentially upon request confirmation.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || availableDates.length === 0 || availabilityStatus?.isFull}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl border border-blue-500/20 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_35px_rgba(37,99,235,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking Appointment…
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      Book Appointment
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}