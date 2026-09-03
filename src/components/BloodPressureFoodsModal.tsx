import React from 'react';
import { BLOOD_PRESSURE_FOODS } from '../data/mockData';
import { X, Apple, HeartPulse, Sparkles, ShieldCheck, Flame, AlertCircle } from 'lucide-react';

interface BloodPressureFoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloodPressureFoodsModal: React.FC<BloodPressureFoodsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="bp-foods-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="bp-foods-modal-container"
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">
                Cardio-Nutritional Food Guide
              </h2>
              <span className="text-xs text-slate-400">
                Foods Clinically Verified to Balance Blood Pressure
              </span>
            </div>
          </div>
          <button
            id="bp-foods-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Dietary Principle */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>DASH Nutritional Framework (Target: 118/76 mmHg)</span>
            </div>
            <p className="leading-relaxed">
              Balancing your sodium-to-potassium ratio and boosting natural endothelial nitric oxide relaxes blood vessel walls, stabilizing heart rate and protecting your cognitive M-Score.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {BLOOD_PRESSURE_FOODS.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200">{cat.category}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {cat.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1"
                    >
                      <span className="text-xs font-bold text-slate-100 block">
                        {item.name}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {item.benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Foods to Limit Card */}
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Items to Limit (Prevents Sudden Blood Pressure Spikes)</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
              <li>Ultra-processed convenience meals and high-sodium soy sauces (&gt;2,300mg sodium).</li>
              <li>High-caffeine energy drinks combined with acute cognitive stress.</li>
              <li>Excess licorice root and cured meats containing synthetic nitrates.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
