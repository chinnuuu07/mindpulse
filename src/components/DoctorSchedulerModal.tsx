import React, { useState } from 'react';
import { DOCTORS_LIST } from '../data/mockData';
import { Doctor, DoctorAppointment } from '../types';
import { X, Calendar, Clock, Video, Building, Star, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

interface DoctorSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentBooked: (appointment: DoctorAppointment) => void;
}

export const DoctorSchedulerModal: React.FC<DoctorSchedulerModalProps> = ({
  isOpen,
  onClose,
  onAppointmentBooked,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(DOCTORS_LIST[0].id);
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [mode, setMode] = useState<'Video Call' | 'In-Clinic'>('Video Call');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmedAppt, setConfirmedAppt] = useState<DoctorAppointment | null>(null);

  if (!isOpen) return null;

  const doctor = DOCTORS_LIST.find((d) => d.id === selectedDoctorId) || DOCTORS_LIST[0];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt: DoctorAppointment = {
      id: 'apt-' + Math.floor(1000 + Math.random() * 9000),
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      mode: mode,
      notes: notes || 'General M-Score and mental wellness consultation',
      status: 'Confirmed',
    };

    setConfirmedAppt(newAppt);
    setIsSuccess(true);
    onAppointmentBooked(newAppt);
  };

  return (
    <div
      id="doctor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="doctor-modal-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Schedule Doctor Appointment</h2>
              <span className="text-xs text-slate-400">Board-Certified Specialists &amp; Telehealth</span>
            </div>
          </div>
          <button
            id="doctor-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess && confirmedAppt ? (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Reference Code: <strong className="text-cyan-400 font-mono">{confirmedAppt.id}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Specialist:</span>
                  <span className="font-semibold text-slate-200">{confirmedAppt.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-semibold text-slate-200">{confirmedAppt.date} at {confirmedAppt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consultation Mode:</span>
                  <span className="font-semibold text-cyan-400">{confirmedAppt.mode}</span>
                </div>
              </div>

              <button
                id="doctor-done-btn"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Return to Portal
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBooking} className="space-y-4">
              {/* Doctor Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Specialist
                </label>
                <div className="space-y-2">
                  {DOCTORS_LIST.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        selectedDoctorId === doc.id
                          ? 'bg-cyan-950/70 border-cyan-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <span className="text-xs font-bold block">{doc.name}</span>
                          <span className="text-[11px] text-slate-400 block">{doc.specialty}</span>
                          <span className="text-[10px] text-cyan-400">{doc.hospital}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-semibold">{doc.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('Video Call')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      mode === 'Video Call'
                        ? 'bg-cyan-600 border-cyan-400 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Secure Video Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('In-Clinic')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      mode === 'In-Clinic'
                        ? 'bg-cyan-600 border-cyan-400 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>In-Clinic Visit</span>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Preferred Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Today (Urgent)">Today (Urgent Session)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Friday">This Friday</option>
                    <option value="Saturday">This Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Reason for Visit / M-Score Concerns (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Discuss elevated blood pressure and stress resilience"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                id="doctor-confirm-booking-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Doctor Appointment</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
