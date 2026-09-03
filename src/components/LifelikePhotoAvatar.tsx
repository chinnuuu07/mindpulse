import React, { useEffect, useRef, useState } from 'react';
import {
  AvatarConfig,
  AvatarEmotion,
  AvatarGesture,
  AvatarPose,
  AvatarLanguage,
} from '../types';
import {
  Sparkles,
  Volume2,
  Mic,
  ThumbsUp,
  Hand,
  HelpCircle,
  HeartHandshake,
  UserCheck,
  Eye,
  Sliders,
  Heart,
  Smile,
  CheckCircle2,
  Settings,
} from 'lucide-react';

interface LifelikePhotoAvatarProps {
  config: AvatarConfig;
  isSpeaking: boolean;
  isListening?: boolean;
  mScore?: number;
  emotion?: AvatarEmotion;
  gesture?: AvatarGesture;
  pose?: AvatarPose;
  language?: AvatarLanguage;
  spokenText?: string;
  onOpenCustomizer?: () => void;
  onGestureTrigger?: (gesture: AvatarGesture) => void;
  onPoseToggle?: (pose: AvatarPose) => void;
  showPoseControls?: boolean;
}

// HeyGen Studio Streamer Female Look 2 URL from user request
export const HEYGEN_LOOK2_URL =
  'https://dynamic.heygen.ai/tr:h-600,c-at_max,f-auto/avatar_remix_template/studio_streamer_female/looks/look2.png';

// Emotional & Speaking Expression States for HeyGen Look 2 Streamer Avatar
const HEYGEN_IMAGES = {
  portrait: HEYGEN_LOOK2_URL,
  speaking: '/avatar/heygen/speaking.jpg',
  thoughtful: '/avatar/heygen/thoughtful.jpg',
  excited: '/avatar/heygen/excited.jpg',
  empathic: '/avatar/heygen/thoughtful.jpg',
};

// Alternative Warm Sunlight Portrait Look
const SUNLIGHT_IMAGES = {
  portrait: '/avatar/portrait.jpg',
  speaking: '/avatar/speaking.jpg',
  thoughtful: '/avatar/thoughtful.jpg',
  excited: '/avatar/excited.jpg',
  empathic: '/avatar/empathic.jpg',
};

export const LifelikePhotoAvatar: React.FC<LifelikePhotoAvatarProps> = ({
  config,
  isSpeaking,
  isListening = false,
  mScore = 85,
  emotion = 'happy',
  gesture = 'resting',
  pose = 'standing',
  language = 'en',
  spokenText = '',
  onOpenCustomizer,
  onGestureTrigger,
  onPoseToggle,
  showPoseControls = true,
}) => {
  // Active Avatar Look: default to HeyGen Look 2 Streamer as requested
  const [avatarLook, setAvatarLook] = useState<'heygen' | 'sunlight'>('heygen');

  // Physical Face & Body Rig State
  const [blinkState, setBlinkState] = useState<'open' | 'closing' | 'closed' | 'opening'>('open');
  const [viseme, setViseme] = useState<'rest' | 'aa' | 'ee' | 'oh' | 'mm'>('rest');
  const [headTransform, setHeadTransform] = useState({
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    translateY: 0,
    scale: 1,
  });
  const [eyeGaze, setEyeGaze] = useState({ x: 0, y: 0 });
  const [microExpression, setMicroExpression] = useState<{
    browLeft: number;
    browRight: number;
    smileIntensity: number;
    cheekLift: number;
  }>({
    browLeft: 0,
    browRight: 0,
    smileIntensity: 0.5,
    cheekLift: 0.3,
  });

  // Current active emotional base image key
  const [activeImageKey, setActiveImageKey] = useState<keyof typeof HEYGEN_IMAGES>('portrait');
  const [currentGesture, setCurrentGesture] = useState<AvatarGesture>(gesture);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [expressiveness, setExpressiveness] = useState<'natural' | 'subtle' | 'expressive'>('natural');

  // Turn-taking state tracker
  const wasListeningRef = useRef(isListening);
  const [turnTakingCue, setTurnTakingCue] = useState<string | null>(null);

  const activeImageSet = avatarLook === 'heygen' ? HEYGEN_IMAGES : SUNLIGHT_IMAGES;

  // Sync incoming gesture prop
  useEffect(() => {
    setCurrentGesture(gesture);
  }, [gesture]);

  // Determine emotional image based on context & speaking state
  useEffect(() => {
    if (isSpeaking) {
      if (emotion === 'happy' || emotion === 'excited') {
        setActiveImageKey('excited');
      } else if (emotion === 'thoughtful') {
        setActiveImageKey('thoughtful');
      } else if (emotion === 'empathetic' || emotion === 'concerned' || emotion === 'sad') {
        setActiveImageKey('empathic');
      } else {
        setActiveImageKey('speaking');
      }
    } else if (isListening) {
      setActiveImageKey('thoughtful');
    } else {
      if (emotion === 'excited' || emotion === 'happy') {
        setActiveImageKey('excited');
      } else if (emotion === 'thoughtful') {
        setActiveImageKey('thoughtful');
      } else if (emotion === 'empathetic' || emotion === 'concerned') {
        setActiveImageKey('empathic');
      } else {
        setActiveImageKey('portrait');
      }
    }
  }, [emotion, isSpeaking, isListening]);

  // Turn-taking reaction: user finishes talking -> avatar acknowledges with a nod
  useEffect(() => {
    if (wasListeningRef.current && !isListening) {
      // User just finished talking! Give a turn-taking comprehension nod & smile
      setTurnTakingCue('Comprehending response...');
      setHeadTransform({
        rotX: 4.5,
        rotY: 0,
        rotZ: -1.5,
        translateY: 4,
        scale: 1.02,
      });

      const timer = setTimeout(() => {
        setTurnTakingCue(null);
        setHeadTransform((prev) => ({
          ...prev,
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          translateY: 0,
          scale: 1,
        }));
      }, 550);
      return () => clearTimeout(timer);
    }
    wasListeningRef.current = isListening;
  }, [isListening]);

  // 1. REALISTIC BIOLOGICAL BLINK CYCLE WITH NATURAL IMPERFECTIONS
  useEffect(() => {
    let timeoutId: any;
    const triggerBlink = () => {
      // Natural fast eyelid descent
      setBlinkState('closing');
      setTimeout(() => {
        setBlinkState('closed');
        setTimeout(() => {
          setBlinkState('opening');
          setTimeout(() => {
            setBlinkState('open');

            // 18% chance of spontaneous double-blink (natural human imperfection)
            if (Math.random() < 0.18) {
              setTimeout(() => {
                setBlinkState('closing');
                setTimeout(() => {
                  setBlinkState('closed');
                  setTimeout(() => {
                    setBlinkState('opening');
                    setTimeout(() => setBlinkState('open'), 90);
                  }, 40);
                }, 40);
              }, 120);
            }
          }, 90);
        }, 50);
      }, 40);

      // Random next blink interval between 2.4s and 5.2s
      const nextInterval = Math.random() * 2800 + 2400;
      timeoutId = setTimeout(triggerBlink, nextInterval);
    };

    timeoutId = setTimeout(triggerBlink, 2600);
    return () => clearTimeout(timeoutId);
  }, []);

  // 2. NATURAL EYE SACCADES & DIRECT EYE CONTACT
  useEffect(() => {
    let saccadeTimeout: any;

    const performSaccade = () => {
      if (isListening) {
        // While actively listening, keep attentive direct eye contact with minimal drift
        setEyeGaze({
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.2,
        });
      } else if (emotion === 'thoughtful') {
        // Looking slightly up-left while formulating thoughts or thinking
        setEyeGaze({
          x: -3.5 + (Math.random() - 0.5) * 1.5,
          y: -2.8 + (Math.random() - 0.5) * 1.0,
        });
      } else {
        // Natural small conversational eye micro-movements
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2.8;
        setEyeGaze({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * (radius * 0.7),
        });
      }

      // Return to center contact after a brief glance
      setTimeout(() => {
        setEyeGaze({ x: 0, y: 0 });
      }, 900 + Math.random() * 600);

      const nextSaccadeTime = Math.random() * 2500 + 2000;
      saccadeTimeout = setTimeout(performSaccade, nextSaccadeTime);
    };

    saccadeTimeout = setTimeout(performSaccade, 2200);
    return () => clearTimeout(saccadeTimeout);
  }, [isListening, emotion]);

  // 3. REAL-TIME LIP SYNCHRONIZATION (PHONETIC VISEMES)
  useEffect(() => {
    if (!isSpeaking) {
      setViseme('rest');
      return;
    }

    const visemeSequence: Array<'aa' | 'ee' | 'oh' | 'mm' | 'rest'> = [
      'aa',
      'ee',
      'oh',
      'aa',
      'mm',
      'ee',
      'oh',
      'rest',
      'aa',
      'ee',
    ];
    let currentIndex = 0;

    const phonemeInterval = setInterval(() => {
      // Choose next viseme with organic rhythm
      currentIndex = (currentIndex + 1) % visemeSequence.length;
      setViseme(visemeSequence[currentIndex]);
    }, 110);

    return () => clearInterval(phonemeInterval);
  }, [isSpeaking]);

  // 4. NATURAL HEAD NODS, TILTS, AND ACTIVE LISTENING BODY LANGUAGE
  useEffect(() => {
    let animFrame: number;
    let startTime = Date.now();

    const animateHeadAndPosture = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Base breathing cycle (gentle expansion of chest and rise of shoulders in cream sweater)
      const breathingOffsetY = Math.sin(elapsed * 1.4) * 1.2;

      let targetRotX = 0;
      let targetRotY = 0;
      let targetRotZ = 0;
      let targetScale = 1;

      if (isListening) {
        // ACTIVE LISTENING: Lean forward toward user, gentle nodding, warm attention
        targetScale = 1.03;
        targetRotX = 2.5 + Math.sin(elapsed * 2.2) * 2.2; // Attentive nodding
        targetRotZ = 1.8; // Gentle inquisitive head tilt
        targetRotY = Math.sin(elapsed * 0.8) * 1.5;
      } else if (isSpeaking) {
        // SPEAKING: Conversational emphasis, cadence head nodding and slight lateral turns
        targetRotX = Math.sin(elapsed * 3.5) * 2.2;
        targetRotY = Math.sin(elapsed * 1.8) * 2.5;
        targetRotZ = Math.cos(elapsed * 1.5) * 1.8;
        targetScale = 1.015;
      } else if (emotion === 'thoughtful') {
        // THOUGHTFUL: Inquisitive head tilt
        targetRotZ = -3.2;
        targetRotX = -1.2;
        targetRotY = -2.0;
      } else if (emotion === 'empathetic') {
        // EMPATHETIC: Compassionate soft head tilt and slight lean
        targetRotZ = 2.4;
        targetRotX = 1.5;
        targetScale = 1.015;
      } else {
        // IDLE: Subtle organic micro-drift
        targetRotX = Math.sin(elapsed * 0.7) * 1.0;
        targetRotY = Math.cos(elapsed * 0.5) * 1.2;
        targetRotZ = Math.sin(elapsed * 0.4) * 0.8;
      }

      setHeadTransform({
        rotX: targetRotX,
        rotY: targetRotY,
        rotZ: targetRotZ,
        translateY: breathingOffsetY,
        scale: targetScale,
      });

      animFrame = requestAnimationFrame(animateHeadAndPosture);
    };

    animFrame = requestAnimationFrame(animateHeadAndPosture);
    return () => cancelAnimationFrame(animFrame);
  }, [isListening, isSpeaking, emotion]);

  // 5. MICRO-EXPRESSIONS (EYEBROWS, CHEEKS, DUCHENNE SMILE CRINKLE)
  useEffect(() => {
    if (emotion === 'excited' || emotion === 'happy') {
      setMicroExpression({
        browLeft: -1.5,
        browRight: -1.5,
        smileIntensity: 0.95,
        cheekLift: 0.8,
      });
    } else if (emotion === 'thoughtful') {
      setMicroExpression({
        browLeft: 2.5, // One eyebrow raised inquisitively
        browRight: -0.5,
        smileIntensity: 0.35,
        cheekLift: 0.2,
      });
    } else if (emotion === 'empathetic' || emotion === 'concerned') {
      setMicroExpression({
        browLeft: 1.5, // Inner brow furrow of care
        browRight: 1.5,
        smileIntensity: 0.45,
        cheekLift: 0.4,
      });
    } else if (emotion === 'surprised') {
      setMicroExpression({
        browLeft: 3.5,
        browRight: 3.5,
        smileIntensity: 0.6,
        cheekLift: 0.6,
      });
    } else {
      // Calm default
      setMicroExpression({
        browLeft: 0,
        browRight: 0,
        smileIntensity: 0.55,
        cheekLift: 0.35,
      });
    }
  }, [emotion]);

  const handleTriggerGesture = (newGesture: AvatarGesture) => {
    setCurrentGesture(newGesture);
    if (onGestureTrigger) onGestureTrigger(newGesture);

    // Auto-return to resting after 4 seconds
    if (newGesture !== 'resting') {
      setTimeout(() => {
        setCurrentGesture('resting');
        if (onGestureTrigger) onGestureTrigger('resting');
      }, 4200);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-slate-950/60 rounded-3xl">
      {/* ──────────────────────────────────────────────────────────
          TOP BAR OVERLAY: STATUS, ACTIVE LISTENING, AND SETTINGS
          ────────────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/85 border border-indigo-500/40 backdrop-blur-md shadow-lg text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide">AURA</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">• Lifelike AI Companion</span>
          </div>

          {/* Active Listening Indicator */}
          {isListening && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-bold animate-pulse shadow-lg backdrop-blur-md">
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              <span>Active Listening...</span>
            </div>
          )}

          {/* Turn-Taking Cue */}
          {turnTakingCue && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-400 text-indigo-200 text-xs font-bold shadow-lg backdrop-blur-md animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{turnTakingCue}</span>
            </div>
          )}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Avatar Model / Look Switcher */}
          <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setAvatarLook('heygen')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                avatarLook === 'heygen' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="HeyGen Studio Streamer Look 2"
            >
              <span>HeyGen Look 2</span>
            </button>
            <button
              onClick={() => setAvatarLook('sunlight')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                avatarLook === 'sunlight' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Warm Sunlight Portrait Look"
            >
              <span>Sunlight</span>
            </button>
          </div>

          {showPoseControls && onPoseToggle && (
            <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5 text-[10px] font-bold">
              <button
                onClick={() => onPoseToggle('standing')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                  pose === 'standing' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Standing
              </button>
              <button
                onClick={() => onPoseToggle('sitting')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                  pose === 'sitting' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sitting
              </button>
            </div>
          )}

          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`p-2 rounded-xl border backdrop-blur-md transition cursor-pointer shadow-md ${
              showSettingsDrawer
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Avatar Behavior, Imperfections & Sensitivity Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MAIN STAGE: PHOTO-BASED LIFELIKE AVATAR WITH FULL BIOLOGY
          ────────────────────────────────────────────────────────── */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {/* Soft Golden Hour Ambient Glow behind girl */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-indigo-500/5 to-slate-950/80 pointer-events-none" />
        <div className="w-80 h-80 rounded-full bg-amber-400/15 blur-3xl absolute -top-10 pointer-events-none" />

        {/* 3D PARALLAX HEAD & BODY CONTAINER */}
        <div
          className="relative w-full h-full max-w-lg max-h-[520px] flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${headTransform.rotX}deg) rotateY(${headTransform.rotY}deg) rotateZ(${headTransform.rotZ}deg) translateY(${headTransform.translateY}px) scale(${headTransform.scale})`,
            transformOrigin: avatarLook === 'heygen' ? '50% 50%' : '50% 70%',
          }}
        >
          {/* Base Layer: High-Fidelity Exact Photo with Smooth Crossfade */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
            {Object.entries(activeImageSet).map(([key, src]) => (
              <img
                key={`${avatarLook}-${key}`}
                src={src}
                alt={`AURA ${avatarLook} ${key}`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Resilient fallback to local heygen asset if external HeyGen CDN has network restrictions
                  if (avatarLook === 'heygen' && key === 'portrait') {
                    (e.target as HTMLImageElement).src = '/avatar/heygen/portrait.png';
                  }
                }}
                className={`absolute inset-0 w-full h-full ${
                  avatarLook === 'heygen'
                    ? 'object-cover object-[center_20%] sm:object-center'
                    : 'object-cover object-center'
                } transition-opacity duration-500 ease-in-out ${
                  activeImageKey === key ? 'opacity-100 scale-100' : 'opacity-0 scale-98 pointer-events-none'
                }`}
                style={{
                  filter:
                    emotion === 'excited'
                      ? 'contrast(1.04) saturate(1.06) brightness(1.02)'
                      : emotion === 'empathetic'
                      ? 'contrast(0.98) saturate(0.98)'
                      : 'none',
                }}
              />
            ))}

            {/* ──────────────────────────────────────────────────────────
                NATURAL EYE MOVEMENT & REALISTIC BLINKING RIG OVERLAY
                Located optically over the eyes of this exact photo
                ────────────────────────────────────────────────────────── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                // Natural parallax with eye saccades
                transform: `translate(${eyeGaze.x * 1.5}px, ${eyeGaze.y * 1.5}px)`,
                transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {/* Left Eye Blink & Micro-Squint */}
              <div
                className={`absolute rounded-full overflow-hidden transition-all duration-75 ${
                  avatarLook === 'heygen'
                    ? 'w-[4.8%] h-[2.6%] left-[46.2%] top-[25.2%]'
                    : 'w-[8%] h-[4.2%] left-[37%] top-[19.8%]'
                }`}
                style={{
                  transform: `scaleY(${
                    blinkState === 'closed'
                      ? 0.05
                      : blinkState === 'closing' || blinkState === 'opening'
                      ? 0.45
                      : 1 - microExpression.cheekLift * 0.15
                  }) translateY(${microExpression.browLeft * 0.4}px)`,
                  transformOrigin: 'center 40%',
                }}
              >
                {/* Eyelid Skin tone cover when blinking */}
                <div
                  className={`w-full h-full ${
                    avatarLook === 'heygen' ? 'bg-[#dfb097]' : 'bg-[#dfb298]'
                  } transition-opacity duration-75 ${
                    blinkState === 'closed' || blinkState === 'closing' ? 'opacity-95 shadow-inner' : 'opacity-0'
                  }`}
                />
              </div>

              {/* Right Eye Blink & Micro-Squint */}
              <div
                className={`absolute rounded-full overflow-hidden transition-all duration-75 ${
                  avatarLook === 'heygen'
                    ? 'w-[4.8%] h-[2.6%] left-[52.4%] top-[25.2%]'
                    : 'w-[8%] h-[4.2%] left-[49.5%] top-[19.2%]'
                }`}
                style={{
                  transform: `scaleY(${
                    blinkState === 'closed'
                      ? 0.05
                      : blinkState === 'closing' || blinkState === 'opening'
                      ? 0.45
                      : 1 - microExpression.cheekLift * 0.15
                  }) translateY(${microExpression.browRight * 0.4}px)`,
                  transformOrigin: 'center 40%',
                }}
              >
                <div
                  className={`w-full h-full ${
                    avatarLook === 'heygen' ? 'bg-[#dfb097]' : 'bg-[#dfb298]'
                  } transition-opacity duration-75 ${
                    blinkState === 'closed' || blinkState === 'closing' ? 'opacity-95 shadow-inner' : 'opacity-0'
                  }`}
                />
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────
                LIP SYNCHRONIZATION OVERLAY
                Located optically over the mouth
                Matches phonetic visemes during spoken dialogue
                ────────────────────────────────────────────────────────── */}
            {isSpeaking && (
              <div
                className={`absolute pointer-events-none transition-transform duration-100 flex items-center justify-center ${
                  avatarLook === 'heygen'
                    ? 'left-[46.8%] top-[34.8%] w-[8.4%] h-[3.6%]'
                    : 'left-[41%] top-[27.8%] w-[14%] h-[4.8%]'
                }`}
                style={{
                  transform: `scaleX(${
                    viseme === 'ee' ? 1.15 : viseme === 'oh' ? 0.85 : 1.0
                  }) scaleY(${
                    viseme === 'aa' ? 1.4 : viseme === 'oh' ? 1.3 : viseme === 'mm' ? 0.3 : 0.8
                  })`,
                  transformOrigin: 'center center',
                }}
              >
                {/* Phonetic mouth opening with natural teeth & oral depth */}
                <div
                  className={`rounded-full transition-all duration-75 flex items-center justify-center ${
                    viseme === 'mm'
                      ? 'w-full h-[3px] bg-[#9e4a4a]'
                      : 'w-full h-full bg-[#5c1c1c] border-t border-[#fdf2f2] shadow-inner'
                  }`}
                >
                  {/* Pearly teeth hint for open visemes */}
                  {(viseme === 'aa' || viseme === 'ee') && (
                    <div className="w-3/4 h-[3px] bg-white/90 rounded-full mx-auto" />
                  )}
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────────
                GESTURE & BODY LANGUAGE OVERLAYS
                Thumbs Up, Thinking Hand, Wave, Namaste, Open Hands
                ────────────────────────────────────────────────────────── */}
            {currentGesture !== 'resting' && (
              <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-2 z-20 animate-fadeIn">
                {currentGesture === 'thumbs_up' && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/90 border border-amber-400/80 shadow-2xl backdrop-blur-md transform animate-bounce">
                    <span className="text-2xl">👍</span>
                    <span className="text-xs font-bold text-amber-300">"Excellent work! You nailed it!"</span>
                  </div>
                )}
                {currentGesture === 'wave' && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/90 border border-cyan-400/80 shadow-2xl backdrop-blur-md transform animate-pulse">
                    <span className="text-2xl">👋</span>
                    <span className="text-xs font-bold text-cyan-300">
                      {language === 'hi'
                        ? 'नमस्ते! (Namaste!)'
                        : language === 'te'
                        ? 'నమస్కారం! (Namaskaram!)'
                        : 'Warm greetings! Welcome back!'}
                    </span>
                  </div>
                )}
                {currentGesture === 'thinking' && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/90 border border-purple-400/80 shadow-2xl backdrop-blur-md transform">
                    <span className="text-2xl">🤔</span>
                    <span className="text-xs font-bold text-purple-300">"Pondering this challenge with you..."</span>
                  </div>
                )}
                {currentGesture === 'open_hands' && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/90 border border-rose-400/80 shadow-2xl backdrop-blur-md transform">
                    <span className="text-2xl">🤲</span>
                    <span className="text-xs font-bold text-rose-300">"Take a deep, peaceful breath with me."</span>
                  </div>
                )}
                {currentGesture === 'clapping' && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/90 border border-emerald-400/80 shadow-2xl backdrop-blur-md transform">
                    <span className="text-2xl">👏</span>
                    <span className="text-xs font-bold text-emerald-300">"Congratulations! Level accomplished!"</span>
                  </div>
                )}
              </div>
            )}

            {/* Speaking Voice Ripple Ring */}
            {isSpeaking && (
              <div className="absolute inset-0 rounded-2xl border-4 border-indigo-400/70 animate-pulse pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          BOTTOM QUICK GESTURE & INTERACTION DOCK
          ────────────────────────────────────────────────────────── */}
      <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md flex items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-slate-300">
          <span className="text-[10px] text-slate-400 uppercase font-mono mr-1 hidden sm:inline">
            Gestures:
          </span>
          <button
            onClick={() => handleTriggerGesture('thumbs_up')}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'thumbs_up'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Thumbs Up"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Thumbs Up</span>
          </button>
          <button
            onClick={() => handleTriggerGesture('wave')}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'wave'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Wave"
          >
            <Hand className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wave</span>
          </button>
          <button
            onClick={() => handleTriggerGesture('thinking')}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'thinking'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Thinking / Pondering"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Thinking</span>
          </button>
          <button
            onClick={() => handleTriggerGesture('open_hands')}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'open_hands'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Open Hands / Calming"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>Open Palms</span>
          </button>
        </div>

        {/* Emotion Indicator Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-indigo-500/40 text-[10px] font-mono text-indigo-300 capitalize flex items-center gap-1">
            <Smile className="w-3 h-3 text-indigo-400" />
            {emotion}
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          EXPANDABLE PERSONALIZATION & BIOLOGICAL SETTINGS DRAWER
          ────────────────────────────────────────────────────────── */}
      {showSettingsDrawer && (
        <div className="absolute inset-x-3 bottom-14 p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-xl z-40 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Lifelike Avatar Biological Controls
            </span>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Avatar Model Selector */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                Avatar Appearance
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setAvatarLook('heygen')}
                  className={`py-1 px-1.5 rounded text-[10px] font-bold transition cursor-pointer border truncate ${
                    avatarLook === 'heygen'
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="HeyGen Look 2 Streamer"
                >
                  HeyGen Look 2
                </button>
                <button
                  onClick={() => setAvatarLook('sunlight')}
                  className={`py-1 px-1.5 rounded text-[10px] font-bold transition cursor-pointer border truncate ${
                    avatarLook === 'sunlight'
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Sunlight Portrait"
                >
                  Sunlight
                </button>
              </div>
            </div>

            {/* Expressiveness Slider */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                Emotional Expressiveness
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['subtle', 'natural', 'expressive'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setExpressiveness(lvl)}
                    className={`py-1 rounded text-[10px] font-bold capitalize transition cursor-pointer border ${
                      expressiveness === lvl
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Listening Sensitivity */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                Active Listening Mode
              </label>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nodding & Eye Contact Active</span>
              </div>
            </div>

            {/* Natural Imperfections */}
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                Natural Imperfections
              </label>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-indigo-300 flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5" />
                <span>Random Saccades & Double Blinks</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
