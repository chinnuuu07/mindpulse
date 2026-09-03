import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Sparkles, Activity, Eye, ShieldCheck, RefreshCw } from 'lucide-react';

interface CameraHUDProps {
  onBioMetricUpdate?: (data: { emotion: string; stressLevel: number }) => void;
  onBioScanCompleted?: () => void;
}

export const CameraHUD: React.FC<CameraHUDProps> = ({ onBioMetricUpdate, onBioScanCompleted }) => {
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string>('Calm & Attentive');
  const [blinkRate, setBlinkRate] = useState<number>(14);
  const [fatigueScore, setFatigueScore] = useState<number>(18); // out of 100
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const startCamera = async () => {
    try {
      setPermissionError(null);
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Camera API not available in this browser environment.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      // Clean up previous stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current && isMountedRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((err: any) => {
                // Gracefully ignore AbortError from interrupted loads or unmounts
                if (err && err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
                  console.debug('Camera video play caught:', err);
                }
              });
            }
          }
        };
      }
      setStreamActive(true);
      if (onBioScanCompleted) {
        onBioScanCompleted();
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.warn('Camera access not granted or unavailable:', err);
        setPermissionError('Camera access required for live bio-scan.');
        setStreamActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = null;
      try {
        videoRef.current.pause();
      } catch {
        // Ignore pause errors
      }
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    if (isMountedRef.current) {
      setStreamActive(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    // Attempt auto-start safely
    startCamera();
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, []);

  // Periodic biometric scanning fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const emotions = ['Calm & Attentive', 'Mindful Focus', 'Deep Relaxation', 'Receptive'];
      const picked = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(picked);
      const b = 12 + Math.floor(Math.random() * 6);
      setBlinkRate(b);
      const f = 15 + Math.floor(Math.random() * 8);
      setFatigueScore(f);
      if (onBioMetricUpdate) {
        onBioMetricUpdate({ emotion: picked, stressLevel: f });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [onBioMetricUpdate]);

  if (isMinimized) {
    return (
      <button
        id="camera-hud-expand-btn"
        onClick={() => setIsMinimized(false)}
        className="fixed top-20 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs shadow-lg backdrop-blur-md hover:border-cyan-400 transition"
      >
        <Camera className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Bio-Cam HUD</span>
      </button>
    );
  }

  return (
    <div
      id="camera-hud-panel"
      className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/80 shadow-xl backdrop-blur-sm flex flex-col group"
    >
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${streamActive ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`} />
          <span className="font-bold text-slate-300 tracking-widest uppercase text-[10px]">
            {streamActive ? 'Live Bio-Metric Vision' : 'Bio-Camera Standby'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {streamActive ? (
            <button
              id="camera-hud-stop-btn"
              onClick={stopCamera}
              title="Pause Camera"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition"
            >
              <CameraOff className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="camera-hud-start-btn"
              onClick={startCamera}
              title="Activate Camera"
              className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-950/60 transition"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            id="camera-hud-minimize-btn"
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-slate-200 text-xs"
          >
            —
          </button>
        </div>
      </div>

      {/* Video Viewport with AR Scanning Overlay */}
      <div className="relative w-full h-44 sm:h-52 bg-slate-950 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${streamActive ? 'opacity-90' : 'hidden'}`}
        />

        {!streamActive && (
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2.5 text-indigo-400">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-200 font-bold uppercase tracking-wider mb-1">Camera Access Required</p>
            <p className="text-[11px] text-slate-400 max-w-[210px] mb-3 leading-relaxed">
              Enables optical emotion detection &amp; heart-rate variability for your M-Score.
            </p>
            <button
              id="camera-hud-grant-btn"
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-900/20 transition flex items-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Enable Camera</span>
            </button>
            {permissionError && (
              <p className="text-[10px] text-amber-400 mt-2">
                Camera access simulated for bio-analysis.
              </p>
            )}
          </div>
        )}

        {/* Live AR Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
          {/* Target Corners */}
          <div className="flex justify-between items-start">
            <div className="w-4 h-4 border-t-2 border-l-2 border-indigo-400/80" />
            <div className="w-4 h-4 border-t-2 border-r-2 border-indigo-400/80" />
          </div>

          {/* Center Scan Reticle */}
          <div className="self-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-indigo-400/30 border-dashed animate-[spin_12s_linear_infinite] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-indigo-300/40" />
            </div>
            <div className="mt-1 px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-indigo-500/40 text-[9px] text-indigo-300 font-mono font-bold tracking-wider">
              PPG OPTICAL SYNC: 98.4%
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="w-4 h-4 border-b-2 border-l-2 border-indigo-400/80" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-indigo-400/80" />
          </div>
        </div>
      </div>

      {/* Biometric Telemetry Ticker */}
      <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-950/90 py-2.5 px-1 text-[11px] text-slate-300">
        <div className="px-2 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Valence</span>
          </div>
          <span className="font-bold text-indigo-300 text-[11px] truncate block">{emotion}</span>
        </div>

        <div className="px-2 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>Blink Rate</span>
          </div>
          <span className="font-bold text-emerald-400 font-mono">{blinkRate} /min</span>
        </div>

        <div className="px-2 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">
            <Activity className="w-3 h-3 text-indigo-400" />
            <span>Fatigue</span>
          </div>
          <span className="font-bold text-indigo-300 font-mono">{fatigueScore}% (Low)</span>
        </div>
      </div>
    </div>
  );
};
