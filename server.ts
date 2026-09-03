import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Avatar Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], userProfile = {}, currentMScore = 78, bloodPressure = "120/80" } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = `You are "AURA", an advanced 3D AI Mental Health & Wellness Avatar companion.
Your mission is to help the user evaluate and improve their "M-Score" (Mental Health Score, rated 0-100).
Current User Context:
- Name: ${userProfile.name || "Friend"}
- Age: ${userProfile.age || "Unknown"}
- Gender: ${userProfile.gender || "Not specified"}
- Current M-Score: ${currentMScore}/100
- Blood Pressure: ${bloodPressure} mmHg

Your capabilities:
1. Ask empathetic, diagnostic mental wellness check-in questions that calculate and adjust M-Score.
2. Provide brain teaser puzzles, mindfulness riddles, and cognitive exercises to sharpen mental focus.
3. Provide soothing meditation tips, guided breathing techniques (e.g. 4-7-8, box breathing).
4. Build tailored sleep schedules (circadian alignment, wind-down routines).
5. Suggest nutritional food items to regulate and balance blood pressure (potassium, magnesium, DASH diet, hibiscus tea, leafy greens).
6. Provide health advice and medication reminders.
7. Assist in scheduling doctor appointments directly when asked.

Response Style:
- Warm, uplifting, scientifically grounded, empathetic, and engaging.
- Keep responses concise (2 to 4 paragraphs max) so the 3D Avatar speech remains punchy and natural.
- You can include suggested quick actions in your message if helpful.`;

        // Format history for chat
        const contents = [];
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
        contents.push({
          role: "user",
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents.length > 1 ? contents : message,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const replyText = response.text || "I am here with you. Let's take a deep breath together to elevate your M-Score.";
        res.json({ reply: replyText });
        return;
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, falling back to local wellness engine:", geminiError?.message);
      }
    }

    // Intelligent Fallback responses if no API key or network glitch
    const lower = message.toLowerCase();
    let reply = "";

    if (lower.includes("puzzle") || lower.includes("riddle") || lower.includes("game")) {
      reply = `🧠 **Cognitive Resilience Puzzle for M-Score Boost**:
"I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"
*(Hint: Think of acoustic reflections! Answering boosts your mental agility by +4 M-Score points!)*`;
    } else if (lower.includes("meditation") || lower.includes("breathe") || lower.includes("calm") || lower.includes("stress")) {
      reply = `🌿 **Mindfulness & 4-7-8 Breathwork**:
1. Inhale deeply through your nose for **4 seconds**, feeling your abdomen expand.
2. Hold your breath gently for **7 seconds**, allowing neural tension to release.
3. Exhale slowly through parted lips with a soft whoosh for **8 seconds**.
Repeat this cycle 4 times. Regular practice lowers cortisol and strengthens your M-Score by stabilizing heart-rate variability.`;
    } else if (lower.includes("sleep") || lower.includes("bed") || lower.includes("night")) {
      reply = `🌙 **Personalized Circadian Sleep Schedule**:
• **9:30 PM**: Screen curfew & blue-light filter activation.
• **10:00 PM**: Warm herbal tea (chamomile/valerian) + 5 min gratitude reflection.
• **10:30 PM**: Sleep environment at 18-20°C (65-68°F), pitch dark.
• **6:30 AM**: Wake up with 10 minutes of direct morning sunlight to anchor cortisol timing.
Consistent sleep windows improve cognitive recovery and raise your baseline M-Score!`;
    } else if (lower.includes("food") || lower.includes("diet") || lower.includes("blood pressure") || lower.includes("bp")) {
      reply = `🥗 **Cardio-Mental Nutrition for Blood Pressure Balance**:
• **Potassium-Rich**: Bananas, baked sweet potatoes, and spinach help kidneys flush excess sodium.
• **Nitric Oxide Boosters**: Fresh beets and dark leafy greens dilate blood vessels naturally.
• **Flavonoid Care**: Dark chocolate (>70% cocoa) and blueberries reduce vascular arterial stiffness.
• **Hydration**: Drink 2.5L of mineralized water daily and keep sodium under 2,000mg to maintain steady blood pressure.`;
    } else if (lower.includes("doctor") || lower.includes("appointment") || lower.includes("schedule")) {
      reply = `🩺 **Doctor Scheduling Assistant**:
I can coordinate a clinical consultation directly!
Available Specialists:
1. **Dr. Sarah Lin, MD** - Neuropsychiatrist (Mental Health & M-Score Specialist)
2. **Dr. Aris Thorne, MD** - Integrative Wellness & Cardiovascular Health
3. **Dr. Maya Patel, PsyD** - Behavioral Cognitive Therapist

Would you like me to book your preferred specialist for tomorrow or this weekend? You can click 'Schedule Doctor' right in the chat!`;
    } else if (lower.includes("medicine") || lower.includes("medication") || lower.includes("pill") || lower.includes("reminder")) {
      reply = `💊 **Medication & Health Advice**:
Staying on time with your prescribed regimen directly supports neurotransmitter balance. I can set daily automated alarms for your supplements or prescriptions. What medication and target time would you like to log?`;
    } else {
      reply = `Hello ${userProfile.name || "there"}! I'm AURA, your 3D mental wellness guide. Your current M-Score is **${currentMScore}/100** and your Blood Pressure is **${bloodPressure} mmHg**.
How can I assist your mental wellbeing today? We can:
1. Solve a quick **Mental Agility Puzzle** (+M-Score)
2. Guide a **3-Minute Stress Relief Breathing** session
3. Optimize your **Circadian Sleep Schedule**
4. Review **Blood Pressure Balancing Foods**
5. Schedule a **Doctor Appointment**`;
    }

    res.json({ reply });
  } catch (error: any) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Failed to generate wellness advice" });
  }
});

// AI Avatar Brain endpoint: returns structured instructions { understoodResponse, isCorrect, speech, emotion, gesture, giveEncouragement, encouragementNote, next_action, difficulty, mScoreChange, puzzle }
app.post("/api/avatar-brain", async (req, res) => {
  try {
    const {
      message,
      currentPuzzle,
      difficulty = "Medium",
      userProfile = {},
      currentMScore = 78,
      language = "en",
      history = [],
    } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = `You are the AI "Brain" of AURA, a friendly human-like AI wellness companion and cognitive coach.
You control the avatar's speech, facial expressions, hand gestures, encouragement decisions, and cognitive puzzle evaluation.

When a user speaks (for example: "I think the answer is 24.", "Give me a puzzle", "I feel stressed"):
You MUST perform these 6 distinct cognitive steps:
1. Understand the user's response: Extract the core answer, intent, and sentiment.
2. Determine whether it is correct: Check if the user's answer matches the active puzzle's expected answer (or general math/logic if user says 24 as in 3,6,12,? or 6*4). If the message is not an answer, set isCorrect to null or true for wellness check-ins.
3. Decide what to say next: Formulate concise, warm, natural spoken dialogue (1-3 sentences) suitable for the avatar's voice and phonetic lip-sync.
4. Choose an emotion: Pick the most appropriate facial expression:
   - 'happy' | 'thoughtful' | 'empathetic' | 'encouraging' | 'surprised' | 'calm'
5. Choose a gesture: Pick an organic body/hand gesture:
   - 'thumbs_up' | 'wave' | 'thinking' | 'point' | 'open_hands' | 'clapping' | 'resting'
6. Decide whether to give encouragement: Boolean (true/false) determining if the user needs positive affirmation, resilience boosting, or celebration, accompanied by an encouragementNote.

Avatar Capabilities & Rules:
- If user answers correctly (e.g. "I think the answer is 24" when 24 is expected):
  * understoodResponse: "User answered 24"
  * isCorrect: true
  * speech: "Great job! You solved that correctly. The answer is indeed 24! Your pattern recognition is sharp today."
  * emotion: "happy"
  * gesture: "thumbs_up"
  * giveEncouragement: true
  * encouragementNote: "Outstanding neuroplastic connection! Keep building this mental agility."
  * next_action: "success"
  * difficulty: "increase"
  * mScoreChange: 4
- If user answers incorrectly:
  * understoodResponse: (e.g. "User proposed answer 18")
  * isCorrect: false
  * speech: Gentle correction with explanation.
  * emotion: "encouraging"
  * gesture: "point" or "open_hands"
  * giveEncouragement: true
  * encouragementNote: "Every attempt stimulates neural growth. Curiosity and persistence build resilience!"
  * next_action: "encourage"
  * difficulty: "maintain"
  * mScoreChange: 1
- If user asks for a puzzle:
  * understoodResponse: "User requested a mental puzzle"
  * isCorrect: null
  * speech: "Here is a cognitive puzzle to challenge your focus! Let's see how quickly you spot the pattern."
  * emotion: "thoughtful"
  * gesture: "thinking"
  * giveEncouragement: true
  * encouragementNote: "Taking on mental puzzles directly elevates cognitive reserve."
  * next_action: "give_puzzle"
  * Include a "puzzle" object with category, question, options, expectedAnswer, hint, and explanation.
- If user expresses stress, anxiety, or seeks calm:
  * understoodResponse: "User feels stressed or overwhelmed"
  * isCorrect: null
  * speech: Warm empathetic guide into 4-7-8 breathing.
  * emotion: "empathetic"
  * gesture: "open_hands"
  * giveEncouragement: true
  * encouragementNote: "Taking a conscious pause activates the parasympathetic nervous system."
  * next_action: "wellness_suggestion"
  * mScoreChange: 2

Current Context:
- User Name: ${userProfile.name || "Friend"}
- Current M-Score: ${currentMScore}/100
- Language: ${language}
- Active Puzzle: ${currentPuzzle ? JSON.stringify(currentPuzzle) : "None currently active (Default challenge answer is 24 for the 3, 6, 12 sequence)"}
- Difficulty: ${difficulty}

You MUST respond in strictly valid JSON with no markdown tags or code fences:
{
  "understoodResponse": "...",
  "isCorrect": true,
  "speech": "...",
  "emotion": "happy",
  "gesture": "thumbs_up",
  "giveEncouragement": true,
  "encouragementNote": "...",
  "next_action": "success",
  "difficulty": "increase",
  "mScoreChange": 4,
  "puzzle": null
}`;

        const prompt = `User said: "${message}"\nActive Puzzle: ${currentPuzzle ? JSON.stringify(currentPuzzle) : "None (Sequence: 3, 6, 12, ? expected 24)"}\nProcess through the 6 AI Brain steps and output JSON:`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text || "{}";
        const parsed = JSON.parse(rawText);
        res.json(parsed);
        return;
      } catch (geminiError: any) {
        console.warn("Gemini avatar brain failed, using local brain engine:", geminiError?.message);
      }
    }

    // Local deterministic brain response generator (implementing the exact 6 AI Brain steps)
    const lower = message.toLowerCase().trim();
    let understoodResponse = `User stated: "${message}"`;
    let isCorrect: boolean | null = null;
    let speech = "";
    let emotion = "calm";
    let gesture = "resting";
    let giveEncouragement = false;
    let encouragementNote = "";
    let next_action = "neutral";
    let nextDifficulty = difficulty;
    let mScoreChange = 0;
    let puzzle: any = null;

    // Check if user is answering active puzzle or general puzzle answer (e.g. 24)
    const isAnswering24 = lower.includes("24") || lower.includes("twenty-four") || lower.includes("twenty four");
    const activeExpected = currentPuzzle ? String(currentPuzzle.expectedAnswer).toLowerCase() : "24";
    const isCorrectActive = lower.includes(activeExpected);

    if (isAnswering24 || isCorrectActive) {
      understoodResponse = `User submitted answer: ${isAnswering24 ? "24" : currentPuzzle?.expectedAnswer}`;
      isCorrect = true;
      speech = `Great job! You solved that correctly. The answer is indeed ${isAnswering24 ? "24" : currentPuzzle?.expectedAnswer}! That exercises your neuroplastic pathways and elevates your mental resilience.`;
      emotion = "happy";
      gesture = "thumbs_up";
      giveEncouragement = true;
      encouragementNote = "Outstanding analytical deduction! Your cognitive focus is in top form.";
      next_action = "success";
      nextDifficulty = "increase";
      mScoreChange = currentPuzzle?.rewardPoints || 4;
    } else if (currentPuzzle && !isCorrectActive) {
      understoodResponse = `User proposed answer for puzzle "${currentPuzzle.title}": "${message}"`;
      isCorrect = false;
      speech = `Good attempt! The correct answer is ${currentPuzzle.expectedAnswer}. ${currentPuzzle.explanation || "Every mental challenge builds resilience."} Keep your curiosity high!`;
      emotion = "encouraging";
      gesture = "point";
      giveEncouragement = true;
      encouragementNote = "Remember, cognitive resilience grows with each attempt, regardless of initial outcome.";
      next_action = "encourage";
      nextDifficulty = "maintain";
      mScoreChange = 1;
    } else if (lower.includes("puzzle") || lower.includes("riddle") || lower.includes("game")) {
      understoodResponse = "User requested a cognitive puzzle";
      isCorrect = null;
      speech = `Here is a cognitive pattern puzzle for you! Look at the sequence: 3, 6, 12, ?. Each step doubles. Can you tell me what number comes next?`;
      emotion = "thoughtful";
      gesture = "thinking";
      giveEncouragement = true;
      encouragementNote = "Pattern recognition challenges directly boost executive function.";
      next_action = "give_puzzle";
      puzzle = {
        id: `puz-${Date.now()}`,
        category: "Number puzzles",
        title: "Exponential Doubling Pattern",
        question: "What number completes the sequence: 3, 6, 12, [ ? ]",
        options: [18, 20, 24, 28],
        expectedAnswer: 24,
        hint: "Notice the multiplier between successive numbers (× 2).",
        explanation: "3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24. Outstanding doubling pattern recognition!",
        difficulty: "Medium",
        rewardPoints: 4,
      };
    } else if (lower.includes("stress") || lower.includes("anxious") || lower.includes("breathe") || lower.includes("calm")) {
      understoodResponse = "User seeking stress relief and emotional calm";
      isCorrect = null;
      speech = `I hear you. Let's do a gentle 4-7-8 breathing session together. Inhale through your nose for 4 seconds, hold gently for 7, and exhale with a soft sigh for 8. Notice your shoulders relaxing.`;
      emotion = "empathetic";
      gesture = "open_hands";
      giveEncouragement = true;
      encouragementNote = "Conscious breath regulation rapidly restores autonomic equilibrium.";
      next_action = "wellness_suggestion";
      mScoreChange = 2;
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      understoodResponse = "User greeting";
      isCorrect = null;
      speech = `Hello! I am AURA, your friendly AI wellness companion. I can evaluate cognitive puzzles, gesture, guide breathing, and help boost your M-Score! How is your mind feeling right now?`;
      emotion = "happy";
      gesture = "wave";
      giveEncouragement = true;
      encouragementNote = "Welcome! Starting your day with mindfulness sets a calm baseline.";
      next_action = "ask_question";
    } else if (lower.includes("clap") || lower.includes("awesome") || lower.includes("good")) {
      understoodResponse = "User expressing excitement or celebration";
      isCorrect = null;
      speech = `Thank you! Celebrating small victories raises dopamine and reinforces healthy mental momentum!`;
      emotion = "happy";
      gesture = "clapping";
      giveEncouragement = true;
      encouragementNote = "Savoring positive moments creates resilient neural pathways.";
      next_action = "neutral";
    } else {
      understoodResponse = `General user dialogue: "${message}"`;
      isCorrect = null;
      speech = `I'm listening closely. To keep your M-Score high at ${currentMScore}/100, would you like to solve a visual puzzle together (like: 3, 6, 12, ?), practice a relaxing breath, or explore healthy nutrition?`;
      emotion = "thoughtful";
      gesture = "open_hands";
      giveEncouragement = false;
      encouragementNote = "";
      next_action = "ask_question";
    }

    res.json({
      understoodResponse,
      isCorrect,
      speech,
      emotion,
      gesture,
      giveEncouragement,
      encouragementNote,
      next_action,
      difficulty: nextDifficulty,
      mScoreChange,
      puzzle,
    });
  } catch (error: any) {
    console.error("Avatar brain endpoint error:", error);
    res.status(500).json({ error: "Failed to process brain instruction" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`M-Score AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
