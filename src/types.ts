export type Gender = 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  mScore: number;
  gender: string;
  status: 'online' | 'offline' | 'meditating';
  isBlocked?: boolean;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderMScore: number;
  message: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  friends: Friend[];
  blockedFriends: string[]; // IDs
  currentMScore: number;
  previousMScore: number;
  avatarConfig: AvatarConfig;
  password?: string;
}

export interface AvatarConfig {
  style: 'hologram' | 'zen' | 'cyber' | 'clinical';
  glowColor: string; // Hex e.g. '#06b6d4'
  hairStyle: 'aura' | 'sleek' | 'halo' | 'crown';
  hasVisor: boolean;
  voiceName: string;
  voicePitch: number; // 0.5 to 1.5
  voiceRate: number; // 0.5 to 1.5
  autoSpeech: boolean;
}

export interface MScoreHistoryPoint {
  date: string;
  score: number;
  stress: number; // 0-100 (lower is better)
  sleep: number; // 0-100
  focus: number; // 0-100
  heartRate: number;
}

export interface BloodPressureData {
  systolic: number; // e.g. 120
  diastolic: number; // e.g. 80
  pulse: number; // bpm
  status: 'normal' | 'elevated' | 'high' | 'low';
  lastUpdated: string;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'ring' | 'band' | 'screen_free';
  connected: boolean;
  batteryLevel: number;
  lastSynced?: string;
}

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  time: string; // e.g. "08:00 AM"
  taken: boolean;
  frequency: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  avatar: string;
  rating: number;
  availableDays: string[];
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  mode: 'Video Call' | 'In-Clinic';
  notes: string;
  status: 'Confirmed' | 'Pending';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionPayload?: {
    type: 'doctor' | 'puzzle' | 'meditation' | 'sleep' | 'food';
    data?: any;
  };
}

export interface Puzzle {
  id: string;
  title: string;
  category: 'logic' | 'memory' | 'zen';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  scorePoints: number;
}

export type AvatarLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'meditation' | 'sleep' | 'nutrition' | 'puzzle';
  period: 'daily' | 'weekly';
  xpReward: number;
  mScoreReward: number;
  icon: string;
  currentProgress: number;
  maxProgress: number;
  unit: string;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'zen' | 'sleep' | 'nutrition' | 'puzzles' | 'social';
}

export interface UserLevelInfo {
  level: number;
  levelName: string;
  currentXp: number;
  xpForNextLevel: number;
  totalXp: number;
  perks: string[];
}

export interface FeedItem {
  id: string;
  title: string;
  category: 'meditation' | 'recipe' | 'article' | 'advice';
  readTime: string;
  author: string;
  authorRole: string;
  summary: string;
  content: string;
  imageUrl: string;
  tags: string[];
  mScoreTarget: string; // e.g. 'Ideal for M-Score < 80' or 'All Scores'
  isBookmarked: boolean;
  likesCount: number;
  sharedCount: number;
}

export interface VisualNumberPuzzle {
  id: string;
  title: string;
  category: 'pattern' | 'matrix' | 'geometric';
  grid: (number | string)[][]; // 3x3 or sequence
  missingPosition: { row: number; col: number };
  options: (number | string)[];
  correctAnswer: number | string;
  hint: string;
  explanation: string;
  scorePoints: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface VisualWordFindPuzzle {
  id: string;
  title: string;
  theme: string;
  grid: string[][]; // e.g. 6x6 letters
  targetWords: { word: string; clue: string; found: boolean }[];
  scorePoints: number;
}

export interface SharedTip {
  id: string;
  title: string;
  content: string;
  category: string;
  sharedBy: string;
  sharedWith: string; // Friend name or 'All Friends'
  timestamp: string;
}

export type AvatarEmotion =
  | 'happy'
  | 'thoughtful'
  | 'empathetic'
  | 'encouraging'
  | 'surprised'
  | 'calm';

export type AvatarGesture =
  | 'thumbs_up'
  | 'wave'
  | 'thinking'
  | 'point'
  | 'open_hands'
  | 'clapping'
  | 'resting';

export type AvatarPose = 'standing' | 'sitting';

export type DynamicPuzzleCategory =
  | 'Memory'
  | 'Memory puzzles'
  | 'Pattern recognition'
  | 'Number puzzles'
  | 'Visual matching'
  | 'Attention exercises'
  | 'Logic questions'
  | 'Problem-solving';

export interface DynamicPuzzle {
  id: string;
  category: DynamicPuzzleCategory;
  title: string;
  question: string;
  visualData?: {
    type: 'sequence' | 'matrix' | 'colors' | 'shapes' | 'cards';
    items: string[];
    grid?: (string | number)[][];
    missingIndex?: number;
  };
  options?: (string | number)[];
  expectedAnswer: string | number;
  hint: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardPoints: number;
}

export interface BrainInstruction {
  understoodResponse?: string;
  isCorrect?: boolean | null;
  speech: string;
  emotion: AvatarEmotion;
  gesture: AvatarGesture;
  giveEncouragement?: boolean;
  encouragementNote?: string;
  next_action:
    | 'success'
    | 'encourage'
    | 'ask_question'
    | 'give_puzzle'
    | 'wellness_suggestion'
    | 'neutral';
  difficulty?: 'increase' | 'decrease' | 'maintain';
  mScoreChange?: number;
  activePuzzle?: DynamicPuzzle | null;
}

