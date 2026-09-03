import React, { useState } from 'react';
import { UserProfile, Gender, Friend } from '../types';
import { INITIAL_FRIENDS } from '../data/mockData';
import { Interactive3DHeroCanvas } from './Interactive3DHeroCanvas';
import { Tilt3DCard } from './Tilt3DCard';
import { Floating3DBackground } from './Floating3DBackground';
import {
  Shield,
  Sparkles,
  UserPlus,
  LogIn,
  Lock,
  User,
  Heart,
  UserMinus,
  Ban,
  CheckCircle2,
  ArrowRight,
  Brain,
  Camera,
  Watch,
  Activity,
  Award,
  Moon,
  ChevronDown,
  Menu,
  X,
  Stethoscope,
  Pill,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';

interface FrontPageAuthProps {
  onLoginSuccess: (user: UserProfile) => void;
  initialFriends?: Friend[];
}

export const FrontPageAuth: React.FC<FrontPageAuthProps> = ({
  onLoginSuccess,
  initialFriends = INITIAL_FRIENDS,
}) => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Login form state
  const [loginUserId, setLoginUserId] = useState<string>('alex_rivera');
  const [loginPassword, setLoginPassword] = useState<string>('mindful2026');

  // Register form state
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [registerFriends, setRegisterFriends] = useState<Friend[]>(initialFriends.slice(0, 3));
  const [blockedFriends, setBlockedFriends] = useState<string[]>([]);

  // Interactive 3D preview state
  const [previewActiveTab, setPreviewActiveTab] = useState<'avatar' | 'camera' | 'biometrics'>('avatar');

  const handleRemoveFriend = (friendId: string) => {
    setRegisterFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const handleBlockFriend = (friendId: string) => {
    if (!blockedFriends.includes(friendId)) {
      setBlockedFriends((prev) => [...prev, friendId]);
    }
  };

  const handleUnblockFriend = (friendId: string) => {
    setBlockedFriends((prev) => prev.filter((id) => id !== friendId));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginUserId.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both User ID and Password.');
      return;
    }

    // Authenticate and open profile on second page
    const authenticatedUser: UserProfile = {
      id: loginUserId.trim(),
      name: loginUserId === 'alex_rivera' ? 'Alex Rivera' : loginUserId,
      age: 26,
      gender: 'Male',
      friends: INITIAL_FRIENDS,
      blockedFriends: [],
      currentMScore: 85,
      previousMScore: 78,
      avatarConfig: {
        style: 'hologram',
        glowColor: '#06b6d4',
        hairStyle: 'halo',
        hasVisor: false,
        voiceName: 'AURA Calming',
        voicePitch: 1.0,
        voiceRate: 1.0,
        autoSpeech: true,
      },
    };

    onLoginSuccess(authenticatedUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!age || age < 10 || age > 120) {
      setErrorMsg('Please enter a valid age between 10 and 120.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    const newUser: UserProfile = {
      id: name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(100 + Math.random() * 900),
      name: name.trim(),
      age: Number(age),
      gender: gender,
      friends: registerFriends.filter((f) => !blockedFriends.includes(f.id)),
      blockedFriends: blockedFriends,
      currentMScore: 80,
      previousMScore: 75,
      avatarConfig: {
        style: 'hologram',
        glowColor: '#06b6d4',
        hairStyle: 'halo',
        hasVisor: false,
        voiceName: 'AURA Calming',
        voicePitch: 1.0,
        voiceRate: 1.0,
        autoSpeech: true,
      },
    };

    onLoginSuccess(newUser);
  };

  const handleQuickDemoLogin = () => {
    setLoginUserId('alex_rivera');
    setLoginPassword('mindful2026');
    const demoUser: UserProfile = {
      id: 'alex_rivera',
      name: 'Alex Rivera',
      age: 26,
      gender: 'Male',
      friends: INITIAL_FRIENDS,
      blockedFriends: [],
      currentMScore: 85,
      previousMScore: 78,
      avatarConfig: {
        style: 'hologram',
        glowColor: '#06b6d4',
        hairStyle: 'halo',
        hasVisor: false,
        voiceName: 'AURA Calming',
        voicePitch: 1.0,
        voiceRate: 1.0,
        autoSpeech: true,
      },
    };
    onLoginSuccess(demoUser);
  };

  const scrollToAuth = (mode: 'login' | 'register') => {
    setIsRegistering(mode === 'register');
    const authElement = document.getElementById('auth-portal-section');
    if (authElement) {
      authElement.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-[#F5F7FA] relative overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* 3D Floating Particle Depth Background */}
      <Floating3DBackground opacity={0.35} />

      {/* Futuristic Radial Lighting Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ──────────────────────────────────────────────────────────
          1. FLOATING 2026 GLASSMORPHIC NAVBAR
          ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-3 sm:top-5 inset-x-0 z-50 max-w-6xl mx-auto px-4 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto bg-[#101522]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl shadow-black/60 transition-all duration-300 hover:border-indigo-500/30">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#080B12] rounded-[11px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white">
                  M-SCORE <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono font-bold tracking-wide">
                  2026 BIO-SUITE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Cognitive Resilience &amp; rPPG Telemetry
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#avatar-engine" className="hover:text-cyan-400 transition">3D AI Avatar</a>
            <a href="#biometrics" className="hover:text-cyan-400 transition">rPPG &amp; Wearables</a>
            <a href="#clinical" className="hover:text-cyan-400 transition">Clinical Protocols</a>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Engine v4.2 Live</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleQuickDemoLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-300 hover:bg-slate-800 transition cursor-pointer"
              title="One-Click Demo Login as Alex Rivera"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demo Access</span>
            </button>

            <button
              onClick={() => scrollToAuth('login')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mt-2 p-4 rounded-2xl bg-[#101522]/95 border border-white/10 backdrop-blur-2xl lg:hidden flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-300 hover:text-white py-1"
            >
              Features
            </a>
            <a
              href="#avatar-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-300 hover:text-white py-1"
            >
              3D AI Avatar
            </a>
            <a
              href="#biometrics"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-300 hover:text-white py-1"
            >
              rPPG &amp; Wearables
            </a>
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demo Login (Alex Rivera • M-Score 85)</span>
              </button>
              <button
                onClick={() => scrollToAuth('register')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New Account</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ──────────────────────────────────────────────────────────
          2. HERO SECTION: 3D INTERACTIVE HERO CANVAS & PITCH
          ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines, Telemetry, and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101522] border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="uppercase tracking-widest font-mono text-[10px] text-cyan-300 font-bold">
                Next-Gen 2026 Bio-Resilience Architecture
              </span>
            </div>

            {/* Display Hero Title */}
            <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Elevate Your <br />
              <span className="glow-gradient-text">Cognitive Resilience</span> <br />
              With Interactive 3D AI.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-8">
              A clinical-grade bio-telemetry ecosystem uniting contactless facial rPPG photoplethysmography, HeyGen 3D avatars with 6-step cognitive reasoning, circadian autonomic regulation, and wearable synchrony.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={() => scrollToAuth('login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Launch AI Companion</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-demo-quick-btn"
                onClick={handleQuickDemoLogin}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#101522] border border-white/10 hover:border-indigo-500/40 text-slate-200 hover:text-white text-sm font-bold tracking-wide shadow-lg hover:-translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Instant Demo (Alex • M-85)</span>
              </button>
            </div>

            {/* Real-time Bio-Telemetry Ticker Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              <div className="p-3 rounded-xl bg-[#101522]/80 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">M-Score™ Index</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold font-mono text-cyan-400">85</span>
                  <span className="text-[10px] text-slate-500">/100</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-mono">+8.4 pts this week</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101522]/80 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Blood Pressure</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold font-mono text-emerald-400">118/76</span>
                  <span className="text-[10px] text-slate-500">mmHg</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">Optimum Harmony</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101522]/80 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Neuroplasticity</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold font-mono text-indigo-300">+14.2%</span>
                </div>
                <span className="text-[9px] text-indigo-400 font-mono">Cognitive Uplift</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101522]/80 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Connected Sensor</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs font-bold text-white truncate">Whoop 4.0</span>
                </div>
                <span className="text-[9px] text-cyan-400 font-mono">Real-time Stream</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Hero Element with WebGL Canvas */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Tilt3DCard
              maxTilt={6}
              className="w-full max-w-lg aspect-square rounded-3xl bg-[#101522]/70 border border-indigo-500/20 backdrop-blur-2xl shadow-2xl shadow-indigo-950/40 p-2 flex items-center justify-center"
            >
              <Interactive3DHeroCanvas onCoreClick={handleQuickDemoLogin} />
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. FEATURE SHOWCASE (3D TILT CARDS & 2026 SYSTEM)
          ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider font-mono text-[10px]">Integrated Clinical Subsystems</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Bio-Resilience Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Every layer engineered to measure, understand, and elevate human cognition and autonomic stability through real-time multi-modal AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: HeyGen Look 2 Streamer Avatar */}
          <Tilt3DCard className="p-6 rounded-2xl bg-[#101522]/70 border border-white/10 hover:border-indigo-500/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Brain className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                HeyGen Streamer 3D Avatar &amp; 6-Step Brain
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Conversational companion with real-time lip synchrony, responsive facial emotion rig, and a 6-stage cognitive decision pipeline evaluating user responses and providing empathetic coaching.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span>Dynamic Facial Rigging</span>
              <span>•</span>
              <span>Look 2 Streamer</span>
            </div>
          </Tilt3DCard>

          {/* Card 2: Contactless Bio-Camera HUD */}
          <Tilt3DCard className="p-6 rounded-2xl bg-[#101522]/70 border border-white/10 hover:border-cyan-500/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Camera className="w-6 h-6 text-cyan-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Contactless Bio-Camera rPPG HUD
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Measures microscopic sub-surface capillary blood volumetric pulses from your webcam feed using remote photoplethysmography algorithms to track HRV and mental fatigue.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span>Zero Wearables Required</span>
              <span>•</span>
              <span>Optic Pulse</span>
            </div>
          </Tilt3DCard>

          {/* Card 3: Smartwatch & Wearable Fusion */}
          <Tilt3DCard className="p-6 rounded-2xl bg-[#101522]/70 border border-white/10 hover:border-purple-500/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Watch className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Screen-Free Sensor &amp; BP Sync
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Continuous background pairing with Whoop 4.0, Apple Health, and Oura Ring. Instant visual and acoustic alerts when systolic/diastolic thresholds deviate from homeostasis.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-purple-400">
              <span>Continuous Telemetry</span>
              <span>•</span>
              <span>Alert Popups</span>
            </div>
          </Tilt3DCard>

          {/* Card 4: Neuroplastic Logic Puzzles & Gamification */}
          <Tilt3DCard className="p-6 rounded-2xl bg-[#101522]/70 border border-white/10 hover:border-amber-500/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Award className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Neuroplastic Puzzles &amp; Gamified Ranks
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Stimulate frontal lobe plasticity with adaptive visual pattern puzzles. Earn XP, level up across 5 master tiers (Initiate to Neuro Luminary), and challenge peers on the leaderboard.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400">
              <span>Confetti Rewards</span>
              <span>•</span>
              <span>Leaderboards</span>
            </div>
          </Tilt3DCard>

          {/* Card 5: Circadian Sleep & 4-7-8 Breathwork */}
          <Tilt3DCard className="p-6 rounded-2xl bg-[#101522]/70 border border-white/10 hover:border-emerald-500/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Moon className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Circadian Sanctuary &amp; 4-7-8 Breathwork
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Autonomous nervous system recalibration guided by harmonic frequency generators, diaphragmatic timing circles, and nutritional nitric oxide recommendations for vascular health.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span>Synthesizer Audio</span>
              <span>•</span>
              <span>Nitric Oxide Guide</span>
            </div>
          </Tilt3DCard>

          {/* Card 6: Clinical Tele-Scheduler & Medication Vault */}
          <Tilt3DCard className="p-6 rounded-2xl bg-[#101522]/70 border border-white/10 hover:border-rose-500/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <Stethoscope className="w-6 h-6 text-rose-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Tele-Specialist Appointments &amp; Vault
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Instant encrypted appointments with board-certified neuropsychiatrists and cardiologist specialists. One-tap medication adherence logs with M-Score reward incentives.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-rose-400">
              <span>Doctor Tele-Scheduler</span>
              <span>•</span>
              <span>Prescription Sync</span>
            </div>
          </Tilt3DCard>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. AUTHENTICATION & ONBOARDING PORTAL (PRESERVING ALL LOGIC)
          ────────────────────────────────────────────────────────── */}
      <section id="auth-portal-section" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto z-10 relative">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider font-bold text-[10px]">Secure Clinical Portal Access</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Sign In or Create Account
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Access your personalized 3D companion, biometric graphs, and connected peers.
          </p>
        </div>

        {/* Auth Glassmorphic Card */}
        <Tilt3DCard
          maxTilt={4}
          className="w-full max-w-lg mx-auto bg-[#101522]/90 border border-indigo-500/25 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
        >
          {/* Toggle Nav between Login and Create an Account */}
          <div className="flex rounded-xl bg-slate-950/90 p-1 mb-6 border border-slate-800">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                !isRegistering
                  ? 'bg-indigo-600 border border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              id="tab-create-account-btn"
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isRegistering
                  ? 'bg-indigo-600 border border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {errorMsg}
            </div>
          )}

          {!isRegistering ? (
            /* 1. Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  User ID / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-user-id"
                    type="text"
                    value={loginUserId}
                    onChange={(e) => setLoginUserId(e.target.value)}
                    placeholder="e.g. alex_rivera"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 border border-indigo-400 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-900/30 transition flex items-center justify-center gap-2 mt-2 cursor-pointer hover:shadow-cyan-500/20"
              >
                <span>Login &amp; Open Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-[#101522] px-2 text-slate-500">Quick Access</span>
                </div>
              </div>

              <button
                id="login-demo-btn"
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400/50 hover:bg-slate-800 text-cyan-300 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demo Login (Alex Rivera • M-Score 85)</span>
              </button>
            </form>
          ) : (
            /* 2. Create an Account Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Taylor"
                  className="w-full px-3 py-2 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    id="register-age"
                    type="number"
                    min="10"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 24"
                    className="w-full px-3 py-2 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    id="register-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Friends Setup Section: Access to block and remove friend */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Connect Friends (Remove &amp; Block)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {registerFriends.length} suggested
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
                  {registerFriends.map((friend) => {
                    const isBlocked = blockedFriends.includes(friend.id);
                    return (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-900 border border-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <span className={`font-medium ${isBlocked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {friend.name}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono ml-1.5">M-{friend.mScore}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => handleUnblockFriend(friend.id)}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300 hover:bg-slate-700 cursor-pointer"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleBlockFriend(friend.id)}
                              title="Block Friend"
                              className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 cursor-pointer"
                            >
                              <Ban className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveFriend(friend.id)}
                            title="Remove Friend"
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                          >
                            <UserMinus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm pass"
                    className="w-full px-3 py-2 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 border border-indigo-400 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-900/30 transition flex items-center justify-center gap-2 mt-3 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Registration &amp; Open Profile</span>
              </button>
            </form>
          )}
        </Tilt3DCard>

        {/* Safety & Compliance Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 uppercase tracking-wider font-bold">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>End-to-End Encrypted Mental Health &amp; Biometric Telemetry</span>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. 2026 FUTURISTIC FOOTER
          ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 bg-[#080B12] py-10 px-4 sm:px-8 mt-12 z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-white tracking-wider">M-SCORE AI PLATFORM</span>
              <p className="text-[10px] text-slate-500">Clinical Cognitive Architecture • Node 242-LX</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> WebGL 2.0 Ready
            </span>
            <span>HIPAA Compliant</span>
            <span>rPPG Optical Scan</span>
          </div>

          <div className="text-[10px] text-slate-600">
            © 2026 M-Score AI Systems Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
