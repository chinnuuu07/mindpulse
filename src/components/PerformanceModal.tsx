import React, { useState } from 'react';
import { MScoreHistoryPoint } from '../types';
import { X, TrendingUp, Sparkles, Brain, Moon, HeartPulse, Award, Calendar, CheckCircle2 } from 'lucide-react';

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMScore: number;
  previousMScore: number;
  historyData: MScoreHistoryPoint[];
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({
  isOpen,
  onClose,
  currentMScore,
  previousMScore,
  historyData,
}) => {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(historyData.length - 1);
  const [activeMetric, setActiveMetric] = useState<'score' | 'sleep' | 'focus' | 'stress'>('score');

  if (!isOpen) return null;

  const delta = currentMScore - previousMScore;
  const deltaPercent = ((delta / previousMScore) * 100).toFixed(1);
  const selectedPoint = historyData[selectedPointIndex] || historyData[historyData.length - 1];

  // SVG Chart Dimensions
  const svgWidth = 520;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const minVal = 50;
  const maxVal = 100;

  const getPointsString = () => {
    return historyData
      .map((item, idx) => {
        const x = paddingX + (idx / (historyData.length - 1)) * (svgWidth - paddingX * 2);
        let val = item.score;
        if (activeMetric === 'sleep') val = item.sleep;
        if (activeMetric === 'focus') val = item.focus;
        if (activeMetric === 'stress') val = 100 - item.stress; // Invert stress so higher is better
        const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const getCoordinates = (idx: number) => {
    const x = paddingX + (idx / (historyData.length - 1)) * (svgWidth - paddingX * 2);
    let val = historyData[idx].score;
    if (activeMetric === 'sleep') val = historyData[idx].sleep;
    if (activeMetric === 'focus') val = historyData[idx].focus;
    if (activeMetric === 'stress') val = 100 - historyData[idx].stress;
    const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
    return { x, y, val };
  };

  return (
    <div
      id="performance-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="performance-modal-container"
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider leading-none">M-Score Performance &amp; Analysis</h2>
              <span className="text-xs text-slate-400">
                Continuous Mental Wellness Comparative Assessment
              </span>
            </div>
          </div>
          <button
            id="performance-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Comparison Hero Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30">
            <div className="sm:border-r border-slate-800 pr-3">
              <span className="text-[11px] text-slate-400 block mb-1 uppercase tracking-widest font-bold">
                Current M-Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-400 font-mono">{currentMScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] text-indigo-300 font-medium">Optimal Neuro-Resilience</span>
            </div>

            <div className="sm:border-r border-slate-800 pr-3">
              <span className="text-[11px] text-slate-400 block mb-1 uppercase tracking-widest font-bold">
                Previous Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-400 font-mono">{previousMScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-500">Recorded 7 days prior</span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] text-slate-400 block mb-1 uppercase tracking-widest font-bold">
                Improvement Delta
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-emerald-400 font-mono">+{delta} pts</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
                  +{deltaPercent}%
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Consistent upward trajectory</span>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Comparative Timeline Graph
            </h3>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-[11px]">
              <button
                onClick={() => setActiveMetric('score')}
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition ${activeMetric === 'score' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                M-Score
              </button>
              <button
                onClick={() => setActiveMetric('focus')}
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition ${activeMetric === 'focus' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Puzzle Focus
              </button>
              <button
                onClick={() => setActiveMetric('sleep')}
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition ${activeMetric === 'sleep' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sleep Index
              </button>
            </div>
          </div>

          {/* Interactive SVG Trend Graph */}
          <div className="relative rounded-xl bg-slate-950/90 border border-slate-800 p-3 pt-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-44 overflow-visible"
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[60, 70, 80, 90, 100].map((gridVal) => {
                const y = svgHeight - paddingY - ((gridVal - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
                return (
                  <g key={gridVal}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="3 3"
                      strokeWidth="0.8"
                    />
                    <text x={paddingX - 8} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">
                      {gridVal}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              <polygon
                points={`${paddingX},${svgHeight - paddingY} ${getPointsString()} ${svgWidth - paddingX},${svgHeight - paddingY}`}
                fill="url(#scoreGradient)"
              />

              {/* Trend Line */}
              <polyline
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={getPointsString()}
              />

              {/* Data points */}
              {historyData.map((item, idx) => {
                const { x, y } = getCoordinates(idx);
                const isSelected = selectedPointIndex === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onClick={() => setSelectedPointIndex(idx)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#38bdf8' : '#0e7490'}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2 : 1.5}
                    />
                    <text
                      x={x}
                      y={svgHeight - 6}
                      fill={isSelected ? '#38bdf8' : '#94a3b8'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {item.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip for Selected Point */}
            <div className="mt-2 flex items-center justify-between text-xs px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 font-medium">Selected Date: <strong className="text-slate-100">{selectedPoint.date}</strong></span>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-cyan-400">Score: {selectedPoint.score}</span>
                <span className="text-indigo-300">Sleep: {selectedPoint.sleep}%</span>
                <span className="text-emerald-400">Focus: {selectedPoint.focus}%</span>
                <span className="text-rose-400">HR: {selectedPoint.heartRate} bpm</span>
              </div>
            </div>
          </div>

          {/* Comprehensive Clinical Analysis & Drivers */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Full Comparative Analysis &amp; Recommendations</span>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Your M-Score increased by <strong>+{delta} points</strong> over the past tracking cycle. This growth is predominantly fueled by a <span className="text-emerald-400 font-medium">26% reduction in cognitive cortisol spikes</span> during afternoon hours, reinforced by regular 4-7-8 breathing practice and consistent sleep timing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-200">Key Positive Driver</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Completed 5 mindfulness puzzles, activating prefrontal neural plasticity.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                <Brain className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-200">Next Target (Goal: 90)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Maintain evening screen curfew at 9:30 PM to stabilize deep slow-wave sleep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
