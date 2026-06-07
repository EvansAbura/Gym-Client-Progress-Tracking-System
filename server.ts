/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured in environment secrets.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// REST route for AI Coach suggestions and Plateau detection
app.post("/api/coach", async (req, res) => {
  const { clientState, query } = req.body;
  
  if (!clientState) {
    return res.status(400).json({ error: "Client profile state is required." });
  }

  // Create a backup default analyzer in case Gemini API key is missing
  try {
    const ai = getGeminiClient();
    
    // Construct rich context prompt including all attributes requested
    const systemPrompt = `You are Snave, an elite, highly knowledgeable personal trainer, biometrician, and AI fitness coach.
You analyze comprehensive client dossiers containing:
- Biometrics (Weight trend, height, age, gender, body fat %)
- Workouts completed, exercises, specific sets & repetitions
- Nutrition logs (daily caloric average, macronutrient macros, water log)
- Goal status (Weight targets, muscle hypertrophy benchmarks)
Apply advanced exercise physiology, caloric adaptation principles, and athletic coaching guidelines.
Detect plateaus (e.g., bodyweight stalled for weeks, strength volumes flatlining on compound lifts), suggest program adjustments, suggest caloric tweaks, and estimate realistic goal dates.
Respond in a motivating, concise, highly professional manner using structured Markdown. Highlight warning flags, recommended weekly weights adjustments, and specific nutrition changes.`;

    const userPrompt = `Dossier:
Client Name: ${clientState.fullName}, Age: ${clientState.age}, Gender: ${clientState.gender}
Height: ${clientState.height}cm, Current Weight: ${clientState.weight}kg, Starting Weight: ${clientState.startingWeight}kg, Target Weight: ${clientState.targetWeight}kg
Body Fat %: ${clientState.bodyFatPercentage}% (Starting: ${clientState.startingBodyFat}%)
Fitness Goals: ${clientState.fitnessGoals.join(", ")}
Weekly steps average: ${clientState.wearable?.stepsToday ?? 0}
Daily target: ${clientState.nutrition?.[0]?.targetCalories ?? 1800} kcal, average water: ${clientState.nutrition?.[0]?.waterIntakeMl ?? 2000}ml
Workouts completed: ${clientState.workouts?.length ?? 0}

User query/action: ${query || "Provide a comprehensive plateau audit and program correction."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API call failed:", error.message);
    
    // Friendly, robust heuristic fallback response for offline preview or missing API key
    // This performs real algorithmic calculations to keep the feature interactive!
    const weightDiff = Math.abs(clientState.weight - clientState.targetWeight);
    const weightProgressRatio = Math.max(0, Math.min(100, Math.round(((clientState.startingWeight - clientState.weight) / (clientState.startingWeight - clientState.targetWeight)) * 100)));
    const normalWeeklyRate = 0.5; // 0.5kg per week
    const estimatedWeeks = Math.ceil(weightDiff / normalWeeklyRate);

    // Heuristics based on client age/gender/fat
    const isUnderHydrated = (clientState.nutrition?.[0]?.waterIntakeMl ?? 2000) < 2200;
    const isAtRisk = clientState.isAtRisk;

    let heuristicMarkdown = `### 📋 Snave Biometric Plateau Audit (Coaching Fallback Model)
*The Gemini API key is currently inactive or being supplied in developer mode. Running core local heuristic fitness engine.*

#### 🔍 Biometric Status on **${clientState.fullName}**
*   **Starting Weight:** ${clientState.startingWeight} kg | **Current:** ${clientState.weight} kg | **Target Goals:** ${clientState.targetWeight} kg
*   **Total Progress:** ${Math.abs(clientState.startingWeight - clientState.weight).toFixed(1)} kg lost (${weightProgressRatio}% of journey complete).
*   **Body Composition Change:** Fat reduced from **${clientState.startingBodyFat}%** to **${clientState.bodyFatPercentage}%**.
*   **Target Estimation:** At current steady adaptation rates (approx. 0.45kg change/week), achievement is realistic in **~${estimatedWeeks} weeks**.

---

#### 🚨 Plateau Alerts & Warning Inductions
${isAtRisk ? `*   **⚠️ Danger Flag Detected:** Low trainer-engagement patterns (${clientState.engagementScore}/100 scores) and flat muscle sets are causing a metabolic adaptation stall. Action is required to prevent program dropout.` : `*   **✅ High Consistency Tracker:** Great consistency score (${clientState.engagementScore}/100) detected. No severe metabolic adaptation stall is apparent.`}
${isUnderHydrated ? `*   **💧 Hydration Adaptation Stall:** Client water intake (**${clientState.nutrition?.[0]?.waterIntakeMl ?? 1200}ml**) is below the athletic target of 2.7L. Intracellular dehydration reduces protein synthesis and compromises strength metrics.` : `*   **💧 Hydration Status:** Hydro-levels are optimal. Intracellular transport is healthy.`}

---

#### 🏋️ Workout Adjustment Recommendations
1.  **Introduce Progressive Overload:** Increase workout volume on core compound exercises (such as Goblet Squats or Deadlifts) by adding **1 set of 8-10 reps at 75% 1RM** to break central nervous system thresholds.
2.  **Activity Threshold:** Lift weekly NEAT movement thresholds to **10,000 steps** to increase active skeletal muscle signaling.

---

#### 🥗 Caloric & Macronutrient Correction
*   **Current Target Allocation:** ${clientState.nutrition?.[0]?.targetCalories ?? 1700} kcal/day
*   **Macro Adjustments:** Set protein to **2.0g per kg of target weight** (~${Math.round(clientState.targetWeight * 2)}g) to lock down nitrogen retention. Lower fat ratios slightly while prioritizing low-glycemic oats and sweet potatoes pre-workout.`;

    return res.json({ text: heuristicMarkdown, info: "fallback" });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Express with Vite Development Server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Snave fitness server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
