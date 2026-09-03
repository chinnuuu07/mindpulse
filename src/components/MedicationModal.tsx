import React, { useState } from 'react';
import { MedicationReminder } from '../types';
import { X, Pill, Plus, Check, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: MedicationReminder[];
  onToggleTaken: (id: string) => void;
  onAddMedication: (med: MedicationReminder) => void;
}

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  medications,
  onToggleTaken,
  onAddMedication,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('');
  const [time, setTime] = useState<string>('08:00 AM');
  const [frequency, setFrequency] = useState<string>('Daily with breakfast');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMedication({
      id: 'med-' + Date.now(),
      name: name.trim(),
      dosage: dosage.trim() || 'Standard Dose',
      time: time,
      taken: false,
      frequency: frequency,
    });

    setName('');
    setDosage('');
    setIsAdding(false);
  };

  return (
    <div
      id="medication-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="medication-modal-container"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Medication &amp; Health Reminders</h2>
              <span className="text-xs text-slate-400">Schedule adherence for neurological balance</span>
            </div>
          </div>
          <button
            id="medication-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Today's Regimen ({medications.filter((m) => m.taken).length}/{medications.length} taken)
            </span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Cancel' : 'Add Medication'}</span>
            </button>
          </div>

          {/* Add form */}
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Medication or Supplement Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ashwagandha KSM-66"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 300 mg"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Reminder</span>
              </button>
            </form>
          )}

          {/* List */}
          <div className="space-y-2">
            {medications.map((med) => (
              <div
                key={med.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                  med.taken
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleTaken(med.id)}
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition cursor-pointer ${
                      med.taken
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'bg-slate-900 border-slate-700 text-transparent hover:border-slate-500'
                    }`}
                  >
                    <Check className="w-4 h-4 font-bold stroke-[3]" />
                  </button>

                  <div>
                    <span className={`text-xs font-bold block ${med.taken ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {med.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">{med.dosage} • {med.frequency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
                  <Clock className="w-3 h-3 text-cyan-500" />
                  <span>{med.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Consistent timing with blood pressure supplements and adaptogens anchors your neurochemical rhythm, directly elevating your M-Score resilience.
          </div>
        </div>
      </div>
    </div>
  );
};
