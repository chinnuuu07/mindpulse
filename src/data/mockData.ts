import {
  Friend,
  FriendRequest,
  MScoreHistoryPoint,
  Doctor,
  MedicationReminder,
  Puzzle,
  UserProfile,
  BloodPressureData,
  ConnectedDevice,
  AvatarConfig,
} from '../types';

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  style: 'hologram',
  glowColor: '#818cf8',
  hairStyle: 'halo',
  hasVisor: true,
  voiceName: 'AURA Calming',
  voicePitch: 1.0,
  voiceRate: 1.0,
  autoSpeech: true,
};

export const INITIAL_BLOOD_PRESSURE: BloodPressureData = {
  systolic: 118,
  diastolic: 76,
  pulse: 68,
  status: 'normal',
  lastUpdated: '2 mins ago',
};

export const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-1',
    name: 'Whoop 4.0 Screen-Free Band',
    type: 'screen_free',
    connected: true,
    batteryLevel: 88,
    lastSynced: 'Just now',
  },
  {
    id: 'dev-2',
    name: 'Apple Watch Ultra / Series 10',
    type: 'smartwatch',
    connected: false,
    batteryLevel: 94,
    lastSynced: '1 hr ago',
  },
  {
    id: 'dev-3',
    name: 'Oura Ring Gen 3',
    type: 'screen_free',
    connected: true,
    batteryLevel: 72,
    lastSynced: '10 mins ago',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'alex_rivera',
  name: 'Alex Rivera',
  age: 26,
  gender: 'Male',
  friends: [],
  blockedFriends: [],
  currentMScore: 85,
  previousMScore: 78,
  avatarConfig: DEFAULT_AVATAR_CONFIG,
  password: 'mindful2026',
};

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f-1',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    mScore: 94,
    gender: 'Female',
    status: 'online',
  },
  {
    id: 'f-2',
    name: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mScore: 91,
    gender: 'Male',
    status: 'meditating',
  },
  {
    id: 'f-3',
    name: 'Sophia Rao',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    mScore: 88,
    gender: 'Female',
    status: 'online',
  },
  {
    id: 'f-4',
    name: 'Noah Bennett',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    mScore: 84,
    gender: 'Male',
    status: 'offline',
  },
  {
    id: 'f-5',
    name: 'Chloe Zhang',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    mScore: 79,
    gender: 'Female',
    status: 'online',
  },
  {
    id: 'f-6',
    name: 'Ethan Cole',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    mScore: 72,
    gender: 'Male',
    status: 'offline',
  },
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'req-1',
    senderId: 'f-req-1',
    senderName: 'Dr. Evelyn Woods',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    senderMScore: 92,
    message: 'Hey Alex! Would love to compare wellness streaks and share meditation tips on M-Score.',
    timestamp: '15 mins ago',
  },
  {
    id: 'req-2',
    senderId: 'f-req-2',
    senderName: 'David Kalu',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    senderMScore: 86,
    message: 'Met in the Mindful Breathing community! Connecting to track our weekly M-Scores.',
    timestamp: '2 hours ago',
  },
  {
    id: 'req-3',
    senderId: 'f-req-3',
    senderName: 'Aria Sterling',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    senderMScore: 89,
    message: 'Let us stay accountable on sleep hygiene and puzzle solving together!',
    timestamp: 'Yesterday',
  },
];

export const M_SCORE_HISTORY: MScoreHistoryPoint[] = [
  { date: 'Day -6', score: 68, stress: 58, sleep: 65, focus: 70, heartRate: 78 },
  { date: 'Day -5', score: 71, stress: 52, sleep: 70, focus: 73, heartRate: 75 },
  { date: 'Day -4', score: 70, stress: 50, sleep: 68, focus: 74, heartRate: 76 },
  { date: 'Day -3', score: 75, stress: 45, sleep: 76, focus: 79, heartRate: 72 },
  { date: 'Day -2', score: 74, stress: 46, sleep: 74, focus: 80, heartRate: 73 },
  { date: 'Yesterday', score: 79, stress: 38, sleep: 84, focus: 85, heartRate: 69 },
  { date: 'Today', score: 85, stress: 32, sleep: 88, focus: 90, heartRate: 67 },
];

export const DOCTORS_LIST: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Lin, MD',
    specialty: 'Neuropsychiatrist & Cognitive Health',
    hospital: 'Metropolitan Mind-Brain Institute',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    availableDays: ['Today (4:00 PM)', 'Tomorrow (10:30 AM)', 'Friday (2:00 PM)'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Aris Thorne, MD',
    specialty: 'Integrative Cardiovascular & Autonomic Wellness',
    hospital: 'Apex Cardio-Vascular Center',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    availableDays: ['Tomorrow (11:00 AM)', 'Thursday (3:30 PM)', 'Saturday (9:00 AM)'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Maya Patel, PsyD',
    specialty: 'Clinical Mindfulness & Behavioral Sleep Therapy',
    hospital: 'Serenity Rest & Recovery Clinic',
    avatar: 'https://images.unsplash.com/photo-1594824813576-578b97d2e4cb?w=150&auto=format&fit=crop&q=80',
    rating: 5.0,
    availableDays: ['Today (6:00 PM)', 'Wednesday (1:00 PM)', 'Friday (11:00 AM)'],
  },
];

export const INITIAL_MEDICATIONS: MedicationReminder[] = [
  {
    id: 'med-1',
    name: 'Magnesium L-Threonate',
    dosage: '400 mg (Neuro-relaxation & Sleep)',
    time: '09:30 PM',
    taken: false,
    frequency: 'Daily before sleep',
  },
  {
    id: 'med-2',
    name: 'Omega-3 EPA/DHA',
    dosage: '1000 mg (Cognitive Support)',
    time: '08:30 AM',
    taken: true,
    frequency: 'Daily with breakfast',
  },
  {
    id: 'med-3',
    name: 'CoQ10 & Hawthorn Berry Extract',
    dosage: '100 mg (Blood Pressure Balance)',
    time: '01:00 PM',
    taken: false,
    frequency: 'Daily with lunch',
  },
];

export const PUZZLES_LIST: Puzzle[] = [
  {
    id: 'puz-1',
    title: 'The Resilience Paradox',
    category: 'zen',
    question: 'I can be broken without being held. I can be given and kept at the same time. What am I?',
    options: ['A Promise', 'A Heart', 'Silence', 'A Reflection'],
    correctIndex: 0,
    explanation: 'A promise can be kept or broken, and holding onto commitments strengthens self-efficacy and M-Score.',
    scorePoints: 4,
  },
  {
    id: 'puz-2',
    title: 'Cognitive Pattern Flow',
    category: 'logic',
    question: 'Find the next number in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['38', '40', '42', '46'],
    correctIndex: 2,
    explanation: 'The difference increases by +2 each step: (+4, +6, +8, +10, so +12 -> 30 + 12 = 42). Great neuroplastic workout!',
    scorePoints: 5,
  },
  {
    id: 'puz-3',
    title: 'Mindful Perception Riddle',
    category: 'zen',
    question: 'The more you take, the more you leave behind. What are they?',
    options: ['Breaths', 'Footsteps', 'Memories', 'Worries'],
    correctIndex: 1,
    explanation: 'Footsteps! As you walk mindfully in the present moment, you leave footsteps behind.',
    scorePoints: 4,
  },
  {
    id: 'puz-4',
    title: 'Working Memory Matrix',
    category: 'memory',
    question: 'Which sequence reverses: Cyan -> Amber -> Emerald -> Violet?',
    options: [
      'Violet -> Emerald -> Amber -> Cyan',
      'Amber -> Cyan -> Violet -> Emerald',
      'Violet -> Amber -> Emerald -> Cyan',
      'Emerald -> Violet -> Cyan -> Amber',
    ],
    correctIndex: 0,
    explanation: 'Exact reverse order activates dorsolateral prefrontal cortex pathways, boosting mental resilience.',
    scorePoints: 5,
  },
];

export const BLOOD_PRESSURE_FOODS = [
  {
    category: 'High Potassium (Sodium Flusher)',
    badge: 'Potassium Rich',
    color: 'emerald',
    items: [
      { name: 'Fresh Spinach & Swiss Chard', benefit: 'Relaxes blood vessel walls and flushes intracellular sodium.', icon: 'Leaf' },
      { name: 'Ripe Bananas & Avocados', benefit: 'Contains ~450mg potassium per serving, directly buffering systolic pressure.', icon: 'Apple' },
      { name: 'Baked Sweet Potatoes', benefit: 'High in potassium and magnesium to ease vascular tension.', icon: 'Sparkles' },
    ],
  },
  {
    category: 'Nitric Oxide Boosters (Vasodilators)',
    badge: 'Endothelial Support',
    color: 'rose',
    items: [
      { name: 'Beetroot Juice / Roasted Beets', benefit: 'Dietary nitrates convert to nitric oxide, opening vessels within 2-3 hours.', icon: 'HeartPulse' },
      { name: 'Dark Leafy Arugula', benefit: 'Highest nitrate concentration of all salad greens.', icon: 'Flame' },
      { name: 'Pomegranate Seeds', benefit: 'Inhibits ACE (angiotensin converting enzyme) to soften arterial pressure.', icon: 'Sparkles' },
    ],
  },
  {
    category: 'Cardio Flavonoids & Magnesium',
    badge: 'Vascular Soother',
    color: 'amber',
    items: [
      { name: 'Dark Chocolate (>75% Raw Cacao)', benefit: 'Flavanols support endothelial function and calm the nervous system.', icon: 'Coffee' },
      { name: 'Raw Pumpkin Seeds (Pepitas)', benefit: 'One of nature’s dense magnesium sources for smooth muscle relaxation.', icon: 'Sun' },
      { name: 'Hibiscus Herbal Tea', benefit: 'Clinical trials show 2-3 cups daily significantly lowers systolic pressure naturally.', icon: 'CupSoda' },
    ],
  },
];
