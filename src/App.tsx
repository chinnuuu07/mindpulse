import React, { useState } from 'react';
import {
  UserProfile,
  Friend,
  FriendRequest,
  MScoreHistoryPoint,
  BloodPressureData,
  ConnectedDevice,
  AvatarConfig,
  MedicationReminder,
  DoctorAppointment,
  Challenge,
  Badge,
  UserLevelInfo,
  FeedItem,
} from './types';
import {
  INITIAL_USER,
  INITIAL_FRIENDS,
  INITIAL_FRIEND_REQUESTS,
  M_SCORE_HISTORY,
  INITIAL_BLOOD_PRESSURE,
  INITIAL_DEVICES,
  DEFAULT_AVATAR_CONFIG,
  INITIAL_MEDICATIONS,
} from './data/mockData';
import {
  INITIAL_CHALLENGES,
  INITIAL_BADGES,
  INITIAL_USER_LEVEL,
  INITIAL_FEED_ITEMS,
} from './data/gamificationAndFeedData';

// Core Components
import { FrontPageAuth } from './components/FrontPageAuth';
import { CameraHUD } from './components/CameraHUD';
import { ThreeAvatar } from './components/ThreeAvatar';
import { AvatarChat } from './components/AvatarChat';
import { ProfileModal } from './components/ProfileModal';
import { MailboxModal } from './components/MailboxModal';
import { PerformanceModal } from './components/PerformanceModal';
import { RankModal } from './components/RankModal';
import { SmartwatchPairModal, BloodPressureAlertPopup } from './components/SmartwatchPairModal';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { PuzzleModal } from './components/PuzzleModal';
import { MeditationModal } from './components/MeditationModal';
import { SleepScheduleModal } from './components/SleepScheduleModal';
import { BloodPressureFoodsModal } from './components/BloodPressureFoodsModal';
import { DoctorSchedulerModal } from './components/DoctorSchedulerModal';
import { MedicationModal } from './components/MedicationModal';

// New Requested Components: Pie Chart with Center Emoji, Gamification, Feed, and Share Tip
import { MScoreDonutChart } from './components/MScoreDonutChart';
import { GamificationModal } from './components/GamificationModal';
import { PersonalizedFeedModal } from './components/PersonalizedFeedModal';
import { ShareTipModal } from './components/ShareTipModal';
import { AIWellnessCompanionView } from './components/AIWellnessCompanionView';

// Icons
import {
  Mail,
  TrendingUp,
  Trophy,
  Watch,
  User,
  HeartPulse,
  Brain,
  Sliders,
  LogOut,
  Sparkles,
  Award,
  BookOpen,
  Share2,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Authentication & Page State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);

  // App Data States
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(INITIAL_FRIEND_REQUESTS);
  const [historyData, setHistoryData] = useState<MScoreHistoryPoint[]>(M_SCORE_HISTORY);
  const [bloodPressure, setBloodPressure] = useState<BloodPressureData>(INITIAL_BLOOD_PRESSURE);
  const [devices, setDevices] = useState<ConnectedDevice[]>(INITIAL_DEVICES);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [medications, setMedications] = useState<MedicationReminder[]>(INITIAL_MEDICATIONS);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);

  // Gamification & Feed States
  const [userLevel, setUserLevel] = useState<UserLevelInfo>(INITIAL_USER_LEVEL);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);

  // Avatar Live State
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState<boolean>(false);

  // Modal Open States
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMailboxOpen, setIsMailboxOpen] = useState<boolean>(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState<boolean>(false);
  const [isRankOpen, setIsRankOpen] = useState<boolean>(false);
  const [isPairOpen, setIsPairOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isPuzzleOpen, setIsPuzzleOpen] = useState<boolean>(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState<boolean>(false);
  const [isSleepOpen, setIsSleepOpen] = useState<boolean>(false);
  const [isBPFoodsOpen, setIsBPFoodsOpen] = useState<boolean>(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState<boolean>(false);
  const [isMedicationOpen, setIsMedicationOpen] = useState<boolean>(false);

  // New Modals
  const [isGamificationOpen, setIsGamificationOpen] = useState<boolean>(false);
  const [isFeedOpen, setIsFeedOpen] = useState<boolean>(false);
  const [isShareTipOpen, setIsShareTipOpen] = useState<boolean>(false);
  const [shareTipData, setShareTipData] = useState<{
    title: string;
    summary: string;
    category?: string;
  }>({
    title: 'Nitric Oxide & Blood Pressure Harmony',
    summary: 'Beetroot juice rich in nitrates helps dilate micro-vasculature and reduces sympathetic vascular tension.',
    category: 'Vascular Health',
  });

  // Blood Pressure Alert dismissed state
  const [bpAlertDismissed, setBpAlertDismissed] = useState<boolean>(false);
  const [scoreToast, setScoreToast] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'companion' | 'console'>('companion');

  // Handle Login & Registration
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Profile updates
  const handleUpdatePassword = (newPass: string) => {
    setCurrentUser((prev) => ({ ...prev, password: newPass }));
  };

  const handleBlockFriend = (friendId: string) => {
    setCurrentUser((prev) => {
      const isBlocked = prev.blockedFriends.includes(friendId);
      const newBlocked = isBlocked
        ? prev.blockedFriends.filter((id) => id !== friendId)
        : [...prev.blockedFriends, friendId];
      return { ...prev, blockedFriends: newBlocked };
    });
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  // Mailbox actions
  const handleAcceptRequest = (requestId: string) => {
    const req = friendRequests.find((r) => r.id === requestId);
    if (!req) return;

    const newFriend: Friend = {
      id: req.senderId,
      name: req.senderName,
      avatar: req.senderAvatar,
      mScore: req.senderMScore,
      gender: 'Female',
      status: 'online',
    };

    setFriends((prev) => [...prev, newFriend]);
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Gamification Challenge Claim
  const handleClaimChallenge = (challengeId: string) => {
    const ch = challenges.find((c) => c.id === challengeId);
    if (!ch || ch.isClaimed) return;

    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, isClaimed: true } : c))
    );

    // Add XP & M-Score
    setUserLevel((prev) => {
      const nextXp = prev.currentXp + ch.xpReward;
      let nextLevel = prev.level;
      let nextLevelName = prev.levelName;
      let nextThreshold = prev.xpForNextLevel;

      if (nextXp >= prev.xpForNextLevel && prev.level < 5) {
        nextLevel = prev.level + 1;
        nextThreshold = prev.xpForNextLevel + 400;
        const titles = [
          'Bio Initiate',
          'Mind Explorer',
          'Bio-Resilient Adept',
          'Cognitive Master',
          'Neuro Luminary',
        ];
        nextLevelName = titles[nextLevel - 1] || 'Neuro Luminary';

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#818cf8', '#34d399', '#f59e0b', '#ec4899'],
        });
      }

      return {
        ...prev,
        level: nextLevel,
        levelName: nextLevelName,
        currentXp: nextXp,
        xpForNextLevel: nextThreshold,
      };
    });

    triggerScoreReward(ch.mScoreReward, `Quest Completed! +${ch.mScoreReward} M-Score & +${ch.xpReward} XP`);
  };

  // Feed Bookmarking
  const handleToggleBookmark = (itemId: string) => {
    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  // Open Share Dialog for a Tip
  const handleOpenShareModal = (title: string, summary: string, category?: string) => {
    setShareTipData({ title, summary, category: category || 'Wellness Tip' });
    setIsShareTipOpen(true);
  };

  // Confirm Share tip with friends
  const handleConfirmShare = (targetName: string, tipTitle: string) => {
    triggerScoreReward(2, `Shared "${tipTitle.slice(0, 24)}..." with ${targetName}! +2 M-Score social points.`);
  };

  // Blood pressure updates
  const handleUpdateBloodPressure = (systolic: number, diastolic: number, pulse: number) => {
    const isNormal = systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80;
    const isHigh = systolic > 130 || diastolic > 85;
    const isLow = systolic < 90 || diastolic < 60;

    let status: BloodPressureData['status'] = 'normal';
    if (isHigh) status = 'high';
    else if (isLow) status = 'low';

    setBloodPressure({
      systolic,
      diastolic,
      pulse,
      lastMeasured: 'Just now',
      status,
    });

    if (status === 'normal') {
      setBpAlertDismissed(true);
    } else {
      setBpAlertDismissed(false);
    }
  };

  // Device pairing toggle
  const handleToggleDeviceConnect = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((dev) =>
        dev.id === deviceId
          ? {
              ...dev,
              status: dev.status === 'connected' ? 'disconnected' : 'connected',
              lastSync: 'Just now',
            }
          : dev
      )
    );
  };

  // M-Score incremental rewards
  const triggerScoreReward = (points: number, reason?: string) => {
    setCurrentUser((prev) => {
      const nextScore = Math.min(100, Math.max(0, prev.currentMScore + points));
      return {
        ...prev,
        previousMScore: prev.currentMScore,
        currentMScore: nextScore,
      };
    });

    setHistoryData((prev) => {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const lastIndex = prev.length - 1;
      const updated = [...prev];
      if (lastIndex >= 0) {
        updated[lastIndex] = {
          ...updated[lastIndex],
          score: Math.min(100, updated[lastIndex].score + points),
        };
      }
      return updated;
    });

    if (reason) {
      setScoreToast(reason);
      setTimeout(() => setScoreToast(null), 3200);
    }
  };

  // Medication handlers
  const handleToggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const nextTaken = !med.taken;
          if (nextTaken) {
            triggerScoreReward(1, `Medication logged: ${med.name}. +1 M-Score point!`);
          }
          return { ...med, taken: nextTaken };
        }
        return med;
      })
    );
  };

  const handleAddMedication = (newMed: Omit<MedicationReminder, 'id' | 'taken'>) => {
    const item: MedicationReminder = {
      ...newMed,
      id: `med-${Date.now()}`,
      taken: false,
    };
    setMedications((prev) => [...prev, item]);
  };

  // Doctor Appointment booking
  const handleAppointmentBooked = (appointment: DoctorAppointment) => {
    setAppointments((prev) => [...prev, appointment]);
    triggerScoreReward(3, `Appointment confirmed with ${appointment.doctorName}! +3 M-Score.`);
  };

  const bpString = `${bloodPressure.systolic}/${bloodPressure.diastolic}`;

  // Shared Modals Render Helper
  const renderModals = () => (
    <>
      {/* 1. Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        friends={friends}
        onUpdatePassword={handleUpdatePassword}
        onBlockFriend={handleBlockFriend}
        onRemoveFriend={handleRemoveFriend}
      />

      {/* 2. Top-Left Mailbox Modal */}
      <MailboxModal
        isOpen={isMailboxOpen}
        onClose={() => setIsMailboxOpen(false)}
        requests={friendRequests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />

      {/* 3. Performance Modal with Complete Graph & Comparative Analysis */}
      <PerformanceModal
        isOpen={isPerformanceOpen}
        onClose={() => setIsPerformanceOpen(false)}
        currentMScore={currentUser.currentMScore}
        previousMScore={currentUser.previousMScore}
        historyData={historyData}
      />

      {/* 4. Rank Modal with Top 3 Highlights */}
      <RankModal
        isOpen={isRankOpen}
        onClose={() => setIsRankOpen(false)}
        user={currentUser}
        friends={friends}
      />

      {/* 5. Smartwatch & Screen-Free Tracker Pair Modal */}
      <SmartwatchPairModal
        isOpen={isPairOpen}
        onClose={() => setIsPairOpen(false)}
        bloodPressure={bloodPressure}
        onUpdateBloodPressure={handleUpdateBloodPressure}
        devices={devices}
        onToggleDeviceConnect={handleToggleDeviceConnect}
      />

      {/* 6. High / Low Blood Pressure Immediate Alert Popup */}
      {!bpAlertDismissed && (
        <BloodPressureAlertPopup
          bloodPressure={bloodPressure}
          onDismiss={() => setBpAlertDismissed(true)}
          onStartCalmingSession={() => setIsMeditationOpen(true)}
          onScheduleDoctor={() => setIsDoctorOpen(true)}
        />
      )}

      {/* 7. Avatar Customizer Modal */}
      <AvatarCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={avatarConfig}
        onUpdateConfig={(newCfg) => setAvatarConfig(newCfg)}
      />

      {/* 8. Picture & Brain Puzzles Modal */}
      <PuzzleModal
        isOpen={isPuzzleOpen}
        onClose={() => setIsPuzzleOpen(false)}
        onRewardScore={(pts) =>
          triggerScoreReward(pts, `Visual puzzle solved! +${pts} M-Score points.`)
        }
      />

      {/* 8. Guided 4-7-8 Breathing & Meditation Modal */}
      <MeditationModal
        isOpen={isMeditationOpen}
        onClose={() => setIsMeditationOpen(false)}
        onRewardScore={(pts) =>
          triggerScoreReward(pts, `Mindful breathwork complete! +${pts} M-Score points.`)
        }
      />

      {/* 9. Personalized Circadian Sleep Schedule Modal */}
      <SleepScheduleModal
        isOpen={isSleepOpen}
        onClose={() => setIsSleepOpen(false)}
        onRewardScore={(pts) =>
          triggerScoreReward(pts, `Sleep schedule synchronized! +${pts} M-Score points.`)
        }
      />

      {/* 10. Blood Pressure Balancing Foods Modal */}
      <BloodPressureFoodsModal
        isOpen={isBPFoodsOpen}
        onClose={() => setIsBPFoodsOpen(false)}
      />

      {/* 11. Doctor Scheduler Modal */}
      <DoctorSchedulerModal
        isOpen={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onAppointmentBooked={handleAppointmentBooked}
      />

      {/* 12. Medication & Health Reminders Modal */}
      <MedicationModal
        isOpen={isMedicationOpen}
        onClose={() => setIsMedicationOpen(false)}
        medications={medications}
        onToggleTaken={handleToggleMedication}
        onAddMedication={handleAddMedication}
      />

      {/* 13. Gamification Modal (Quests, Badges & Tiers) */}
      <GamificationModal
        isOpen={isGamificationOpen}
        onClose={() => setIsGamificationOpen(false)}
        userLevel={userLevel}
        challenges={challenges}
        badges={badges}
        onClaimChallenge={handleClaimChallenge}
        onOpenMeditation={() => setIsMeditationOpen(true)}
        onOpenSleep={() => setIsSleepOpen(true)}
        onOpenBPFoods={() => setIsBPFoodsOpen(true)}
        onOpenPuzzles={() => setIsPuzzleOpen(true)}
      />

      {/* 14. Personalized Wellness Feed Modal with Bookmarking & Sharing */}
      <PersonalizedFeedModal
        isOpen={isFeedOpen}
        onClose={() => setIsFeedOpen(false)}
        feedItems={feedItems}
        currentMScore={currentUser.currentMScore}
        onToggleBookmark={handleToggleBookmark}
        onShareItem={(item) => handleOpenShareModal(item.title, item.summary, item.category)}
      />

      {/* 15. Share Tip With Friends Modal */}
      <ShareTipModal
        isOpen={isShareTipOpen}
        onClose={() => setIsShareTipOpen(false)}
        tipTitle={shareTipData.title}
        tipSummary={shareTipData.summary}
        category={shareTipData.category}
        friends={friends}
        onConfirmShare={handleConfirmShare}
      />
    </>
  );

  // If user is not logged in, render First Page (FrontPageAuth)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <FrontPageAuth onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // FIRST-CLASS VIEW: AI Wellness Companion Centered Studio (Matching Wireframe)
  if (currentView === 'companion') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
        {/* Floating Score Toast */}
        {scoreToast && (
          <div
            id="score-reward-toast"
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-400 text-white shadow-2xl flex items-center gap-2.5 animate-bounce text-xs font-bold font-mono"
          >
            <Award className="w-4 h-4 text-indigo-400" />
            <span>{scoreToast}</span>
          </div>
        )}

        <AIWellnessCompanionView
          user={currentUser}
          currentMScore={currentUser.currentMScore}
          bloodPressureString={bpString}
          config={avatarConfig}
          onUpdateMScore={(delta) => triggerScoreReward(delta, `+${delta} M-Score earned!`)}
          onSwitchToConsole={() => setCurrentView('console')}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenMessages={() => setIsMailboxOpen(true)}
        />

        {renderModals()}
      </div>
    );
  }

  // SECOND PAGE: Full Profile & Interactive AI 3D M-Health Console
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Subtle Background Geometric Balance Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(79,70,229,0.1)_0%,_transparent_40%),radial-gradient(circle_at_80%_80%,_rgba(16,185,129,0.06)_0%,_transparent_40%)] pointer-events-none" />

      {/* Floating Score Toast */}
      {scoreToast && (
        <div
          id="score-reward-toast"
          className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-400 text-white shadow-2xl flex items-center gap-2.5 animate-bounce text-xs font-bold font-mono"
        >
          <Award className="w-4 h-4 text-indigo-400" />
          <span>{scoreToast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-md">
        {/* Left: Top-Left Mailbox Icon & Console Branding */}
        <div className="flex items-center gap-3">
          <button
            id="top-left-mailbox-btn"
            onClick={() => setIsMailboxOpen(true)}
            className="relative w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center transition cursor-pointer text-slate-300 hover:text-indigo-400"
            title="Open Mailbox (Incoming Friend Requests)"
          >
            <Mail className="w-4 h-4" />
            {friendRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {friendRequests.length}
              </span>
            )}
          </button>

          <div className="ml-1 sm:ml-2">
            <p className="text-sm font-bold text-white uppercase tracking-wider">M-Health Console</p>
            <p className="text-xs text-slate-400 font-mono">ID: USER_{currentUser.id.toUpperCase().slice(0, 8)}</p>
          </div>
        </div>

        {/* Center: Level Progress, M-Score & Vitals */}
        <div className="hidden md:flex gap-4 items-center">
          {/* Level Progress Button */}
          <button
            onClick={() => setIsGamificationOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 hover:border-indigo-400 transition cursor-pointer text-xs"
            title="View Quests, Badges & Level Progress"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Lvl {userLevel.level}: {userLevel.levelName}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {userLevel.currentXp}/{userLevel.xpForNextLevel} XP
            </span>
          </button>

          {/* Curated Feed Shortcut */}
          <button
            onClick={() => setIsFeedOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500/50 transition cursor-pointer text-xs"
            title="Curated Wellness Feed & Articles"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Wellness Feed
            </span>
          </button>

          {/* Vitals Badge */}
          <div
            onClick={() => setIsPairOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500/50 transition cursor-pointer text-xs"
            title="Click to view Tracker & Blood Pressure"
          >
            <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold">{bpString}</span>
            <span className="text-[10px] text-slate-500">mmHg</span>
          </div>
        </div>

        {/* Right: Avatar Config, Profile & Logout */}
        <div className="flex gap-2.5 items-center">
          {/* Switch to 3D Avatar Companion Button */}
          <button
            onClick={() => setCurrentView('companion')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 transition cursor-pointer border border-indigo-400/40"
            title="Switch to Centered 3D Human-like AI Avatar Companion"
          >
            <Brain className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">3D Avatar Companion</span>
          </button>

          <button
            onClick={() => setIsGamificationOpen(true)}
            className="sm:hidden p-2 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-amber-400"
            title="Gamification"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            id="header-customize-btn"
            onClick={() => setIsCustomizerOpen(true)}
            className="hidden sm:inline-flex px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Configure Avatar & Voice"
          >
            Avatar Config
          </button>

          <button
            id="top-profile-btn"
            onClick={() => setIsProfileOpen(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl flex items-center justify-center border border-indigo-400 shadow-lg shadow-indigo-900/20 text-white font-bold hover:bg-indigo-500 transition cursor-pointer"
            title={`Profile: ${currentUser.name}`}
          >
            <User className="w-5 h-5 text-white" />
          </button>

          <button
            id="top-logout-btn"
            onClick={handleLogout}
            className="w-10 h-10 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Second-Page Layout */}
      <main className="flex-1 relative p-4 sm:p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start z-10">
        {/* LEFT COLUMN: Camera HUD, M-Score Pie Chart with Center Emoji & Vitals */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* 1. Camera HUD for bio-scan */}
          <CameraHUD onBioScanCompleted={() => triggerScoreReward(2, 'Bio-scan complete! +2 M-Score.')} />

          {/* 2. M-Score in Pie / Donut Chart with Dynamic Center Emoji */}
          <MScoreDonutChart
            score={currentUser.currentMScore}
            previousScore={currentUser.previousMScore}
            onOpenPerformance={() => setIsPerformanceOpen(true)}
            onEmojiClick={() => {
              triggerScoreReward(1, 'Mindful reflection noted! +1 M-Score');
            }}
          />

          {/* 3. Gamification Quick Progress Banner */}
          <div className="p-5 bg-slate-900/90 border border-slate-700 rounded-2xl backdrop-blur-sm space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Daily Quests &amp; Badges
                </h3>
              </div>
              <button
                onClick={() => setIsGamificationOpen(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider transition cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {challenges.slice(0, 2).map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => setIsGamificationOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-slate-700 transition"
                >
                  <div className="pr-2">
                    <span className="font-bold text-slate-200 block text-[11px] truncate">
                      {ch.title}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      +{ch.mScoreReward} M-Score • {ch.currentProgress}/{ch.maxProgress} {ch.unit}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold uppercase font-mono">
                    {ch.period}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsGamificationOpen(true)}
              className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-300 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Gamified Journey</span>
            </button>
          </div>

          {/* 4. Connected Tracker Status Quick Card */}
          <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-2xl backdrop-blur-sm space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Vitals Monitoring
            </h3>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300">Blood Pressure</span>
              <span className="text-emerald-400 font-mono text-sm font-bold">{bpString}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
              <span>Active Sensor</span>
              <span className="text-slate-200">Whoop 4.0 Screen-Free Band</span>
            </div>
            <button
              onClick={() => setIsPairOpen(true)}
              className="w-full py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Watch className="w-3.5 h-3.5 text-slate-400" />
              <span>Pair Smart Device</span>
            </button>
          </div>
        </div>

        {/* MIDDLE & RIGHT: Real Female AI Avatar & Multilingual Communication Center */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 3D / Real Female Avatar Viewport */}
            <div className="md:col-span-5 h-[380px] md:h-[520px]">
              <ThreeAvatar
                config={avatarConfig}
                isSpeaking={isAvatarSpeaking}
                mScore={currentUser.currentMScore}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
              />
            </div>

            {/* AI Avatar Real-time Multilingual Communication Center */}
            <div className="md:col-span-7 h-[520px]">
              <AvatarChat
                user={currentUser}
                currentMScore={currentUser.currentMScore}
                bloodPressureString={bpString}
                config={avatarConfig}
                onSetIsSpeaking={setIsAvatarSpeaking}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
                onOpenPuzzles={() => setIsPuzzleOpen(true)}
                onOpenMeditation={() => setIsMeditationOpen(true)}
                onOpenSleepSchedule={() => setIsSleepOpen(true)}
                onOpenBPFoods={() => setIsBPFoodsOpen(true)}
                onOpenMedications={() => setIsMedicationOpen(true)}
                onOpenDoctorScheduler={() => setIsDoctorOpen(true)}
                onOpenGamification={() => setIsGamificationOpen(true)}
                onOpenFeed={() => setIsFeedOpen(true)}
                onShareTip={(title, summary) => handleOpenShareModal(title, summary, 'Avatar Advice')}
                onUpdateMScore={(pts) => triggerScoreReward(pts)}
              />
            </div>
          </div>

          {/* Action Ribbon: Leaderboard, Curated Feed, and Device Pair */}
          <div
            id="bottom-right-action-bar"
            className="p-5 bg-slate-900/80 border border-slate-700 rounded-2xl backdrop-blur-sm flex flex-wrap items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Wellness Community &amp; Bio-Network
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Curated Feed Button */}
              <button
                onClick={() => setIsFeedOpen(true)}
                className="py-2.5 px-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Personalized Feed</span>
              </button>

              {/* Leaderboard Button */}
              <button
                id="below-right-rank-btn"
                onClick={() => setIsRankOpen(true)}
                className="py-2.5 px-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Leaderboard</span>
              </button>

              {/* Pair Smart Device Button */}
              <button
                id="beside-rank-pair-btn"
                onClick={() => setIsPairOpen(true)}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 shadow-lg shadow-indigo-900/20 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 cursor-pointer"
              >
                <Watch className="w-4 h-4 text-indigo-200" />
                <span>Pair Trackers</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Geometric Balance Footer */}
      <footer className="h-12 bg-slate-900 border-t border-slate-800 flex items-center px-6 sm:px-10 justify-between text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-auto z-20">
        <div className="flex gap-6 sm:gap-8">
          <span>Secure Node: 242-LX</span>
          <span>Encrypted Session</span>
          <span className="hidden sm:inline">Multilingual AI Voice: Active</span>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <span className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
            Privacy Policy
          </span>
          <span className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
            Support
          </span>
        </div>
      </footer>

      {/* MODALS */}
      {renderModals()}
    </div>
  );
}
