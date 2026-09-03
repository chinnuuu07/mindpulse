import React, { useState } from 'react';
import { BloodPressureData, ConnectedDevice } from '../types';
import {
  X,
  Watch,
  Activity,
  HeartPulse,
  Bluetooth,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Zap,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface SmartwatchPairModalProps {
  isOpen: boolean;
  onClose: () => void;
  bloodPressure: BloodPressureData;
  onUpdateBloodPressure: (bp: BloodPressureData) => void;
  devices: ConnectedDevice[];
  onToggleDeviceConnect: (deviceId: string) => void;
}

export const SmartwatchPairModal: React.FC<SmartwatchPairModalProps> = ({
  isOpen,
  onClose,
  bloodPressure,
  onUpdateBloodPressure,
  devices,
  onToggleDeviceConnect,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleScanDevices = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const simulateHighBP = () => {
    onUpdateBloodPressure({
      systolic: 142,
      diastolic: 94,
      pulse: 88,
      status: 'high',
      lastUpdated: 'Just now',
    });
  };

  const simulateLowBP = () => {
    onUpdateBloodPressure({
      systolic: 86,
      diastolic: 54,
      pulse: 61,
      status: 'low',
      lastUpdated: 'Just now',
    });
  };

  const simulateNormalBP = () => {
    onUpdateBloodPressure({
      systolic: 118,
      diastolic: 76,
      pulse: 68,
      status: 'normal',
      lastUpdated: 'Just now',
    });
  };

  return (
    <div
      id="pair-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="pair-modal-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider leading-none">Smart Tracker &amp; Blood Pressure Pair</h2>
              <span className="text-xs text-slate-400">
                Sync Smartwatches &amp; Screen-Free Fitness Trackers
              </span>
            </div>
          </div>
          <button
            id="pair-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Live Blood Pressure Display Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                  Live Blood Pressure Stream
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Updated: {bloodPressure.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Systolic / Diastolic
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-2xl font-black font-mono ${
                      bloodPressure.status === 'high'
                        ? 'text-rose-400'
                        : bloodPressure.status === 'low'
                        ? 'text-amber-400'
                        : 'text-indigo-400'
                    }`}
                  >
                    {bloodPressure.systolic}/{bloodPressure.diastolic}
                  </span>
                  <span className="text-xs text-slate-500">mmHg</span>
                </div>
                <div className="mt-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                      bloodPressure.status === 'high'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : bloodPressure.status === 'low'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {bloodPressure.status === 'normal' ? 'Normal (Ideal)' : `${bloodPressure.status} Pressure`}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Resting Heart Rate
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-rose-400 font-mono">{bloodPressure.pulse}</span>
                  <span className="text-xs text-slate-500">BPM</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">High Autonomic Variability</span>
              </div>
            </div>

            {/* Manual Quick Test Triggers to verify High/Low Blood Pressure Alert Popups */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                Test Live Popup Alerts (Simulate High / Low BP):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="simulate-high-bp-btn"
                  onClick={simulateHighBP}
                  className="py-1.5 px-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Trigger High (142/94)
                </button>
                <button
                  id="simulate-low-bp-btn"
                  onClick={simulateLowBP}
                  className="py-1.5 px-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Trigger Low (86/54)
                </button>
                <button
                  id="simulate-normal-bp-btn"
                  onClick={simulateNormalBP}
                  className="py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Reset Normal (118/76)
                </button>
              </div>
            </div>
          </div>

          {/* Compatible Trackers List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Available &amp; Paired Trackers
              </span>
              <button
                id="scan-bluetooth-btn"
                onClick={handleScanDevices}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-indigo-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning...' : 'Scan Bluetooth'}</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800 rounded-xl bg-slate-950/80 border border-slate-700 overflow-hidden">
              {devices.map((dev) => (
                <div key={dev.id} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        dev.connected
                          ? 'bg-indigo-950 border border-indigo-500/40 text-indigo-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-500'
                      }`}
                    >
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{dev.name}</span>
                        {dev.type === 'screen_free' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 uppercase font-bold tracking-wider">
                            Screen-Free Tracker
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dev.connected ? `Connected • Battery ${dev.batteryLevel}%` : 'Disconnected'}
                      </span>
                    </div>
                  </div>

                  <button
                    id={`pair-toggle-${dev.id}`}
                    onClick={() => onToggleDeviceConnect(dev.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                      dev.connected
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white shadow-lg shadow-indigo-900/20'
                    }`}
                  >
                    {dev.connected ? 'Disconnect' : 'Pair Device'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BloodPressureAlertPopupProps {
  bloodPressure: BloodPressureData;
  onDismiss: () => void;
  onStartCalmingSession: () => void;
  onScheduleDoctor: () => void;
}

export const BloodPressureAlertPopup: React.FC<BloodPressureAlertPopupProps> = ({
  bloodPressure,
  onDismiss,
  onStartCalmingSession,
  onScheduleDoctor,
}) => {
  const isHigh = bloodPressure.status === 'high';
  const isLow = bloodPressure.status === 'low';

  if (!isHigh && !isLow) return null;

  return (
    <div
      id="blood-pressure-alert-popup"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 overflow-hidden ${
          isHigh
            ? 'bg-rose-950/90 border-rose-500/80 text-rose-100 shadow-rose-900/50'
            : 'bg-amber-950/90 border-amber-500/80 text-amber-100 shadow-amber-900/50'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isHigh ? 'bg-rose-900 border border-rose-400 text-rose-200 animate-bounce' : 'bg-amber-900 border border-amber-400 text-amber-200'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
              Smart Fitness Tracker Alert
            </span>
            <h2 className="text-lg font-black leading-tight">
              {isHigh ? 'High Blood Pressure Detected!' : 'Low Blood Pressure Alert!'}
            </h2>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono">
                {bloodPressure.systolic}/{bloodPressure.diastolic} mmHg
              </span>
              <span className="text-xs opacity-80 font-mono">HR: {bloodPressure.pulse} BPM</span>
            </div>
          </div>
        </div>

        <div className="my-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 leading-relaxed space-y-1.5">
          {isHigh ? (
            <>
              <p className="font-semibold text-rose-300">Clinical Advice for High Pressure:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Begin 4-7-8 Diaphragmatic Breathwork to lower sympathetic nervous tension.</li>
                <li>Drink a glass of mineral water and sit upright with feet flat on the floor.</li>
                <li>Avoid sudden intense exertion or caffeine.</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-semibold text-amber-300">Clinical Advice for Low Pressure:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Drink a glass of water with light electrolytes.</li>
                <li>Rest in a seated position or slightly elevate your feet to support venous return.</li>
                <li>Avoid standing up abruptly to prevent lightheadedness.</li>
              </ul>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {isHigh && (
            <button
              id="bp-start-breathing-btn"
              onClick={() => {
                onDismiss();
                onStartCalmingSession();
              }}
              className="py-2.5 px-3 rounded-xl bg-white text-rose-950 font-bold text-xs shadow-lg transition hover:bg-rose-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Start 4-7-8 Breathing</span>
            </button>
          )}

          <button
            id="bp-schedule-doctor-btn"
            onClick={() => {
              onDismiss();
              onScheduleDoctor();
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Consult Doctor</span>
          </button>

          <button
            id="bp-dismiss-alert-btn"
            onClick={onDismiss}
            className="py-2.5 px-3 rounded-xl bg-slate-950/50 hover:bg-slate-950 text-slate-300 font-medium text-xs transition flex items-center justify-center cursor-pointer col-span-full sm:col-auto"
          >
            Dismiss Alert
          </button>
        </div>
      </div>
    </div>
  );
};
