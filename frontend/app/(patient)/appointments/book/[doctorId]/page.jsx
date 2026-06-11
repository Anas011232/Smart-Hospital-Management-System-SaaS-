'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { FiUser, FiCalendar, FiClock, FiPhone, FiActivity, FiHeart, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';

export default function BookAppointment() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
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
        console.log("DOCTOR API =", data.doctor);

        setDoctor(data.doctor);
      } catch (err) {
        console.log(err);
      }
    };

    loadDoctor();
  }, [doctorId]);

  // =========================
  // GENERATE SLOTS AFTER DOCTOR READY
  // =========================
  useEffect(() => {
    if (!doctor) return;
    if (!doctor.startTime || !doctor.endTime) return;

    generateDates(doctor);
  }, [doctor]);

  // =========================
  // DATES GENERATION
  // =========================
  const generateDates = (doc) => {
    const dates = [];

    const dayMap = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const day = date.getDay();

      const matched = doc.availableDays?.some((d) => {
        const normalized = d.trim().toLowerCase();
        return dayMap[normalized] === day;
      });

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
  // FORM HANDLER
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.post('/appointments', {
        doctorId,
        patientInfo: form,
      });

      console.log("✅ SUCCESS RESPONSE =", res.data);
      alert('Appointment Request Sent');
    } catch (err) {
      console.log("❌ ERROR FULL =", err);
      console.log("❌ ERROR RESPONSE =", err?.response);
      console.log("❌ BACKEND MESSAGE =", err?.response?.data?.message);
      console.log("❌ REQUEST DATA =", {
        doctorId,
        patientInfo: form,
      });

      alert(err?.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // FORMAT DATE FOR DISPLAY
  // =========================
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-70 h-70 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-1">
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
                  <p className="text-xs text-slate-400">{doctor.specialty || 'Doctor'}</p>
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
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 group-hover:border-slate-600"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                  <input
                    name="age"
                    value={form.age}
                    type="number"
                    placeholder="30"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 group-hover:border-slate-600"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 group-hover:border-slate-600 cursor-pointer"
                    onChange={handleChange}
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select Gender</option>
                    <option value="Male" className="bg-slate-900">Male</option>
                    <option value="Female" className="bg-slate-900">Female</option>
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 group-hover:border-slate-600"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Blood Group</label>
                  <input
                    name="bloodGroup"
                    value={form.bloodGroup}
                    placeholder="A+"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 group-hover:border-slate-600"
                    onChange={handleChange}
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Emergency Contact</label>
                  <input
                    name="emergencyContact"
                    value={form.emergencyContact}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 group-hover:border-slate-600"
                    onChange={handleChange}
                  />
                </div>

                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    placeholder="123 Main Street, City, Country"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 group-hover:border-slate-600"
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
                <h2 className="text-sm font-semibold text-white">Medical Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Symptoms <span className="text-blue-400">*</span></label>
                  <textarea
                    name="symptoms"
                    value={form.symptoms}
                    placeholder="Describe your symptoms in detail..."
                    rows={3}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 group-hover:border-slate-600 resize-none"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Disease History</label>
                  <textarea
                    name="diseaseHistory"
                    value={form.diseaseHistory}
                    placeholder="Any previous medical conditions..."
                    rows={2}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 group-hover:border-slate-600 resize-none"
                    onChange={handleChange}
                  />
                </div>

                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Allergies</label>
                  <textarea
                    name="allergies"
                    value={form.allergies}
                    placeholder="Any known allergies..."
                    rows={2}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 group-hover:border-slate-600 resize-none"
                    onChange={handleChange}
                  />
                </div>

                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Medications</label>
                  <textarea
                    name="currentMedications"
                    value={form.currentMedications}
                    placeholder="Medications you are currently taking..."
                    rows={2}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 group-hover:border-slate-600 resize-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section: Appointment Details */}
            <div className="space-y-4 pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <FiCalendar className="text-emerald-400 w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">Appointment Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Date <span className="text-blue-400">*</span></label>
                  <select
                    name="appointmentDate"
                    value={form.appointmentDate}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 group-hover:border-slate-600 cursor-pointer"
                    onChange={handleChange}
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select a date</option>
                    {availableDates.length === 0 ? (
                      <option disabled className="bg-slate-900 text-slate-500">No available dates</option>
                    ) : (
                      availableDates.map((date) => (
                        <option key={date} value={date} className="bg-slate-900">
                          {formatDateDisplay(date)}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Time <span className="text-blue-400">*</span></label>
                  <select
                    name="appointmentTime"
                    value={form.appointmentTime}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 group-hover:border-slate-600 cursor-pointer"
                    onChange={handleChange}
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select a time</option>
                    {doctor?.startTime && doctor?.endTime && (
                      <option value={`${doctor.startTime}-${doctor.endTime}`} className="bg-slate-900">
                        {doctor.startTime} - {doctor.endTime}
                      </option>
                    )}
                  </select>
                </div>

                <div className="group sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    placeholder="Any additional information for the doctor..."
                    rows={2}
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 group-hover:border-slate-600 resize-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-700/50">
              <button
                type="submit"
                disabled={isSubmitting || availableDates.length === 0}
                className="w-full sm:w-auto sm:float-right group px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl border border-blue-500/20 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_35px_rgba(37,99,235,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Booking...
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