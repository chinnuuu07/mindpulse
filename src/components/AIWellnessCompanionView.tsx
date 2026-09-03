import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  AvatarConfig,
  AvatarEmotion,
  AvatarGesture,
  AvatarPose,
  DynamicPuzzle,
  BrainInstruction,
  AvatarLanguage,
} from '../types';
import { ThreeAvatar } from './ThreeAvatar';
import {
  askAIBrain,
  DYNAMIC_PUZZLE_BANK,
} from '../data/avatarBrainEngine';
import { MULTILINGUAL_DATA } from '../data/gamificationAndFeedData';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Brain,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw,
  Trophy,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Activity,
  User,
  Mail,
  Code2,
  Lightbulb,
  ThumbsUp,
  Smile,
  LayoutGrid,
} from 'lucide-react';

interface AIWellnessCompanionViewProps {
  user: UserProfile;
  currentMScore: number;
  bloodPressureString: string;
  config: AvatarConfig;
  onUpdateMScore: (delta: number) => void;
  onSwitchToConsole: () => void;
  onOpenProfile: () => void;
  onOpenMessages: () => void;
}

export const AIWellnessCompanionView: React.FC<AIWellnessCompanionViewProps> = ({
  user,
  currentMScore,
  bloodPressureString,
  config,
  onUpdateMScore,
  onSwitchToConsole,
  onOpenProfile,
  onOpenMessages,
}) => {
  const [selectedLang, setSelectedLang] = useState<AvatarLanguage>('en');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [pose, setPose] = useState<AvatarPose>('standing');
  const [currentEmotion, setCurrentEmotion] = useState<AvatarEmotion>('calm');
  const [currentGesture, setCurrentGesture] = useState<AvatarGesture>('resting');
  const [activePuzzle, setActivePuzzle] = useState<DynamicPuzzle | null>(null);
  const [userSpeechInput, setUserSpeechInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [showBrainInspector, setShowBrainInspector] = useState<boolean>(true);

  // Latest Brain Instruction
  const [lastBrainInstruction, setLastBrainInstruction] = useState<BrainInstruction>({
    understoodResponse: `Session initialized for ${user.name}`,
    isCorrect: null,
    speech: `Hello ${user.name}! I am AURA, your friendly AI Wellness Companion. I can evaluate your answers, choose responsive facial expressions and gestures, provide encouragement, and guide your cognitive resilience. Try speaking or asking for a puzzle!`,
    emotion: 'happy',
    gesture: 'wave',
    giveEncouragement: true,
    encouragementNote: 'Welcome! Mindful check-ins establish emotional balance and neural plasticity.',
    next_action: 'ask_question',
    difficulty: 'maintain',
    mScoreChange: 0,
  });

  const [dialogueText, setDialogueText] = useState<string>(lastBrainInstruction.speech);
  const recognitionRef = useRef<any>(null);

  // Text-To-Speech with synchronized lips and gestures
  const speakDialogue = (text: string, langCode: AvatarLanguage = selectedLang) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`•]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const bcpMap: Record<AvatarLanguage, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
    };
    const targetCode = bcpMap[langCode] || 'en-US';
    utterance.lang = targetCode;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      (v) => v.lang.startsWith(targetCode) || v.lang.toLowerCase().includes(langCode)
    );
    if (voice) utterance.voice = voice;

    utterance.pitch = config.voicePitch || 1.05;
    utterance.rate = config.voiceRate || 0.98;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Microphone input)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang === 'en' ? 'en-US' : `${selectedLang}-IN`;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserSpeechInput(transcript);
        setIsListening(false);
        // Automatically evaluate verbal response
        handleProcessUserMessage(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [selectedLang, activePuzzle, difficulty]);

  // Initial welcome greeting
  useEffect(() => {
    // Initial wave greeting gesture
    setCurrentEmotion('happy');
    setCurrentGesture('wave');
    speakDialogue(dialogueText, selectedLang);
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your answer in the box below!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang =
          selectedLang === 'en' ? 'en-US' : `${selectedLang}-IN`;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  // Central Brain Processing Pipeline
  const handleProcessUserMessage = async (customMessage?: string) => {
    const messageToSend = (customMessage !== undefined ? customMessage : userSpeechInput).trim();
    if (!messageToSend || isEvaluating) return;

    setIsEvaluating(true);
    setUserSpeechInput('');

    try {
      const instruction = await askAIBrain({
        message: messageToSend,
        currentPuzzle: activePuzzle,
        difficulty,
        userProfile: user,
        currentMScore,
        language: selectedLang,
      });

      setLastBrainInstruction(instruction);
      setDialogueText(instruction.speech);
      setCurrentEmotion(instruction.emotion);
      setCurrentGesture(instruction.gesture);

      // Handle next_action
      if (instruction.next_action === 'success') {
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti errors
        }
        if (instruction.mScoreChange) {
          onUpdateMScore(instruction.mScoreChange);
        }
        // Dismiss solved puzzle or transition to next
        setActivePuzzle(null);
      } else if (instruction.next_action === 'give_puzzle') {
        if (instruction.activePuzzle) {
          setActivePuzzle(instruction.activePuzzle);
        } else {
          const fallbackPuzzle =
            DYNAMIC_PUZZLE_BANK[Math.floor(Math.random() * DYNAMIC_PUZZLE_BANK.length)];
          setActivePuzzle(fallbackPuzzle);
        }
      } else if (instruction.mScoreChange && instruction.mScoreChange > 0) {
        onUpdateMScore(instruction.mScoreChange);
      }

      if (instruction.difficulty && instruction.difficulty !== 'maintain') {
        if (instruction.difficulty === 'increase') {
          setDifficulty((prev) => (prev === 'Easy' ? 'Medium' : 'Hard'));
        } else if (instruction.difficulty === 'decrease') {
          setDifficulty((prev) => (prev === 'Hard' ? 'Medium' : 'Easy'));
        }
      }

      // Voice speak out
      speakDialogue(instruction.speech, selectedLang);
    } catch (err) {
      console.error('Brain evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectPuzzleOption = (optionValue: string | number) => {
    const formattedAnswer = `I think the answer is ${optionValue}.`;
    handleProcessUserMessage(formattedAnswer);
  };

  const handleRequestPuzzle = (category?: string) => {
    let puzzle: DynamicPuzzle;
    if (category) {
      const filtered = DYNAMIC_PUZZLE_BANK.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
      puzzle = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : DYNAMIC_PUZZLE_BANK[0];
    } else {
      puzzle = DYNAMIC_PUZZLE_BANK[Math.floor(Math.random() * DYNAMIC_PUZZLE_BANK.length)];
    }
    setActivePuzzle(puzzle);
    const speech = `Here is a ${puzzle.category} challenge: "${puzzle.question}" What is your answer?`;
    setDialogueText(speech);
    setCurrentEmotion('thoughtful');
    setCurrentGesture('thinking');
    setLastBrainInstruction({
      speech,
      emotion: 'thoughtful',
      gesture: 'thinking',
      next_action: 'give_puzzle',
      difficulty: 'maintain',
      activePuzzle: puzzle,
    });
    speakDialogue(speech, selectedLang);
  };

  const handleAskCheckIn = () => {
    const checkIns = [
      "On a scale of 1 to 5, how clear and calm is your mental focus right now?",
      "How is your body feeling today? Notice if your neck or jaw is holding any tension.",
      "Have you hydrated with water today and taken a momentary pause from screens?",
    ];
    const picked = checkIns[Math.floor(Math.random() * checkIns.length)];
    handleProcessUserMessage(`AURA, please ask me this check-in question: "${picked}"`);
  };

  const handleWellnessSuggestion = () => {
    handleProcessUserMessage("AURA, please give me a scientific wellness suggestion for my mental resilience.");
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          TOP BAR (Matching Wireframe: 👤 Profile, ✉️ Messages, M-SCORE: XX)
          ────────────────────────────────────────────────────────── */}
      <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
            title="View User Profile"
          >
            <User className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Profile ({user.name})</span>
            <span className="sm:hidden">Profile</span>
          </button>

          <button
            onClick={onOpenMessages}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer relative"
            title="Messages & Clinical Mailbox"
          >
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>Messages</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
          </button>
        </div>

        {/* Center: Title */}
        <div className="text-center hidden md:block">
          <h1 className="text-sm font-black tracking-widest uppercase bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            AI WELLNESS COMPANION
          </h1>
          <p className="text-[10px] text-slate-400">3D Interactive Avatar • Brain Evaluation • Speech Sync</p>
        </div>

        {/* Right: M-Score & Console switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/50 shadow-lg shadow-indigo-950/50">
            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-mono font-black text-indigo-300">
              M-SCORE: <span className="text-emerald-400 text-sm">{currentMScore}</span>
            </span>
          </div>

          <button
            onClick={onSwitchToConsole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition cursor-pointer font-medium"
            title="Switch to Full Clinical Multi-Module Console"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Console</span>
          </button>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────
          MAIN STAGE: CENTERED 3D AVATAR + PUZZLE CARD + SPEECH DOCK
          ────────────────────────────────────────────────────────── */}
      <main className="relative flex-1 w-full max-w-6xl mx-auto px-4 py-4 flex flex-col items-center justify-between gap-4">
        {/* Sub-header on mobile */}
        <div className="text-center md:hidden mt-1">
          <h1 className="text-sm font-black tracking-widest uppercase bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            AI WELLNESS COMPANION
          </h1>
        </div>

        {/* Avatar + Visual Puzzle Floating Area */}
        <div className="relative w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 min-h-[380px] sm:min-h-[460px]">
          {/* Centered Lifelike AI Avatar with Biological Realism */}
          <div className="relative w-full max-w-lg lg:max-w-xl h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl">
            <ThreeAvatar
              config={config}
              isSpeaking={isSpeaking}
              isListening={isListening}
              mScore={currentMScore}
              emotion={currentEmotion}
              gesture={currentGesture}
              pose={pose}
              language={selectedLang}
              spokenText={dialogueText}
              onPoseToggle={(newPose) => setPose(newPose)}
              onGestureTrigger={(newGesture) => setCurrentGesture(newGesture)}
              showPoseControls={true}
            />

            {/* Gesture & Emotion Feedback Tag */}
            <div className="absolute top-14 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-[10px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-1.5 shadow">
                <Smile className="w-3 h-3 text-indigo-400" />
                Expression: <strong className="text-indigo-300 capitalize">{currentEmotion}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-[10px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-1.5 shadow">
                <ThumbsUp className="w-3 h-3 text-emerald-400" />
                Gesture: <strong className="text-emerald-300 capitalize">{currentGesture.replace('_', ' ')}</strong>
              </span>
            </div>
          </div>

          {/* Dynamic Visual Puzzle Card (Side Stage if active) */}
          {activePuzzle && (
            <div className="w-full max-w-md lg:w-96 bg-slate-900/90 border-2 border-indigo-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-lg flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider">
                    {activePuzzle.category}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    +{activePuzzle.rewardPoints} M-Score
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">{activePuzzle.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{activePuzzle.question}</p>

                {/* Visual Sequence or Grid rendering */}
                {activePuzzle.visualData && (
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl mb-3 flex items-center justify-center gap-2 text-base font-mono font-bold text-indigo-200 overflow-x-auto">
                    {activePuzzle.visualData.items.map((item, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1.5 rounded-lg border ${
                          item === '?' || item === '❓'
                            ? 'border-amber-400 bg-amber-400/10 text-amber-300 animate-pulse'
                            : 'border-slate-700 bg-slate-900 text-white'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactive Multiple Choice Options */}
                {activePuzzle.options && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {activePuzzle.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectPuzzleOption(opt)}
                        disabled={isEvaluating}
                        className="p-2 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white border border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer text-center"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  Hint: {activePuzzle.hint}
                </span>
                <button
                  onClick={() => setActivePuzzle(null)}
                  className="text-slate-500 hover:text-slate-300 transition underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────────────────────
            AVATAR SPEECH BALLOON / DIALOGUE CARD
            ────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 shadow-xl backdrop-blur-md relative">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
              <Brain className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">AURA</span>
                  {isSpeaking && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                      <Volume2 className="w-3 h-3" /> Speaking live...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Language Selector */}
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-[10px]">
                    <Languages className="w-3 h-3 text-indigo-400" />
                    <select
                      value={selectedLang}
                      onChange={(e) => {
                        const newLang = e.target.value as AvatarLanguage;
                        setSelectedLang(newLang);
                        const data = MULTILINGUAL_DATA[newLang];
                        setDialogueText(data.greeting);
                        speakDialogue(data.greeting, newLang);
                      }}
                      className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="te">Telugu (తెలుగు)</option>
                      <option value="hi">Hindi (हिन्दी)</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    </select>
                  </div>

                  {/* Speech Audio Toggle */}
                  <button
                    onClick={() => {
                      if (speechEnabled) {
                        window.speechSynthesis?.cancel();
                        setIsSpeaking(false);
                      }
                      setSpeechEnabled(!speechEnabled);
                    }}
                    className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                      speechEnabled
                        ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                    title={speechEnabled ? 'Mute Avatar Voice' : 'Unmute Avatar Voice'}
                  >
                    {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => speakDialogue(dialogueText, selectedLang)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition cursor-pointer"
                    title="Re-play Avatar Speech"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                "{dialogueText}"
              </p>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            INPUT DOCK: SPEECH MICROPHONE & TEXT INPUT
            ────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl flex flex-col gap-2">
          {/* Quick Action Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-medium text-slate-300">
            <button
              onClick={() => handleRequestPuzzle('Number puzzles')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/80 border border-slate-700 hover:border-indigo-400 transition cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm"
            >
              <span>🧩 Number Puzzle (24 Target)</span>
            </button>
            <button
              onClick={() => handleRequestPuzzle('Pattern recognition')}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/80 border border-slate-700 hover:border-indigo-400 transition cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm"
            >
              <span>🔷 Pattern Recognition</span>
            </button>
            <button
              onClick={handleAskCheckIn}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/80 border border-slate-700 hover:border-indigo-400 transition cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm"
            >
              <span>❓ Wellness Check-in</span>
            </button>
            <button
              onClick={handleWellnessSuggestion}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/80 border border-slate-700 hover:border-indigo-400 transition cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-sm"
            >
              <span>🌿 Wellness Suggestion</span>
            </button>
          </div>

          {/* Quick AI Test Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick AI Brain Tests:
            </span>
            <button
              onClick={() => handleProcessUserMessage('I think the answer is 24.')}
              disabled={isEvaluating}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-900/90 transition text-[11px] cursor-pointer"
            >
              "I think the answer is 24."
            </button>
            <button
              onClick={() => handleProcessUserMessage('Can you give me a visual puzzle?')}
              disabled={isEvaluating}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-[11px] cursor-pointer"
            >
              "Give me a puzzle"
            </button>
            <button
              onClick={() => handleProcessUserMessage("I'm feeling a bit stressed today.")}
              disabled={isEvaluating}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-[11px] cursor-pointer"
            >
              "I feel stressed"
            </button>
          </div>

          {/* Main Input Field + Voice Mic */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 border-2 border-indigo-500/50 rounded-2xl shadow-xl">
            {/* Microphone Button */}
            <button
              onClick={toggleMic}
              className={`p-3 rounded-xl transition cursor-pointer flex items-center justify-center shadow-md ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak to Avatar via Microphone'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={userSpeechInput}
              onChange={(e) => setUserSpeechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcessUserMessage()}
              placeholder={
                isListening
                  ? 'Listening to your voice... (say: "I think the answer is 24")'
                  : 'Speak or type (e.g. "I think the answer is 24", "Give me a puzzle", "I feel stressed")...'
              }
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            <button
              onClick={() => handleProcessUserMessage()}
              disabled={!userSpeechInput.trim() || isEvaluating}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition cursor-pointer shadow-md"
              title="Send Response to Avatar"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {isListening && (
            <p className="text-center text-[11px] text-rose-400 animate-pulse font-medium">
              🎙️ Microphone active: speak clearly. Avatar evaluates your answer in real time!
            </p>
          )}
        </div>

        {/* ──────────────────────────────────────────────────────────
            AI "BRAIN" 6-STEP COGNITIVE PIPELINE INSPECTOR
            ────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl bg-slate-950/80 border border-indigo-500/40 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                AI Brain Cognitive Pipeline (6 Steps)
              </span>
            </div>

            <button
              onClick={() => setShowBrainInspector(!showBrainInspector)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono underline cursor-pointer"
            >
              {showBrainInspector ? 'Hide Raw JSON' : 'Inspect Raw JSON'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {/* Step 1: Understand user's response */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">
                  1. UNDERSTAND RESPONSE
                </span>
                <p className="text-slate-200 text-[11px] line-clamp-2">
                  {lastBrainInstruction.understoodResponse || 'Ready for user input...'}
                </p>
              </div>
            </div>

            {/* Step 2: Determine correctness */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">
                  2. DETERMINE CORRECTNESS
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {lastBrainInstruction.isCorrect === true ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Correct Solution
                    </span>
                  ) : lastBrainInstruction.isCorrect === false ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[10px]">
                      ✗ Incorrect Guess
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                      — Exploratory / Check-in
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Decide what to say next */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">
                  3. DECIDE NEXT SPEECH
                </span>
                <p className="text-slate-200 text-[11px] italic line-clamp-2">
                  "{lastBrainInstruction.speech.slice(0, 65)}..."
                </p>
              </div>
            </div>

            {/* Step 4: Choose an emotion */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">
                  4. CHOOSE EMOTION
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono capitalize text-[10px] inline-flex items-center gap-1">
                  <Smile className="w-3 h-3 text-indigo-400" />
                  {lastBrainInstruction.emotion}
                </span>
              </div>
            </div>

            {/* Step 5: Choose a gesture */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">
                  5. CHOOSE GESTURE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-cyan-300 font-mono capitalize text-[10px] inline-flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 text-cyan-400" />
                  {lastBrainInstruction.gesture.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Step 6: Decide whether to give encouragement */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">
                  6. GIVE ENCOURAGEMENT
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lastBrainInstruction.giveEncouragement
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {lastBrainInstruction.giveEncouragement ? 'Active' : 'Neutral'}
                  </span>
                  {lastBrainInstruction.encouragementNote && (
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={lastBrainInstruction.encouragementNote}>
                      {lastBrainInstruction.encouragementNote}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showBrainInspector && (
            <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-emerald-300 overflow-x-auto">
              <pre>
                {JSON.stringify(lastBrainInstruction, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
