import React from 'react';
import { Brain, Sparkles, TrendingUp, Info } from 'lucide-react';

interface MScoreDonutChartProps {
  score: number; // 0 - 100
  previousScore?: number;
  onOpenPerformance?: () => void;
  onEmojiClick?: () => void;
}

export const MScoreDonutChart: React.FC<MScoreDonutChartProps> = ({
  score,
  previousScore = 78,
  onOpenPerformance,
  onEmojiClick,
}) => {
  // Determine dynamic center emoji & emotion label based on M-Score
  const getScoreMood = (val: number) => {
    if (val >= 90) {
      return {
        emoji: '🤩',
        label: 'Peak Resilience',
        sublabel: 'Optimal Neuro-Harmony',
        color: 'text-emerald-400',
        strokeColor: '#34d399',
        glowColor: 'rgba(52, 211, 153, 0.4)',
      };
    }
    if (val >= 80) {
      return {
        emoji: '😊',
        label: 'Thriving Mind',
        sublabel: 'High Focus & Serenity',
        color: 'text-indigo-400',
        strokeColor: '#818cf8',
        glowColor: 'rgba(129, 140, 248, 0.4)',
      };
    }
    if (val >= 70) {
      return {
        emoji: '😌',
        label: 'Calm & Steady',
        sublabel: 'Balanced Autonomics',
        color: 'text-cyan-400',
        strokeColor: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.4)',
      };
    }
    if (val >= 60) {
      return {
        emoji: '😐',
        label: 'Mild Fatigue',
        sublabel: 'Rest Recommended',
        color: 'text-amber-400',
        strokeColor: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
      };
    }
    return {
      emoji: '🥺',
      label: 'Needs Rejuvenation',
      sublabel: 'Stress Spike Detected',
      color: 'text-rose-400',
      strokeColor: '#f43f5e',
      glowColor: 'rgba(244, 63, 94, 0.4)',
    };
  };

  const mood = getScoreMood(score);
  const diff = score - previousScore;

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Sub-metrics breakdown to represent harmonic pie slices
  const segments = [
    { label: 'Mindful Harmony', value: Math.round(score * 0.35), max: 35, color: '#818cf8' },
    { label: 'Heart Coherence', value: Math.round(score * 0.25), max: 25, color: '#34d399' },
    { label: 'Circadian Rest', value: Math.round(score * 0.2), max: 20, color: '#38bdf8' },
    { label: 'Cognitive Focus', value: Math.round(score * 0.2), max: 20, color: '#f59e0b' },
  ];

  return (
    <div
      id="m-score-pie-container"
      className="p-5 bg-slate-900/90 border border-slate-700 rounded-2xl backdrop-blur-md shadow-xl flex flex-col items-center relative overflow-hidden group"
    >
      {/* Background glow matching the score color */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-2xl transition-all duration-700"
        style={{ background: mood.glowColor }}
      />

      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            M-Score Index
          </span>
        </div>
        {onOpenPerformance && (
          <button
            onClick={onOpenPerformance}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer font-semibold"
            title="View full comparative graphs"
          >
            <span>Analysis</span>
            <TrendingUp className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Center Donut / Pie Chart with Dynamic Responsive Emoji */}
      <div className="relative my-2 flex items-center justify-center z-10">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Glowing Animated Pie Slice Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={mood.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${mood.strokeColor}88)`,
            }}
          />
        </svg>

        {/* Center of the Pie Chart: Interactive Expressive Emoji */}
        <div
          onClick={onEmojiClick}
          className="absolute flex flex-col items-center justify-center text-center cursor-pointer select-none group/emoji transition-transform active:scale-95"
          title={`Status: ${mood.label}. Click to hear avatar encouragement.`}
        >
          <span className="text-4xl filter drop-shadow-md transition-transform group-hover/emoji:scale-125 duration-300">
            {mood.emoji}
          </span>
          <div className="flex items-baseline gap-0.5 mt-1">
            <span className="text-xl font-black text-white font-mono leading-none">
              {score}
            </span>
            <span className="text-[10px] text-slate-500 font-bold">/100</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${mood.color}`}>
            {mood.label}
          </span>
        </div>
      </div>

      {/* Sub-label info & trend */}
      <div className="w-full flex items-center justify-between text-xs pt-2 border-t border-slate-800 z-10">
        <span className="text-[11px] text-slate-400 font-medium">
          {mood.sublabel}
        </span>
        <span
          className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
            diff >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {diff >= 0 ? `+${diff}` : diff} pts vs baseline
        </span>
      </div>

      {/* Mini 4-Segment Balance Pills */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 z-10">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 truncate">{seg.label}</span>
              <span className="font-mono text-slate-200 font-bold">
                {seg.value}/{seg.max}
              </span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(seg.value / seg.max) * 100}%`,
                  backgroundColor: seg.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
