import React, { useState, useEffect, useRef } from 'react';
import {
  ChatMessage,
  UserProfile,
  AvatarConfig,
  AvatarLanguage,
} from '../types';
import { MULTILINGUAL_DATA } from '../data/gamificationAndFeedData';
import {
  Send,
  Mic,
  Sparkles,
  Brain,
  Calendar,
  Pill,
  HeartPulse,
  Moon,
  Wind,
  CheckCircle2,
  Sliders,
  Volume2,
  VolumeX,
  Languages,
  Share2,
  Trophy,
  BookOpen,
} from 'lucide-react';

interface AvatarChatProps {
  user: UserProfile;
  currentMScore: number;
  bloodPressureString: string;
  config: AvatarConfig;
  onSetIsSpeaking: (speaking: boolean) => void;
  onOpenCustomizer: () => void;
  onOpenPuzzles: () => void;
  onOpenMeditation: () => void;
  onOpenSleepSchedule: () => void;
  onOpenBPFoods: () => void;
  onOpenMedications: () => void;
  onOpenDoctorScheduler: () => void;
  onUpdateMScore: (delta: number) => void;
  onOpenGamification?: () => void;
  onOpenFeed?: () => void;
  onShareTip?: (title: string, summary: string) => void;
}

export const AvatarChat: React.FC<AvatarChatProps> = ({
  user,
  currentMScore,
  bloodPressureString,
  config,
  onSetIsSpeaking,
  onOpenCustomizer,
  onOpenPuzzles,
  onOpenMeditation,
  onOpenSleepSchedule,
  onOpenBPFoods,
  onOpenMedications,
  onOpenDoctorScheduler,
  onUpdateMScore,
  onOpenGamification,
  onOpenFeed,
  onShareTip,
}) => {
  const [selectedLang, setSelectedLang] = useState<AvatarLanguage>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      text: `Greetings ${user.name}! I am AURA, your Real Female AI Mental Health Companion. Your current M-Score is ${currentMScore}/100 and your Blood Pressure is ${bloodPressureString} mmHg.
I can speak with you in English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), or Kannada (ಕನ್ನಡ). You can solve visual puzzles, do 4-7-8 breathing, follow your blood pressure diet, complete daily challenges, and share health tips with your friends!`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(config.autoSpeech);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Text to Speech playback synchronizer with BCP-47 support
  const speakUtterance = (text: string, langCode: AvatarLanguage = selectedLang) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`•]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // BCP-47 language codes
    const bcpMap: Record<AvatarLanguage, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
    };
    const targetCode = bcpMap[langCode] || 'en-US';
    utterance.lang = targetCode;

    // Pick a matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      (v) => v.lang.startsWith(targetCode) || v.lang.toLowerCase().includes(langCode)
    );
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = config.voicePitch || 1.0;
    utterance.rate = config.voiceRate || 1.0;

    utterance.onstart = () => onSetIsSpeaking(true);
    utterance.onend = () => onSetIsSpeaking(false);
    utterance.onerror = () => onSetIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Setup Speech Recognition
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
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser environment.');
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

  // Language switch handler
  const handleLanguageChange = (lang: AvatarLanguage) => {
    setSelectedLang(lang);
    const langInfo = MULTILINGUAL_DATA[lang];

    const greetingMessage: ChatMessage = {
      id: `lang-${Date.now()}`,
      role: 'assistant',
      text: `${langInfo.greeting}\n\n💡 ${langInfo.sampleTip}`,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, greetingMessage]);
    speakUtterance(`${langInfo.greeting}. ${langInfo.sampleTip}`, lang);
  };

  // Send Message Handler
  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInput('');
    setIsThinking(true);

    const query = textToSend.toLowerCase();

    setTimeout(() => {
      let reply = '';
      let mScoreDelta = 0;

      if (query.includes('telugu') || selectedLang === 'te') {
        reply = `నమస్కారం! మీ M-స్కోర్ పెంచడానికి ప్రతిరోజూ 5 నిమిషాల ప్రాణాయామం మరియు బీట్‌రూట్ రసం చాలా మంచిది. మీరు ప్రశాంతంగా ఉండండి, నేను ఎల్లప్పుడూ మీకు సహాయం చేయడానికి ఇక్కడే ఉన్నాను.`;
        mScoreDelta = 2;
      } else if (query.includes('hindi') || selectedLang === 'hi') {
        reply = `नमस्ते! अपने M-स्कोर को बेहतर बनाने के लिए रोज़ाना 10 मिनट ध्यान लगाएं और पर्याप्त नींद लें। आपका मानसिक संतुलन ही आपकी सबसे बड़ी शक्ति है।`;
        mScoreDelta = 2;
      } else if (query.includes('tamil') || selectedLang === 'ta') {
        reply = `வணக்கம்! உங்கள் மன ஆரோக்கியம் மற்றும் M-Score-ஐ மேம்படுத்த ஆழ்ந்த மூச்சுப் பயிற்சி மற்றும் சத்தான உணவுகள் மிக அவசியம்.`;
        mScoreDelta = 2;
      } else if (query.includes('kannada') || selectedLang === 'kn') {
        reply = `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಮಾನಸಿಕ ನೆಮ್ಮದಿ ಮತ್ತು M-ಸ್ಕೋರ್ ಹೆಚ್ಚಿಸಲು ದಿನವೂ 15 ನಿಮಿಷಗಳ ಧ್ಯಾನ ಮಾಡಿ.`;
        mScoreDelta = 2;
      } else if (query.includes('puzzle') || query.includes('riddle')) {
        reply = `Cognitive training stimulates neuroplasticity and raises your M-Score! I have opened the Visual Picture Puzzles featuring glowing number matrix patterns and visual word find cards. Let's solve them together!`;
        onOpenPuzzles();
      } else if (query.includes('meditat') || query.includes('breath')) {
        reply = `Activating parasympathetic vagal tone through 4-7-8 breathing. Inhale for 4s, hold for 7s, exhale for 8s to quickly lower blood pressure and balance autonomic nervous activity.`;
        onOpenMeditation();
        mScoreDelta = 2;
      } else if (query.includes('sleep')) {
        reply = `Circadian rhythm balance is vital for cognitive repair. I recommend aiming for 7.5 to 8.5 hours with consistent sleep-wake timing and 0 lux blue-light darkness before bed.`;
        onOpenSleepSchedule();
        mScoreDelta = 1;
      } else if (query.includes('food') || query.includes('diet') || query.includes('pressure') || query.includes('bp')) {
        reply = `To optimize blood pressure and mental clarity, incorporate potassium-rich bananas, nitric-oxide boosting beetroots, magnesium-dense dark leafy greens, and dark cacao into your daily nutrition.`;
        onOpenBPFoods();
        mScoreDelta = 1;
      } else if (query.includes('doctor') || query.includes('appointment')) {
        reply = `Your health is our utmost priority. I have opened the Doctor Booking portal where you can schedule a clinical tele-consult with our verified neuropsychiatrists or cardiologists.`;
        onOpenDoctorScheduler();
      } else if (query.includes('challenge') || query.includes('quest') || query.includes('badge')) {
        reply = `I've opened your Gamified Journey modal! Complete daily meditation, sleep regularity, and nutrition quests to earn points, badges, and advance your bio-resilience tier!`;
        if (onOpenGamification) onOpenGamification();
      } else if (query.includes('feed') || query.includes('article') || query.includes('recipe')) {
        reply = `I've personalized your Wellness Content Feed with curated articles, recipes, and audio meditations tailored to your M-Score ${currentMScore}/100!`;
        if (onOpenFeed) onOpenFeed();
      } else {
        reply = `Thank you for sharing, ${user.name}. To sustain an optimal M-Score (${currentMScore}/100), maintain steady parasympathetic tone, hydrate with electrolyte-rich water, and take short micro-pauses between cognitive tasks. Would you like to solve a visual picture puzzle or practice guided breathing?`;
        mScoreDelta = 1;
      }

      if (mScoreDelta > 0) {
        onUpdateMScore(mScoreDelta);
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: reply,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsThinking(false);
      speakUtterance(reply, selectedLang);
    }, 600);
  };

  const askWellnessQuestion = () => {
    const questions = [
      'On a scale of 1 to 5, how clear and focused is your mental attention right now?',
      'How restorative was your sleep last night, and did you wake up feeling energetic?',
      'Have you taken time today to pause, hydrate, and relax your shoulder muscles?',
      'Are you experiencing any physical muscle tightness or elevated pulse right now?',
    ];
    const picked = questions[Math.floor(Math.random() * questions.length)];
    handleSendMessage(`AURA, ask me a wellness check-in question: "${picked}"`);
  };

  return (
    <div
      id="avatar-chat-container"
      className="flex flex-col h-full rounded-2xl bg-slate-900/80 border border-slate-700 shadow-xl backdrop-blur-sm overflow-hidden"
    >
      {/* Chat Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            AURA Real Female AI Guide
          </span>
          <span className="text-[10px] text-indigo-400 font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/40">
            M-{currentMScore}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="toggle-audio-speech-btn"
            onClick={() => {
              if (audioEnabled) window.speechSynthesis.cancel();
              setAudioEnabled(!audioEnabled);
            }}
            title={audioEnabled ? 'Mute Avatar Voice' : 'Enable Avatar Voice'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition cursor-pointer"
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            id="open-avatar-customizer-btn"
            onClick={onOpenCustomizer}
            title="Customize 3D Avatar & Voice"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">
              Customize
            </span>
          </button>
        </div>
      </div>

      {/* Multilingual Selector Bar */}
      <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <Languages className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">Avatar Language:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(
            [
              { code: 'en', label: 'English' },
              { code: 'te', label: 'తెలుగు' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'ta', label: 'தமிழ்' },
              { code: 'kn', label: 'ಕನ್ನಡ' },
            ] as const
          ).map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                selectedLang === lang.code
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isUser ? user.name : 'AURA Female AI Guide'}
                </span>
                <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[88%] sm:max-w-[80%] leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 border border-indigo-400 text-white shadow-lg shadow-indigo-900/20'
                    : 'bg-slate-950/80 border border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Assistant message action buttons: Listen Audio & Share with Friends */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => speakUtterance(msg.text, selectedLang)}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Hear In {selectedLang.toUpperCase()}</span>
                    </button>

                    {onShareTip && (
                      <button
                        onClick={() =>
                          onShareTip('AURA AI Wellness Guidance', msg.text.slice(0, 140) + '...')
                        }
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        title="Share this tip with your friends to gain +2 M-Score"
                      >
                        <Share2 className="w-3 h-3 text-indigo-400" />
                        <span>Share Tip</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Inline Doctor Appointment Action when suggested in assistant message */}
                {!isUser && msg.text.toLowerCase().includes('doctor') && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      id="inline-schedule-doctor-btn"
                      onClick={onOpenDoctorScheduler}
                      className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-900/20"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Doctor Appointment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="font-mono text-[11px]">AURA is synthesizing neuro-wellness advice...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Wellness Quick Action Chips */}
      <div className="px-3 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        {onOpenGamification && (
          <button
            onClick={onOpenGamification}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/50 transition flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Quests &amp; Badges</span>
          </button>
        )}

        {onOpenFeed && (
          <button
            onClick={onOpenFeed}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-300 transition flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
          >
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span>Curated Feed</span>
          </button>
        )}

        <button
          id="chip-puzzle"
          onClick={onOpenPuzzles}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-300 transition flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
        >
          <Brain className="w-3 h-3 text-indigo-400" />
          <span>Picture Puzzles (+M-Score)</span>
        </button>

        <button
          id="chip-meditation"
          onClick={onOpenMeditation}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-300 transition flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
        >
          <Wind className="w-3 h-3 text-teal-400" />
          <span>4-7-8 Meditation</span>
        </button>

        <button
          id="chip-sleep"
          onClick={onOpenSleepSchedule}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-300 transition flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
        >
          <Moon className="w-3 h-3 text-indigo-400" />
          <span>Sleep Schedule</span>
        </button>

        <button
          id="chip-bp-foods"
          onClick={onOpenBPFoods}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-300 transition flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
        >
          <HeartPulse className="w-3 h-3 text-rose-400" />
          <span>BP Foods</span>
        </button>

        <button
          id="chip-doctor"
          onClick={onOpenDoctorScheduler}
          className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-300 transition flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
        >
          <Calendar className="w-3 h-3 text-indigo-400" />
          <span>Doctor Booking</span>
        </button>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2.5"
      >
        <button
          type="button"
          id="chat-mic-btn"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl transition cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/50'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Speak to Avatar'}
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          id="avatar-chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedLang === 'te'
              ? 'నమస్కారం, మీరు ఏదైనా అడగవచ్చు...'
              : selectedLang === 'hi'
              ? 'नमस्ते, आप कोई भी सवाल पूछ सकते हैं...'
              : selectedLang === 'ta'
              ? 'வணக்கம், உங்கள் கேள்வியைக் கேட்கவும்...'
              : selectedLang === 'kn'
              ? 'ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...'
              : 'Ask AURA for mental health advice, sleep, blood pressure foods, or doctors...'
          }
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />

        <button
          id="avatar-chat-send-btn"
          type="submit"
          disabled={!input.trim() || isThinking}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white shadow-lg shadow-indigo-900/20 transition disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
