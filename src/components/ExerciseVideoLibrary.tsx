/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Play, ShieldAlert, Sparkles, Video, CheckCircle2, RotateCcw, AlertTriangle, Cpu } from "lucide-react";

interface ExerciseGuide {
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  tips: string;
  videoUrl: string;
  commonMistakes: string[];
}

const PRESET_GUIDES: ExerciseGuide[] = [
  {
    name: "Barbell Back Squat",
    category: "Lower Body",
    difficulty: "Intermediate",
    instructions: [
      "Set the barbell at upper-chest height, step under and rest it across your upper traps.",
      "Unrack, take two steps back, and set feet slightly wider than shoulder-width apart, toes flared.",
      "Initiate by bending at the hips and knees simultaneously, keeping chest tall.",
      "Descend until thighs are parallel to the floor or lower.",
      "Drive through mid-foot back to the starting position."
    ],
    tips: "Ensure knees trace in direction of toes. Do not allow them to cave inward (valgus collapse).",
    videoUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop",
    commonMistakes: ["Knees caving inwards", "Heels lifting off the ground", "Butt wink (posterior pelvic tilt)"]
  },
  {
    name: "Conventional Deadlift",
    category: "Posterior Chain",
    difficulty: "Intermediate",
    instructions: [
      "Stand with mid-foot under the bar, feet about hip-width apart.",
      "Bend at the hips to grip the bar with a flat back, shoulders slightly ahead of the bar.",
      "Squeeze your armpits shut to engage your lats and pull the slack out of the bar.",
      "Drive the floor away with your legs, keeping the bar touching your shins.",
      "Lock out hips completely at the top without hyperextending your spine."
    ],
    tips: "Maintain a neutral spine throughout. Pull the weight, do not jerk it off the ground.",
    videoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    commonMistakes: ["Rounded lower back", "Bar path looping around knees", "Hyperextending spine at lockout"]
  },
  {
    name: "Overhead Press",
    category: "Shoulders",
    difficulty: "Intermediate",
    instructions: [
      "Rack bar at upper clavicle. Grip slightly wider than shoulder-width, elbows forward.",
      "Brace core, squeeze glutes, and tuck chin back to clear bar path.",
      "Press bar straight overhead. Push head back forward through the window at the top.",
      "Shrug shoulders upward at full lockout to protect rotator cuffs."
    ],
    tips: "Keep glutes and quadriceps fully tight to prevent backwards leaning.",
    videoUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop",
    commonMistakes: ["Over-arching the lumbar spine", "Flared elbows during press", "Incomplete range of motion at lockout"]
  }
];

export default function ExerciseVideoLibrary() {
  const [selectedEx, setSelectedEx] = useState<ExerciseGuide>(PRESET_GUIDES[0]);
  const [analyzingFile, setAnalyzingFile] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    depth: string;
    backAngle: string;
    barSpeed: string;
    mistakesDetected: string[];
    recommendations: string[];
  } | null>(null);

  const startAIFormAnalysis = () => {
    setAnalyzingFile(true);
    setAnalysisResult(null);
    setTimeout(() => {
      // Simulate real-time posture analysis metrics
      if (selectedEx.name === "Barbell Back Squat") {
        setAnalysisResult({
          score: 88,
          depth: "Below Parallel (Good depth: 104° knee angle)",
          backAngle: "34° forward lean at bottom (Safe spinal threshold)",
          barSpeed: "Eccentic: 0.45m/s (Controlled) • Concentric: 0.62m/s",
          mistakesDetected: [
            "Minor valgus knee tremor detected at transition point (mid-concentric phase)."
          ],
          recommendations: [
            "Actively drive your knees outward against imaginary bands on the concentric climb.",
            "Incorporate light goblet squats tracking knee tracking as a warm-up sequence."
          ]
        });
      } else if (selectedEx.name === "Conventional Deadlift") {
        setAnalysisResult({
          score: 94,
          depth: "Valid floor starting point",
          backAngle: "Flat lumbar spine locked (Safe 0.5° lumbar deviation)",
          barSpeed: "Ascent acceleration: 0.75m/s (Excellent explosive drive)",
          mistakesDetected: [],
          recommendations: [
            "Bar path is perfectly vertical. Solid execution! Increase load by 2.5% for next set."
          ]
        });
      } else {
        setAnalysisResult({
          score: 74,
          depth: "Full vertical alignment achieved at crest",
          backAngle: "Excessive lumbar extension (12° curvature at lockout)",
          barSpeed: "Slow lockout: deceleration observed over last 15cm",
          mistakesDetected: [
            "Spinel lumbar hyperextension at final push.",
            "Elbows flared too early."
          ],
          recommendations: [
            "Focus on squeezing your write glutes and bracing transverse abdominals during lockout.",
            "Drop the weight by 10% to master core neutral alignment before heavy loads."
          ]
        });
      }
      setAnalyzingFile(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-zinc-950/20 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
      
      {/* Exercise Catalogue List */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-2">
          <Video className="w-4 h-4 text-emerald-500" /> Video Library
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Select a standard gym movement to view step-by-step cueing or trigger our video feedback AI.
        </p>
        <div className="flex flex-col gap-2 mt-2">
          {PRESET_GUIDES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => {
                setSelectedEx(ex);
                setAnalysisResult(null);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                selectedEx.name === ex.name
                  ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900/40 dark:border-zinc-800 dark:hover:bg-zinc-800/80"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-sm text-gray-800 dark:text-zinc-200">
                  {ex.name}
                </span>
                <span className={`text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded ${
                  ex.difficulty === "Beginner" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600" :
                  ex.difficulty === "Intermediate" ? "bg-amber-100 dark:bg-amber-950 text-amber-600" :
                  "bg-rose-100 dark:bg-rose-950 text-rose-600"
                }`}>
                  {ex.difficulty}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-zinc-400">{ex.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guide details & AI Form Scanning Sandbox */}
      <div className="lg:col-span-8 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-zinc-800 lg:pl-6 pt-5 lg:pt-0">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-gray-100 dark:border-neutral-800 bg-black">
          <img
            src={selectedEx.videoUrl}
            alt={selectedEx.name}
            className="w-full h-full object-cover opacity-60 filter blur-[0.5px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
            <span className="text-xs uppercase font-semibold text-emerald-400 tracking-widest">
              Instructional Standard Guide
            </span>
            <h4 className="text-xl font-bold text-white mt-1">{selectedEx.name}</h4>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition duration-200 shadow-emerald-500/20 shadow-lg">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </button>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-sm text-gray-800 dark:text-zinc-200 uppercase tracking-wide">
            Execution Steps
          </h5>
          <ol className="list-decimal list-inside text-xs text-gray-600 dark:text-zinc-400 mt-2 space-y-1.5 leading-relaxed">
            {selectedEx.instructions.map((inst, idx) => (
              <li key={idx} className="marker:text-emerald-500 marker:font-bold pl-1">
                {inst}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-4 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400">
              Pro Technique Tip:
            </span>
            <p className="text-xs text-amber-700/90 dark:text-amber-400/80 leading-relaxed mt-0.5">
              {selectedEx.tips}
            </p>
          </div>
        </div>

        {/* AI Form Analysis Launcher section */}
        <div className="bg-zinc-900 text-zinc-100 p-5 rounded-2xl border border-zinc-800 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -right-5 -bottom-5 opacity-5 pointer-events-none">
            <Cpu className="w-40 h-40" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  AI Computer Vision Technique Analyzer
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Evaluate barbell alignment, joint vectors, and descent velocity.
                </p>
              </div>
            </div>
            <button
              onClick={startAIFormAnalysis}
              disabled={analyzingFile}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-xl text-xs flex items-center gap-2 transition duration-200"
            >
              {analyzingFile ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing Joint Map...
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5" /> Scan {selectedEx.name} Video
                </>
              )}
            </button>
          </div>

          {analysisResult && (
            <div className="border-t border-zinc-800 pt-4 flex flex-col gap-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-950 px-4 py-2.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-300">Technique Score:</span>
                  <span className={`text-sm font-black font-mono ${
                    analysisResult.score >= 90 ? "text-emerald-400" :
                    analysisResult.score >= 80 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {analysisResult.score}%
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Calibration: Active
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-zinc-400">
                <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                  <span className="text-zinc-600 block text-[10px] uppercase font-bold tracking-wider">Depth / Range</span>
                  <span className="text-zinc-200">{analysisResult.depth}</span>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                  <span className="text-zinc-600 block text-[10px] uppercase font-bold tracking-wider">Spinal Curvature</span>
                  <span className="text-zinc-200">{analysisResult.backAngle}</span>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                  <span className="text-zinc-600 block text-[10px] uppercase font-bold tracking-wider">Velocity Curve</span>
                  <span className="text-zinc-200">{analysisResult.barSpeed}</span>
                </div>
              </div>

              {analysisResult.mistakesDetected.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 text-xs text-rose-300/90 flex flex-col gap-1.5">
                  <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Movement Deviation Warnings:
                  </span>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {analysisResult.mistakesDetected.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-emerald-300/90 flex flex-col gap-1.5">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Custom Neural Corrections:
                </span>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="text-[10px] font-semibold text-zinc-500 hover:text-emerald-400 flex items-center justify-center gap-1 mx-auto"
                >
                  <RotateCcw className="w-3 h-3" /> Clear Scan Logs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
