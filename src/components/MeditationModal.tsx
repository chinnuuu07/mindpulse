import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Wind, Play, Pause, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';

interface MeditationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardScore: (points: number) => void;
}

type BreathPhase = 'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)' | 'Ready';

export const MeditationModal: React.FC<MeditationModalProps> = ({
  isOpen,
  onClose,
  onRewardScore,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('Ready');
  const [countdown, setCountdown] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [hasRewarded, setHasRewarded] = useState<boolean>(false);

  // Web Audio chime generator for tranquil breathing cues
  const playChime = (freq: number = 432) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.7);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (phase === 'Ready' || phase === 'Exhale (8s)') {
              setPhase('Inhale (4s)');
              playChime(528); // Uplifting tone
              return 4;
            } else if (phase === 'Inhale (4s)') {
              setPhase('Hold (7s)');
              playChime(432); // Grounding tone
              return 7;
            } else if (phase === 'Hold (7s)') {
              setPhase('Exhale (8s)');
              playChime(396); // Soothing low tone
              setCompletedCycles((c) => {
                const next = c + 1;
                if (next >= 2 && !hasRewarded) {
                  onRewardScore(3);
                  setHasRewarded(true);
                }
                return next;
              });
              return 8;
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, phase, hasRewarded, onRewardScore]);

  if (!isOpen) return null;

  const handleToggle = () => {
    if (!isActive && phase === 'Ready') {
      setPhase('Inhale (4s)');
      setCountdown(4);
      playChime(528);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Ready');
    setCountdown(4);
  };

  return (
    <div
      id="meditation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="meditation-modal-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Mindful 4-7-8 Breathwork &amp; Tips</h2>
              <span className="text-xs text-slate-400">Autonomic Nervous Reset &amp; Blood Pressure Calming</span>
            </div>
          </div>
          <button
            id="meditation-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Animated Breath Pacer Circle */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-teal-400/40 transition-all duration-1000 ${
                  phase === 'Inhale (4s)'
                    ? 'scale-110 bg-teal-500/10'
                    : phase === 'Hold (7s)'
                    ? 'scale-110 bg-teal-500/20 border-cyan-400'
                    : phase === 'Exhale (8s)'
                    ? 'scale-90 bg-teal-500/5'
                    : 'scale-95'
                }`}
              />

              {/* Inner core circle */}
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-teal-950 via-slate-900 to-cyan-950 border border-teal-500/50 flex flex-col items-center justify-center shadow-lg shadow-teal-500/20">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
                  {phase}
                </span>
                <span className="text-4xl font-extrabold text-white font-mono">
                  {countdown}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Cycle: {completedCycles}
                </span>
              </div>
            </div>

            {/* Play/Pause Controls */}
            <div className="flex items-center gap-3 mt-5">
              <button
                id="meditation-play-btn"
                onClick={handleToggle}
                className="py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md shadow-teal-600/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isActive ? 'Pause Breath' : 'Start 4-7-8 Breathing'}</span>
              </button>

              <button
                id="meditation-reset-btn"
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {hasRewarded && (
              <div className="mt-3 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>+3 M-Score Points Added for Daily Breathwork!</span>
              </div>
            )}
          </div>

          {/* Expert Meditation Tips */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Clinical Meditation Tips to Boost M-Score
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Vagus Nerve Activation</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Extending exhalations (8s) triggers the parasympathetic branch, reducing arterial resistance and pulse rate.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Daily Micro-Sessions</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Practicing 3 minutes at 11:00 AM and 3:00 PM prevents afternoon cortisol surges and stabilizes M-Score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
