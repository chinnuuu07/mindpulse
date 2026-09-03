import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Challenge,
  Badge,
  UserLevelInfo,
} from '../types';
import {
  X,
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Flame,
  Wind,
  Moon,
  Apple,
  Brain,
  ShieldCheck,
  Crown,
  Share2,
  ChevronRight,
} from 'lucide-react';

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel: UserLevelInfo;
  challenges: Challenge[];
  badges: Badge[];
  onClaimChallenge: (challengeId: string) => void;
  onOpenMeditation: () => void;
  onOpenSleep: () => void;
  onOpenBPFoods: () => void;
  onOpenPuzzles: () => void;
}

export const GamificationModal: React.FC<GamificationModalProps> = ({
  isOpen,
  onClose,
  userLevel,
  challenges,
  badges,
  onClaimChallenge,
  onOpenMeditation,
  onOpenSleep,
  onOpenBPFoods,
  onOpenPuzzles,
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'badges' | 'tiers'>('challenges');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'daily' | 'weekly'>('all');

  if (!isOpen) return null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#34d399', '#38bdf8', '#f59e0b', '#ec4899'],
    });
  };

  const handleClaim = (id: string) => {
    triggerCelebration();
    onClaimChallenge(id);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Apple':
        return <Apple className="w-4 h-4 text-emerald-400" />;
      case 'Brain':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'Crown':
        return <Crown className="w-4 h-4 text-amber-300" />;
      case 'Share2':
        return <Share2 className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    if (filterPeriod === 'all') return true;
    return c.period === filterPeriod;
  });

  const levelProgressPercent = Math.min(
    100,
    Math.round((userLevel.currentXp / userLevel.xpForNextLevel) * 100)
  );

  return (
    <div
      id="gamification-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="gamification-modal-container"
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider leading-none">
                M-Score Gamified Journey
              </h2>
              <span className="text-xs text-slate-400">
                Daily Quests, Badges &amp; Bio-Resilience Level Progression
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Progression Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono">
                  LEVEL {userLevel.level}
                </span>
                <span className="text-base font-black text-white">{userLevel.levelName}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Your biological coherence &amp; M-Score consistency elevate your rank.
              </p>
            </div>

            <div className="flex items-baseline gap-1 text-right">
              <span className="text-2xl font-black text-indigo-400 font-mono">
                {userLevel.currentXp}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                / {userLevel.xpForNextLevel} XP
              </span>
            </div>
          </div>

          {/* Visual Progress Bar to Next Level */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700 relative"
              style={{ width: `${levelProgressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-mono">
            <span>Progress to Level {userLevel.level + 1}</span>
            <span className="font-bold text-indigo-300">{levelProgressPercent}% Completed</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'challenges'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Challenges &amp; Quests</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'badges'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Earned Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'tiers'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Level Tiers &amp; Perks</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: CHALLENGES */}
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {/* Filter pills */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(['all', 'daily', 'weekly'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setFilterPeriod(period)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        filterPeriod === period
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  Resets daily at midnight &amp; Sundays
                </span>
              </div>

              {/* Challenge List */}
              <div className="space-y-3">
                {filteredChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-xl border transition-all ${
                      challenge.isClaimed
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : challenge.isCompleted
                        ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          {getIconComponent(challenge.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase tracking-wider">
                              {challenge.period}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                              +{challenge.mScoreReward} M-Score • +{challenge.xpReward} XP
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">
                            {challenge.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {challenge.description}
                          </p>

                          {/* Progress bar */}
                          <div className="mt-2.5 flex items-center gap-3">
                            <div className="w-36 sm:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (challenge.currentProgress / challenge.maxProgress) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {challenge.currentProgress} / {challenge.maxProgress} {challenge.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex flex-col items-end">
                        {challenge.isClaimed ? (
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-slate-500" />
                            Claimed
                          </span>
                        ) : challenge.isCompleted ? (
                          <button
                            onClick={() => handleClaim(challenge.id)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-900/40 transition cursor-pointer animate-pulse"
                          >
                            Claim Reward
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              if (challenge.category === 'meditation') onOpenMeditation();
                              else if (challenge.category === 'sleep') onOpenSleep();
                              else if (challenge.category === 'nutrition') onOpenBPFoods();
                              else if (challenge.category === 'puzzle') onOpenPuzzles();
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center gap-1"
                          >
                            <span>Start</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BADGES */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-slate-950/80 border-indigo-500/40'
                      : 'bg-slate-950/30 border-slate-800 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? 'bg-indigo-950 border border-indigo-500/50 shadow-lg shadow-indigo-950'
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {badge.unlocked ? (
                      getIconComponent(badge.icon)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                      {badge.unlocked && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {badge.description}
                    </p>
                    {badge.unlocked && badge.unlockedAt && (
                      <span className="text-[10px] text-indigo-400 font-mono block mt-1.5">
                        Achieved: {badge.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TIERS & PERKS */}
          {activeTab === 'tiers' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                  Current Tier Perks (Level {userLevel.level} - {userLevel.levelName})
                </h4>
                <ul className="space-y-2 pt-1">
                  {userLevel.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Bio-Resilience Hierarchy
                </h4>
                {[
                  { lvl: 1, name: 'Bio Initiate', xp: '0 - 200 XP', perk: 'Base biometric monitoring & avatar voice' },
                  { lvl: 2, name: 'Mind Explorer', xp: '201 - 500 XP', perk: 'Cognitive riddle daily challenges unlocked' },
                  { lvl: 3, name: 'Bio-Resilient Adept', xp: '501 - 900 XP', perk: '3D Real Female Avatar Mode + Multilingual voice' },
                  { lvl: 4, name: 'Cognitive Master', xp: '901 - 1500 XP', perk: 'Advanced HRV deep coherence & expert doctor consultations' },
                  { lvl: 5, name: 'Neuro Luminary', xp: '1501+ XP', perk: 'Global leaderboard gold aura & bespoke wellness algorithms' },
                ].map((tier) => (
                  <div
                    key={tier.lvl}
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                      userLevel.level === tier.lvl
                        ? 'bg-indigo-950/60 border-indigo-500 text-white font-bold'
                        : userLevel.level > tier.lvl
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                        : 'bg-slate-950/20 border-slate-800/40 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-indigo-400">Lvl {tier.lvl}</span>
                      <div>
                        <span className="block text-slate-200">{tier.name}</span>
                        <span className="text-[10px] text-slate-500">{tier.perk}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{tier.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
