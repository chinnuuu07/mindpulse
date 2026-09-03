import React, { useState } from 'react';
import { AvatarConfig } from '../types';
import { X, Sliders, Volume2, Palette, Sparkles, Check, Play } from 'lucide-react';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AvatarConfig;
  onUpdateConfig: (newConfig: AvatarConfig) => void;
}

const GLOW_COLORS = [
  { name: 'Cyan Pulse', hex: '#06b6d4' },
  { name: 'Emerald Calm', hex: '#10b981' },
  { name: 'Amethyst Mind', hex: '#a855f7' },
  { name: 'Solar Amber', hex: '#f59e0b' },
  { name: 'Rose Heart', hex: '#f43f5e' },
];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'appearance'>('appearance');
  const [tempConfig, setTempConfig] = useState<AvatarConfig>({ ...config });

  if (!isOpen) return null;

  const handleTestVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Greetings. I am AURA, your 3D mental wellness guide. All cognitive systems are synchronized.'
      );
      utterance.pitch = tempConfig.voicePitch;
      utterance.rate = tempConfig.voiceRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = () => {
    onUpdateConfig(tempConfig);
    onClose();
  };

  return (
    <div
      id="avatar-customizer-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="avatar-customizer-container"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Avatar Customization</h2>
              <span className="text-xs text-slate-400">Voice Synthesis &amp; 3D Appearance</span>
            </div>
          </div>
          <button
            id="avatar-customizer-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>3D Appearance</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice &amp; Audio</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              {/* Style Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Avatar Theme Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'hologram', label: 'Futuristic Hologram', desc: 'Luminous translucent photon mesh' },
                    { id: 'zen', label: 'Zen Sage', desc: 'Calm matte contemplative form' },
                    { id: 'cyber', label: 'Cyber Guide', desc: 'High-contrast metallic matrix' },
                    { id: 'clinical', label: 'Clinical Health', desc: 'Soothing clean medical aesthetic' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setTempConfig({ ...tempConfig, style: style.id as any })}
                      className={`p-3 rounded-xl border text-left transition ${
                        tempConfig.style === style.id
                          ? 'bg-cyan-950/70 border-cyan-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block text-slate-100">{style.label}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Glow / Aura Color */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Bio-Aura &amp; Eye Glow Color
                </label>
                <div className="flex items-center gap-2">
                  {GLOW_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setTempConfig({ ...tempConfig, glowColor: c.hex })}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition transform hover:scale-110 relative"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {tempConfig.glowColor === c.hex && (
                        <Check className="w-4 h-4 text-slate-950 font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visor Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Bio-Telemetry AR Visor
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Wear optical HUD visor on 3D avatar head
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={tempConfig.hasVisor}
                  onChange={(e) => setTempConfig({ ...tempConfig, hasVisor: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-4">
              {/* Voice Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Voice Personality
                </label>
                <select
                  value={tempConfig.voiceName}
                  onChange={(e) => setTempConfig({ ...tempConfig, voiceName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="AURA Calming">AURA Calming (Warm &amp; Reassuring)</option>
                  <option value="Zephyr Deep">Zephyr Deep (Soothing &amp; Grounding)</option>
                  <option value="Kore Gentle">Kore Gentle (Empathetic &amp; Soft)</option>
                  <option value="Fenrir Focused">Fenrir Focused (Crisp &amp; Analytical)</option>
                </select>
              </div>

              {/* Pitch Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Voice Pitch</span>
                  <span className="font-mono text-cyan-400">{tempConfig.voicePitch.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.1"
                  value={tempConfig.voicePitch}
                  onChange={(e) => setTempConfig({ ...tempConfig, voicePitch: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Rate / Speed Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Speaking Speed (Rate)</span>
                  <span className="font-mono text-cyan-400">{tempConfig.voiceRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={tempConfig.voiceRate}
                  onChange={(e) => setTempConfig({ ...tempConfig, voiceRate: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Auto Speech Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Auto Vocalize Responses
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Avatar reads health advice aloud automatically
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={tempConfig.autoSpeech}
                  onChange={(e) => setTempConfig({ ...tempConfig, autoSpeech: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleTestVoice}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Voice Sample</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              id="save-avatar-settings-btn"
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Customization</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
