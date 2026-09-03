import {
  Challenge,
  Badge,
  UserLevelInfo,
  FeedItem,
  VisualNumberPuzzle,
  VisualWordFindPuzzle,
} from '../types';

export const INITIAL_USER_LEVEL: UserLevelInfo = {
  level: 3,
  levelName: 'Bio-Resilient Adept',
  currentXp: 340,
  xpForNextLevel: 500,
  totalXp: 840,
  perks: [
    'Unlocked 3D Real Female Avatar Mode',
    'Cognitive Puzzle M-Score Multiplier (+25%)',
    'Access to Multilingual Voice Synthesis (Telugu, Hindi, Tamil, Kannada)',
  ],
};

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Morning 4-7-8 Zen Resonance',
    description: 'Complete at least 1 full 4-7-8 breathing session to stabilize autonomic heart rate.',
    category: 'meditation',
    period: 'daily',
    xpReward: 35,
    mScoreReward: 3,
    icon: 'Wind',
    currentProgress: 1,
    maxProgress: 1,
    unit: 'session',
    isCompleted: true,
    isClaimed: false,
  },
  {
    id: 'ch-2',
    title: 'Circadian Sleep Target',
    description: 'Sync your smartwatch or wearable and maintain sleep score above 80.',
    category: 'sleep',
    period: 'daily',
    xpReward: 40,
    mScoreReward: 4,
    icon: 'Moon',
    currentProgress: 0,
    maxProgress: 1,
    unit: 'night',
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'ch-3',
    title: 'Potassium Vascular Shield',
    description: 'Log or prepare 1 high-potassium, low-sodium dish (Spinach, Banana, or Roasted Beets).',
    category: 'nutrition',
    period: 'daily',
    xpReward: 30,
    mScoreReward: 2,
    icon: 'Apple',
    currentProgress: 1,
    maxProgress: 1,
    unit: 'meal',
    isCompleted: true,
    isClaimed: false,
  },
  {
    id: 'ch-4',
    title: 'Pattern Matrix IQ Spark',
    description: 'Solve 1 visual number pattern puzzle to stimulate prefrontal cortex neuroplasticity.',
    category: 'puzzle',
    period: 'daily',
    xpReward: 45,
    mScoreReward: 3,
    icon: 'Brain',
    currentProgress: 0,
    maxProgress: 1,
    unit: 'puzzle',
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'ch-w1',
    title: '7-Day Mindful Consistency',
    description: 'Meditate or complete mindfulness breathing for 5 distinct days this week.',
    category: 'meditation',
    period: 'weekly',
    xpReward: 150,
    mScoreReward: 6,
    icon: 'Sparkles',
    currentProgress: 4,
    maxProgress: 5,
    unit: 'days',
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'ch-w2',
    title: 'Endothelial Blood Pressure Mastery',
    description: 'Keep systolic blood pressure under 125 mmHg across 4 tracker synchronizations.',
    category: 'nutrition',
    period: 'weekly',
    xpReward: 140,
    mScoreReward: 5,
    icon: 'HeartPulse',
    currentProgress: 4,
    maxProgress: 4,
    unit: 'syncs',
    isCompleted: true,
    isClaimed: false,
  },
  {
    id: 'ch-w3',
    title: 'Deep Slumber Architect',
    description: 'Log 7+ hours of circadian sleep with REM phase > 20% for 4 days.',
    category: 'sleep',
    period: 'weekly',
    xpReward: 160,
    mScoreReward: 7,
    icon: 'ShieldCheck',
    currentProgress: 3,
    maxProgress: 4,
    unit: 'nights',
    isCompleted: false,
    isClaimed: false,
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-1',
    title: 'Zen Pioneer',
    description: 'Completed your first 4-7-8 breathwork cycle with AURA.',
    icon: 'Wind',
    unlocked: true,
    unlockedAt: 'Sep 1, 2026',
    category: 'zen',
  },
  {
    id: 'b-2',
    title: 'Matrix Pattern Master',
    description: 'Solved 3 picture-based number pattern puzzles with 100% accuracy.',
    icon: 'Brain',
    unlocked: true,
    unlockedAt: 'Sep 2, 2026',
    category: 'puzzles',
  },
  {
    id: 'b-3',
    title: 'Vascular Guardian',
    description: 'Maintained optimal resting blood pressure & shared superfood recipes.',
    icon: 'HeartPulse',
    unlocked: true,
    unlockedAt: 'Sep 3, 2026',
    category: 'nutrition',
  },
  {
    id: 'b-4',
    title: 'Deep Slumber Champion',
    description: 'Achieved 85+ sleep index on connected smartwatch.',
    icon: 'Moon',
    unlocked: false,
    category: 'sleep',
  },
  {
    id: 'b-5',
    title: 'Resilience Luminary',
    description: 'Reached and maintained an M-Score of 90 or higher.',
    icon: 'Crown',
    unlocked: false,
    category: 'zen',
  },
  {
    id: 'b-6',
    title: 'Empathy Connector',
    description: 'Shared 5 mindful health tips with connected community friends.',
    icon: 'Share2',
    unlocked: false,
    category: 'social',
  },
];

export const PERSONALIZED_FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    title: 'Vagus Nerve Reset: The 4-7-8 Parasympathetic Blueprint',
    category: 'meditation',
    readTime: '3 min read & audio',
    author: 'Dr. Sarah Lin, MD',
    authorRole: 'Chief Neuropsychiatrist',
    summary: 'Clinical mechanisms of how prolonged exhalations stimulate acetylcholine release to instantly drop resting pulse and elevate M-Score.',
    content: `When stress triggers sympathetic overdrive, cortisol floods synaptic pathways, causing the M-Score to deteriorate.

By practicing the 4-7-8 breathing method:
1. Inhale quietly through your nose for 4 seconds, filling the lower abdomen.
2. Hold your breath calmly for 7 counts, allowing oxygen transfer.
3. Exhale completely through your mouth with a soft whoosh sound for 8 seconds.

This ratio activates the myelinated vagus nerve, rapidly lowering arterial systolic tension within 120 seconds.`,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    tags: ['Breathwork', 'Vagus Nerve', 'Autonomic Nervous System'],
    mScoreTarget: 'Recommended for M-Score 60 - 85',
    isBookmarked: false,
    likesCount: 142,
    sharedCount: 38,
  },
  {
    id: 'feed-2',
    title: 'Beetroot & Dark Cacao Elixir: Nitric Oxide Protocol for Blood Pressure',
    category: 'recipe',
    readTime: '4 min recipe',
    author: 'Chef David Vance',
    authorRole: 'Clinical Neuro-Nutritionist',
    summary: 'A delicious daily smoothie providing 480mg natural dietary nitrates and epicatechin flavonoids to relax vascular smooth muscle.',
    content: `Ingredients:
• 1 medium roasted beetroot (rich in inorganic nitrates NO3-)
• 1 tablespoon raw unalkalized dark cocoa powder (>80% flavanols)
• 1/2 ripe banana (high potassium to flush intracellular sodium)
• 1 cup unsweetened almond or oat milk
• 1 tablespoon chia seeds for plant-based Omega-3 ALA

Instructions:
Blend at high speed for 60 seconds. Drink 2 hours before peak mental focus or stressful meetings. Clinical trials demonstrate a 4-7 mmHg reduction in systolic blood pressure within 3 hours.`,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    tags: ['Superfood', 'Vascular Health', 'Nitric Oxide'],
    mScoreTarget: 'All M-Scores (Optimal Cardio-Protection)',
    isBookmarked: true,
    likesCount: 219,
    sharedCount: 64,
  },
  {
    id: 'feed-3',
    title: 'Circadian Photobiology: Morning Lux Exposure for Nighttime REM',
    category: 'article',
    readTime: '5 min read',
    author: 'Dr. Maya Patel, PsyD',
    authorRole: 'Behavioral Sleep & Circadian Specialist',
    summary: 'Why getting 10,000 lux within 30 minutes of waking anchors the suprachiasmatic nucleus, elevating nocturnal deep sleep by 28%.',
    content: `Melatonin synthesis begins 14-16 hours after your first photon exposure in the morning.

When morning photons strike intrinsically photosensitive retinal ganglion cells (ipRGCs), they suppress lingering melatonin and trigger an optimal cortisol pulse.

Rules for maximum M-Score recovery:
• View outdoor sunlight within 30 minutes of waking for 10-15 minutes (even on cloudy days).
• Avoid bright overhead ceiling lights after 9:00 PM; switch to warm floor lamps.
• Keep bedroom temperature between 65-68°F (18-20°C) to allow core temperature to drop.`,
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80',
    tags: ['Sleep Hygiene', 'Circadian Rhythm', 'REM Optimization'],
    mScoreTarget: 'Recommended for M-Score < 80',
    isBookmarked: false,
    likesCount: 188,
    sharedCount: 45,
  },
  {
    id: 'feed-4',
    title: 'Dr. Aris Thorne on Screening High Blood Pressure in Screen-Free Wearables',
    category: 'advice',
    readTime: '3 min advice',
    author: 'Dr. Aris Thorne, MD',
    authorRole: 'Integrative Cardiovascular Cardiologist',
    summary: 'Understanding pulse transit time (PTT) and how screen-free devices like Whoop and Oura detect arterial stiffness before symptoms emerge.',
    content: `Screen-free fitness trackers and smart rings measure optical photoplethysmography (PPG) waveform velocities.

When systolic pressure rises above 135 mmHg, arterial wall stiffness quickens pulse wave velocity. If your live telemetry flags elevated BP:
1. Stop intense mental multitasking for 10 minutes.
2. Sip room-temperature water with lemon or hibiscus.
3. Conduct 3 cycles of physiological sighs (two quick inhales through the nose, one long sigh out the mouth).
4. If sustained over 140/90, consult with a physician via the in-app scheduler.`,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    tags: ['Cardiology', 'Wearable Telemetry', 'Clinical Advice'],
    mScoreTarget: 'All M-Scores (Vascular Monitoring)',
    isBookmarked: false,
    likesCount: 97,
    sharedCount: 22,
  },
  {
    id: 'feed-5',
    title: 'Brain-Derived Neurotrophic Factor (BDNF): Neuroplasticity in Minutes',
    category: 'article',
    readTime: '4 min read',
    author: 'Dr. Sarah Lin, MD',
    authorRole: 'Cognitive Health Researcher',
    summary: 'How solving visual geometric pattern puzzles and spatial riddles triggers dendritic spine growth and enhances mental resilience.',
    content: `Your brain is not fixed—it is dynamically plastic. Engaging in visual pattern recognition puzzles forces the bilateral prefrontal cortex and parietal regions to co-activate.

This burst of coordinated neural firing releases BDNF—the brain's miracle fertilizer. Even 5 minutes of visual puzzles per day protects against mental fatigue and boosts working memory scores.`,
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
    tags: ['Neuroplasticity', 'Brain Puzzles', 'BDNF'],
    mScoreTarget: 'All M-Scores',
    isBookmarked: true,
    likesCount: 275,
    sharedCount: 89,
  },
];

export const VISUAL_NUMBER_PUZZLES: VisualNumberPuzzle[] = [
  {
    id: 'vnum-1',
    title: 'Visual Geometric Matrix Pattern',
    category: 'matrix',
    difficulty: 'Medium',
    grid: [
      [3, 6, 9],
      [4, 8, 12],
      [5, 10, '?'],
    ],
    missingPosition: { row: 2, col: 2 },
    options: [12, 14, 15, 18],
    correctAnswer: 15,
    hint: 'Look horizontally across each row: Row 1 multiplies by 2 & 3 (3, 6, 9). Row 2 multiplies by 2 & 3 (4, 8, 12).',
    explanation: 'Each row follows the arithmetic progression where Column 2 = Col 1 × 2, and Column 3 = Col 1 × 3. For row 3: 5 × 3 = 15. Excellent prefrontal cortex pattern recognition!',
    scorePoints: 6,
  },
  {
    id: 'vnum-2',
    title: 'Fibonacci Spiral Grid',
    category: 'pattern',
    difficulty: 'Easy',
    grid: [
      [1, 1, 2],
      [3, 5, 8],
      [13, 21, '?'],
    ],
    missingPosition: { row: 2, col: 2 },
    options: [29, 34, 38, 42],
    correctAnswer: 34,
    hint: 'Each number is the sum of the preceding two numbers (13 + 21 = ?).',
    explanation: 'This is the sacred Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21, 34). 13 + 21 = 34. Natural harmonic ratio boosts cognitive calmness.',
    scorePoints: 5,
  },
  {
    id: 'vnum-3',
    title: 'Diagonally Balanced Cross Sum',
    category: 'geometric',
    difficulty: 'Hard',
    grid: [
      [2, 7, 6],
      [9, 5, 1],
      [4, 3, '?'],
    ],
    missingPosition: { row: 2, col: 2 },
    options: [6, 7, 8, 9],
    correctAnswer: 8,
    hint: 'This is the ancient 3x3 Lo Shu magic square! Every row, column, and diagonal adds up to 15.',
    explanation: 'In this magic square, every row and column sums to 15. Row 3: 4 + 3 + ? = 15 => ? = 8. High-level spatial working memory stimulated!',
    scorePoints: 8,
  },
];

export const VISUAL_WORD_FIND_PUZZLES: VisualWordFindPuzzle[] = [
  {
    id: 'vword-1',
    title: 'Neuro-Mindfulness Word Matrix',
    theme: 'Mental Resilience & Bio-Balance',
    grid: [
      ['C', 'A', 'L', 'M', 'S', 'X'],
      ['P', 'E', 'A', 'C', 'E', 'B'],
      ['F', 'O', 'C', 'U', 'S', 'R'],
      ['S', 'L', 'E', 'E', 'P', 'E'],
      ['H', 'E', 'A', 'R', 'T', 'A'],
      ['Z', 'E', 'N', 'I', 'T', 'T'],
    ],
    targetWords: [
      { word: 'CALM', clue: 'State of tranquility and lower autonomic stress', found: false },
      { word: 'PEACE', clue: 'Inner quietude boosting emotional regulation', found: false },
      { word: 'FOCUS', clue: 'Attentive prefrontal cortex concentration', found: false },
      { word: 'SLEEP', clue: 'Essential circadian restorative state', found: false },
      { word: 'HEART', clue: 'Organ producing therapeutic heart rate variability (HRV)', found: false },
      { word: 'ZEN', clue: 'Mindful presence in the ongoing moment', found: false },
    ],
    scorePoints: 8,
  },
  {
    id: 'vword-2',
    title: 'Vascular & Brain Nutrition Matrix',
    theme: 'Superfoods for Healthy Blood Pressure',
    grid: [
      ['B', 'E', 'E', 'T', 'S', 'P'],
      ['C', 'A', 'C', 'A', 'O', 'O'],
      ['S', 'P', 'I', 'N', 'A', 'C'],
      ['O', 'M', 'E', 'G', 'A', 'H'],
      ['A', 'V', 'O', 'C', 'A', 'D'],
      ['B', 'A', 'N', 'A', 'N', 'A'],
    ],
    targetWords: [
      { word: 'BEETS', clue: 'Potent source of nitric oxide for blood vessels', found: false },
      { word: 'CACAO', clue: 'Rich in polyphenols that soften arterial tension', found: false },
      { word: 'OMEGA', clue: 'Essential fatty acid for neural membrane fluidity', found: false },
      { word: 'BANANA', clue: 'Abundant in potassium to balance sodium levels', found: false },
    ],
    scorePoints: 8,
  },
];

export const INITIAL_FEED_ITEMS: FeedItem[] = PERSONALIZED_FEED_ITEMS;

export const MULTILINGUAL_DATA: Record<
  string,
  {
    name: string;
    nativeName: string;
    bcp47: string;
    greeting: string;
    sampleTip: string;
  }
> = {
  en: {
    name: 'English',
    nativeName: 'English',
    bcp47: 'en-US',
    greeting: 'Hello! I am AURA, your real female AI wellness guide. How are you feeling today?',
    sampleTip: 'Taking 3 deep 4-7-8 breaths immediately relaxes arterial tension and raises your M-Score.',
  },
  te: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    greeting: 'నమస్కారం! నేను ఆరా (AURA), మీ నిజమైన AI ఆరోగ్య మార్గదర్శిని. ఈరోజు మీ ఆరోగ్యం మరియు మనశ్శాంతి ఎలా ఉన్నాయి?',
    sampleTip: 'మూడు సార్లు 4-7-8 దీర్ఘశ్వాస తీసుకోవడం వలన రక్తపోటు తగ్గి మీ M-Score వెంటనే మెరుగుపడుతుంది.',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    greeting: 'नमस्ते! मैं ऑरा (AURA) हूँ, आपकी AI कल्याण और मानसिक स्वास्थ्य मार्गदर्शिका। आज आप कैसा महसूस कर रहे हैं?',
    sampleTip: '3 बार गहरी 4-7-8 श्वास लेने से रक्तचाप शांत होता है और आपका M-Score बेहतर होता है।',
  },
  ta: {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    bcp47: 'ta-IN',
    greeting: 'வணக்கம்! நான் ஆரா (AURA), உங்கள் AI ஆரோக்கிய வழிகாட்டி. இன்று உங்கள் மனநிலை மற்றும் ஆரோக்கியம் எப்படி இருக்கிறது?',
    sampleTip: '3 முறை 4-7-8 ஆழமான மூச்சு எடுப்பது இரத்த அழுத்தத்தை சீராக்கி உங்கள் M-Score-ஐ உயர்த்தும்.',
  },
  kn: {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    bcp47: 'kn-IN',
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು ಔರಾ (AURA), ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ. ಇಂದು ನಿಮ್ಮ ಮನಸ್ಸು ಮತ್ತು ಆರೋಗ್ಯ ಹೇಗಿದೆ?',
    sampleTip: '3 ಬಾರಿ 4-7-8 ಆಳವಾದ ಉಸಿರಾಟ ಮಾಡುವುದರಿಂದ ರಕ್ತದೊತ್ತಡ ನಿಯಂತ್ರಣಕ್ಕೆ ಬಂದು ನಿಮ್ಮ M-Score ಹೆಚ್ಚುತ್ತದೆ.',
  },
};

