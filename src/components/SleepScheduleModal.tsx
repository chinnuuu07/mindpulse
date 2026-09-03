import React, { useState } from 'react';
import { X, Moon, Sun, Clock, CheckCircle2, Bed, Sparkles, Bell } from 'lucide-react';

interface SleepScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardScore: (points: number) => void;
}

export const SleepScheduleModal: React.FC<SleepScheduleModalProps> = ({
  isOpen,
  onClose,
  onRewardScore,
}) => {
  const [wakeTime, setWakeTime] = useState<string>('06:30');
  const [sleepHours, setSleepHours] = useState<number>(8);
  const [hasApplied, setHasApplied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate bedtime
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);
  let bedH = wakeH - sleepHours;
  if (bedH < 0) bedH += 24;
  const bedTimeStr = `${String(bedH).padStart(2, '0')}:${String(wakeM).padStart(2, '0')}`;

  const handleApplySchedule = () => {
    setHasApplied(true);
    onRewardScore(3);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div
      id="sleep-schedule-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="sleep-schedule-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Circadian Sleep Schedule</h2>
              <span className="text-xs text-slate-400">Neuro-Recovery &amp; M-Score Circadian Alignment</span>
            </div>
          </div>
          <button
            id="sleep-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Target Pickers */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Wake-up Target</span>
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-indigo-400" />
                <span>Duration</span>
              </label>
              <select
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value={7}>7.0 Hours (4.5 Cycles)</option>
                <option value={7.5}>7.5 Hours (5.0 Cycles)</option>
                <option value={8}>8.0 Hours (Optimal)</option>
                <option value={8.5}>8.5 Hours (Deep Recovery)</option>
              </select>
            </div>
          </div>

          {/* Recommended Bedtime Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-indigo-300 font-medium uppercase tracking-wider block">
                Recommended Bedtime Window
              </span>
              <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                {bedTimeStr} PM
              </span>
              <span className="text-[11px] text-slate-400">
                Allows 5 full 90-minute REM/Deep recovery cycles
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-900/60 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Personalized Evening Wind-Down Timeline */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Evening Wind-Down Architecture
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-amber-950 text-amber-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-semibold text-slate-200">90 Mins Prior (Digital Sunset)</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Activate night mode and turn off intense fluorescent lighting to permit natural melatonin surge.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-teal-950 text-teal-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-semibold text-slate-200">45 Mins Prior (Thermoregulation)</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Keep bedroom at 18-20°C (65-68°F). Core body cooling deepens slow-wave brain rejuvenation.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-indigo-950 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-semibold text-slate-200">Morning Anchor (Within 20 mins of Waking)</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    View 10-15 minutes of outdoor daylight to lock your master circadian clock and elevate daily M-Score.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            id="apply-sleep-schedule-btn"
            onClick={handleApplySchedule}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {hasApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Schedule Saved! (+3 M-Score Points Awarded)</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Save &amp; Sync Sleep Schedule (+3 M-Score)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
