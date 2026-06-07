/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Client, DailyWorkout, DailyNutrition, Goal, BodyMeasurements } from "../types";
import BeforeAfterSlider from "./BeforeAfterSlider";
import AICoachPanel from "./AICoachPanel";
import ExerciseVideoLibrary from "./ExerciseVideoLibrary";
import { 
  ArrowLeft, Activity, Dumbbell, Apple, Target, ClipboardList, Camera, 
  ChevronRight, Sparkles, Scale, Percent, Flame, Footprints, Heart, Plus,
  CheckCircle, PlusCircle, Trash, RefreshCw, Layers, ShieldCheck, HelpCircle, Trophy
} from "lucide-react";

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onUpdateClient: (updatedClient: Client) => void;
}

export default function ClientDetail({ client, onBack, onUpdateClient }: ClientDetailProps) {
  const [activeTab, setActiveTab] = useState<"Overview" | "Metrics" | "Workouts" | "Nutrition" | "Goals" | "Technique" | "AI">("Overview");

  // Local states for quick logging
  const [quickWeight, setQuickWeight] = useState("");
  const [quickBodyFat, setQuickBodyFat] = useState("");
  const [quickWater, setQuickWater] = useState(0);

  // New Goal formulation states
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalType, setGoalType] = useState<Goal["type"]>("Weight Loss");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalUnit, setGoalUnit] = useState("kg");
  const [goalDate, setGoalDate] = useState("");

  // New Workout logging states
  const [showWorkoutLog, setShowWorkoutLog] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [setWeight1, setSetWeight1] = useState("");
  const [setReps1, setSetReps1] = useState("");

  // Quick logging of weight/body fat
  const handleQuickLogBiometrics = () => {
    if (!quickWeight && !quickBodyFat) return;
    
    const updated = { ...client };
    const dateStr = new Date().toISOString().split("T")[0];

    if (quickWeight) {
      const parsedWeight = parseFloat(quickWeight);
      updated.weight = parsedWeight;
      updated.weightHistory = [
        ...updated.weightHistory,
        { date: dateStr, value: parsedWeight }
      ];
      setQuickWeight("");
    }

    if (quickBodyFat) {
      const parsedBF = parseFloat(quickBodyFat);
      updated.bodyFatPercentage = parsedBF;
      updated.bodyFatHistory = [
        ...updated.bodyFatHistory,
        { date: dateStr, value: parsedBF }
      ];
      setQuickBodyFat("");
    }

    onUpdateClient(updated);
  };

  // Quick hydration log
  const handleAddWater = (amount: number) => {
    const updated = { ...client };
    const dateStr = new Date().toISOString().split("T")[0];
    
    let todayNutrition = updated.nutrition.find(n => n.date === dateStr);
    
    if (!todayNutrition) {
      // Create nutrition envelope if missing
      todayNutrition = {
        id: `nut-${Date.now()}`,
        date: dateStr,
        meals: [],
        waterIntakeMl: 0,
        targetCalories: 2000,
        targetProtein: 140,
        targetCarbs: 220,
        targetFats: 60
      };
      updated.nutrition = [todayNutrition, ...updated.nutrition];
    }

    todayNutrition.waterIntakeMl += amount;
    onUpdateClient(updated);
  };

  // Onboard new goal
  const handleCreateGoal = () => {
    if (!goalTitle || !goalTarget) return;

    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      title: goalTitle,
      type: goalType,
      targetValue: parseFloat(goalTarget),
      currentValue: goalType === "Weight Loss" ? client.weight : 0,
      unit: goalUnit,
      startDate: new Date().toISOString().split("T")[0],
      targetDate: goalDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "In Progress",
      milestones: []
    };

    const updated = { ...client };
    updated.goals = [...updated.goals, newGoal];
    onUpdateClient(updated);

    // reset state
    setGoalTitle("");
    setGoalTarget("");
    setGoalUnit("kg");
    setGoalDate("");
    setShowGoalModal(false);
  };

  // Add exercise reps
  const handleLogExercise = () => {
    if (!exerciseName || !setWeight1 || !setReps1) return;

    const dateStr = new Date().toISOString().split("T")[0];
    const updated = { ...client };

    let todayWorkout = updated.workouts.find(w => w.date === dateStr);
    if (!todayWorkout) {
      todayWorkout = {
        id: `work-${Date.now()}`,
        date: dateStr,
        name: "Custom Gym Session",
        completed: true,
        exercises: []
      };
      updated.workouts = [todayWorkout, ...updated.workouts];
    }

    todayWorkout.exercises.push({
      id: `ex-${Date.now()}`,
      name: exerciseName,
      category: "Strength",
      sets: [
        {
          id: `s-${Date.now()}-1`,
          weight: parseFloat(setWeight1),
          reps: parseInt(setReps1),
          completed: true
        }
      ]
    });

    onUpdateClient(updated);

    // Reset
    setExerciseName("");
    setSetWeight1("");
    setSetReps1("");
    setShowWorkoutLog(false);
  };

  // Bio-Composition math outputs
  const bmi = (client.weight / Math.pow(client.height / 100, 2)).toFixed(1);
  const startingBMI = (client.startingWeight / Math.pow(client.height / 100, 2)).toFixed(1);
  const startLeanMuscle = (client.startingWeight * (1 - client.startingBodyFat / 100)).toFixed(1);
  const latestLeanMuscle = (client.weight * (1 - client.bodyFatPercentage / 100)).toFixed(1);
  const leanMuscleDiff = (parseFloat(latestLeanMuscle) - parseFloat(startLeanMuscle)).toFixed(1);

  // SVG Chart points computation
  const renderCSVChart = (history: { date: string; value: number }[]) => {
    if (!history || history.length < 2) {
      return (
        <div className="flex h-40 items-center justify-center text-xs font-mono text-zinc-600">
          Not enough historical records to lineplot biometrics trends.
        </div>
      );
    }
    
    const width = 500;
    const height = 150;
    const padding = 20;

    const xRange = width - padding * 2;
    const yRange = height - padding * 2;

    const values = history.map(h => h.value);
    const minVal = Math.min(...values) * 0.98;
    const maxVal = Math.max(...values) * 1.02;
    const deltaY = maxVal - minVal || 1;

    const points = history.map((h, idx) => {
      const x = padding + (idx / (history.length - 1)) * xRange;
      const y = height - padding - ((h.value - minVal) / deltaY) * yRange;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
          </linearGradient>
        </defs>
        
        {/* Horizontal gridlines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
        <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#27272a" strokeWidth="1" strokeDasharray="4" />

        {/* Shaded Area */}
        <path
          d={`M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`}
          fill="url(#glowGrad)"
        />

        {/* Core Trendline */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3.5"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Circular vertex indicators */}
        {history.map((h, idx) => {
          const x = padding + (idx / (history.length - 1)) * xRange;
          const y = height - padding - ((h.value - minVal) / deltaY) * yRange;
          return (
            <g key={idx} className="group cursor-pointer">
              <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#09090b" strokeWidth="2" />
              <text x={x} y={y - 10} fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition duration-150 bg-zinc-950 px-1 py-0.5 rounded">
                {h.value}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Hero Header with back controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <img 
              src={client.profilePhoto} 
              alt={client.fullName} 
              className="w-14 h-14 rounded-2xl object-cover border border-zinc-700 shadow"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{client.fullName}</h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Elite Roster
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Joint metrics adaptation pipeline &bull; <span className="text-emerald-400 font-semibold">{client.contactInfo.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed tab control keys */}
        <div className="flex flex-wrap bg-zinc-950 p-1.5 rounded-2xl border border-zinc-850">
          {(["Overview", "Metrics", "Workouts", "Nutrition", "Goals", "Technique", "AI"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs font-semibold tracking-wider rounded-xl transition cursor-pointer uppercase ${
                activeTab === tab
                  ? "bg-emerald-500 text-zinc-950 font-bold"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/********* TAB 1: CARD OVERVIEW *********/}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main stats profile highlights */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* BMI widget */}
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest font-mono">Current BMI</span>
                  <h3 className="text-xl font-black text-white mt-1">{bmi}</h3>
                  <span className="text-[9.5px] text-zinc-500 font-mono block">Starting: {startingBMI}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-850 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              {/* Skeletal lean muscle mass change */}
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest font-mono">Lean Muscle</span>
                  <h3 className="text-xl font-black text-white mt-1">{latestLeanMuscle} kg</h3>
                  <span className={`text-[9.5px] font-mono font-bold ${parseFloat(leanMuscleDiff) >= 0 ? "text-emerald-400" : "text-rose-450"}`}>
                    {parseFloat(leanMuscleDiff) >= 0 ? `+${leanMuscleDiff}` : leanMuscleDiff} kg shift
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-850 flex items-center justify-center text-teal-400">
                  <Scale className="w-5 h-5" />
                </div>
              </div>

              {/* Steps recorded */}
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest font-mono">Steps Tracker</span>
                  <h3 className="text-xl font-black text-white mt-1">
                    {client.wearable?.stepsToday ? client.wearable.stepsToday.toLocaleString() : "4,200"}
                  </h3>
                  <span className="text-[9.5px] text-emerald-400 font-mono block">Synced via Wearable</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-850 flex items-center justify-center text-emerald-400">
                  <Footprints className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              {/* Calories burned */}
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest font-mono">Calorie Burn</span>
                  <h3 className="text-xl font-black text-white mt-1">
                    {client.wearable?.caloriesBurnedToday ? `${client.wearable.caloriesBurnedToday} kcal` : "1,900 kcal"}
                  </h3>
                  <span className="text-[9.5px] text-zinc-500 font-mono block">Dynamic active score</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-850 flex items-center justify-center text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Glowing biometric line chart */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold"><Scale className="w-4 h-4 text-emerald-400" /> Weight adaptation trajectory</span>
                <span>Active 12-week pools</span>
              </div>
              <div className="h-44 flex items-center">
                {renderCSVChart(client.weightHistory)}
              </div>
            </div>

            {/* Quick logs panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Manual weight checklist updates */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4.5 space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                  <PlusCircle className="w-4 h-4 text-emerald-400" strokeWidth="2.5" /> Log Daily Adaptation Weight
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="E.g. 62.4kg"
                    value={quickWeight}
                    onChange={(e) => setQuickWeight(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-white font-mono"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Fat %"
                    value={quickBodyFat}
                    onChange={(e) => setQuickBodyFat(e.target.value)}
                    className="w-18 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-white font-mono"
                  />
                  <button
                    onClick={handleQuickLogBiometrics}
                    className="px-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-lg text-xs tracking-wider uppercase transition"
                  >
                    Commit
                  </button>
                </div>
              </div>

              {/* Water Intake calculator logic */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4.5 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  💧 Hydration Water Counter
                </h4>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleAddWater(250)}
                    className="flex-1 py-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-zinc-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                  >
                    +250ml Glass
                  </button>
                  <button
                    onClick={() => handleAddWater(500)}
                    className="flex-1 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-zinc-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                  >
                    +500ml Bottle
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar Info Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Client Medical warning / Contacts profile ledger */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider pb-2 border-b border-zinc-800/60">
                Medical & Dossier Details
              </h4>
              
              <div className="space-y-3.5 text-xs">
                {/* Emergency elements */}
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-widest font-mono">Emergency Alert</span>
                  <span className="text-white font-semibold">
                    {client.emergencyContact.name} ({client.emergencyContact.relationship})
                  </span>
                  <span className="text-zinc-400 font-mono block mt-0.5">{client.emergencyContact.phone}</span>
                </div>

                {/* Medical Conditions */}
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-widest font-mono text-rose-400">Contraindications</span>
                  {client.medicalConditions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {client.medicalConditions.map((med, idx) => (
                        <span key={idx} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                          🚨 {med}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-400 italic block mt-1">No chronic limitations declared.</span>
                  )}
                </div>

                {/* Bio dimensions metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/40 text-[11px] font-mono">
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase tracking-wider">Height</span>
                    <span className="text-zinc-200">{client.height} cm</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase tracking-wider">Join Date</span>
                    <span className="text-zinc-200">{client.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart plateau detection banner card */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full filter blur-xl" />
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                <Sparkles className="w-4 h-4 animate-pulse" /> Metabolic forecast
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Adaptive plateau detectors forecast goal completion on 
                <strong className="text-white font-bold"> &bull; {new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</strong> if nutrition compliance remains above 85%.
              </p>
              <button
                onClick={() => setActiveTab("AI")}
                className="py-2.5 bg-emerald-500 text-zinc-950 font-bold rounded-2xl text-[10px] uppercase font-mono tracking-wider shadow-md hover:bg-emerald-600 transition"
              >
                Inspect AI Plateau Audit
              </button>
            </div>

          </div>
        </div>
      )}

      {/********* TAB 2: BIOMETRIC MEASUREMENTS COMPARISON *********/}
      {activeTab === "Metrics" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" /> Complete Body Measurements Ledger
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Track multi-point physical measurements compared to original benchmarks, calculating absolute delta variances.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs text-zinc-300">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest">
                    <th className="pb-3 animate-pulse">Anatomical Region</th>
                    <th className="pb-3 text-right">Initial ({client.joinDate})</th>
                    <th className="pb-3 text-right">Latest (Current)</th>
                    <th className="pb-3 text-right">Absolute Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {(() => {
                    const latestMeas = client.measurements[client.measurements.length - 1];
                    const initialMeas = client.measurements[0];

                    if (!latestMeas || !initialMeas) {
                      return (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-zinc-650 italic">
                            No body scale templates registered yet.
                          </td>
                        </tr>
                      );
                    }

                    const regionsToRender = [
                      { label: "Chest (cm)", key: "chest" },
                      { label: "Waist (cm)", key: "waist" },
                      { label: "Hips (cm)", key: "hips" },
                      { label: "Neck (cm)", key: "neck" },
                      { label: "Shoulders (cm)", key: "shoulders" },
                      { label: "Left Bicep (cm)", key: "bicepLeft" },
                      { label: "Right Bicep (cm)", key: "bicepRight" },
                      { label: "Left Thigh (cm)", key: "thighLeft" },
                      { label: "Right Thigh (cm)", key: "thighRight" },
                      { label: "Left Calf (cm)", key: "calfLeft" },
                      { label: "Right Calf (cm)", key: "calfRight" }
                    ];

                    return regionsToRender.map((r) => {
                      const initialVal = (initialMeas as any)[r.key] || 0;
                      const latestVal = (latestMeas as any)[r.key] || 0;
                      const diff = latestVal - initialVal;
                      const percentage = initialVal > 0 ? ((diff / initialVal) * 100).toFixed(1) : "0.0";

                      return (
                        <tr key={r.key} className="hover:bg-zinc-950/40 transition">
                          <td className="py-3 font-semibold text-zinc-200">{r.label}</td>
                          <td className="py-3 text-right text-zinc-400">{initialVal}</td>
                          <td className="py-3 text-right text-white font-bold">{latestVal}</td>
                          <td className={`py-3 text-right font-black ${
                            diff < 0 ? "text-emerald-400" : diff > 0 ? "text-amber-500" : "text-zinc-500"
                          }`}>
                            {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} ({percentage}%)
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Visual Photos gallery comparing before vs after */}
            <div className="lg:col-span-4 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 justify-between">
                <span>Transformation Comparison Photos</span>
                <span className="text-[10px] font-mono text-emerald-400">Front Profile</span>
              </h4>

              {client.photos.length >= 2 ? (
                <BeforeAfterSlider
                  beforeImage={client.photos[0].front}
                  afterImage={client.photos[client.photos.length - 1].front}
                  beforeDate={client.photos[0].date}
                  afterDate={client.photos[client.photos.length - 1].date}
                />
              ) : (
                <div className="border border-zinc-800 border-dashed rounded-2xl p-8 text-center text-zinc-600 bg-zinc-950/30 flex flex-col items-center gap-2">
                  <Camera className="w-8 h-8 text-zinc-700 animate-pulse" />
                  <span className="text-xs">At least 2 photo chronological entries required to activate the comparison slider.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/********* TAB 3: WORKOUT LOGS & TRAINING SETS *********/}
      {activeTab === "Workouts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-805">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Dumbbell className="w-5 h-5 text-emerald-400" /> Active Workout Logs & Sets
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Analyze strength volumes, completed rep profiles, and target warm-ups.
                </p>
              </div>

              <button
                onClick={() => setShowWorkoutLog(!showWorkoutLog)}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5 font-black" /> Log Exercise Sets
              </button>
            </div>

            {/* Quick entry for Sets logs */}
            {showWorkoutLog && (
              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row gap-3 items-end transition-all animate-fade-in text-white">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Exercise Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Barbell Deadlift"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs placeholder-zinc-650"
                  />
                </div>
                <div className="w-24 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={setWeight1}
                    onChange={(e) => setSetWeight1(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs placeholder-zinc-600"
                  />
                </div>
                <div className="w-20 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Reps</label>
                  <input
                    type="number"
                    placeholder="8"
                    value={setReps1}
                    onChange={(e) => setSetReps1(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs placeholder-zinc-600"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogExercise}
                    className="px-4 py-2 bg-emerald-500 text-zinc-950 font-bold rounded-xl text-xs uppercase"
                  >
                    Log
                  </button>
                  <button
                    onClick={() => setShowWorkoutLog(false)}
                    className="px-3.5 py-2 border border-zinc-800 rounded-xl text-xs hover:bg-zinc-900 text-zinc-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Exercises Lists */}
            <div className="flex flex-col gap-4">
              {client.workouts.map((work) => (
                <div key={work.id} className="bg-zinc-950/40 border border-zinc-850 p-4.5 rounded-2xl flex flex-col gap-3.5">
                  <div className="flex justify-between items-center text-xs font-mono pb-2 border-b border-zinc-900">
                    <span className="font-bold text-zinc-200">{work.name}</span>
                    <span className="text-zinc-550 italic">{work.date}</span>
                  </div>

                  <div className="divide-y divide-zinc-900">
                    {work.exercises.map((ex) => (
                      <div key={ex.id} className="py-3 flex justify-between gap-4 items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">{ex.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono italic">{ex.category}</span>
                        </div>

                        {/* Sets array representations */}
                        <div className="flex flex-wrap gap-1.5">
                          {ex.sets.map((s, sIdx) => (
                            <span 
                              key={s.id} 
                              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10.5px] font-mono text-zinc-300 hover:border-emerald-500 transition cursor-pointer"
                              title="Completed training set"
                            >
                              S{sIdx+1}: <strong className="text-white font-bold">{s.weight}kg</strong> &times; {s.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {client.workouts.length === 0 && (
                <div className="bg-zinc-950/20 border border-zinc-800 border-dashed rounded-2xl p-8 text-center text-zinc-650 italic">
                  No active workouts logged inside client chronicle database.
                </div>
              )}
            </div>
          </div>

          {/* Quick lists of Personal Records (PRs) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 pb-2 border-b border-zinc-800/60">
                <Trophy className="w-4 h-4 text-emerald-400" /> Active Personal Records (PRs)
              </h3>

              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-900 rounded-xl font-mono text-xs text-zinc-400">
                  <span className="text-zinc-200 font-semibold">Goblet Squats</span>
                  <span className="text-emerald-400 font-bold text-sm">24.0 kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-900 rounded-xl font-mono text-xs text-zinc-400">
                  <span className="text-zinc-200 font-semibold">Romanian Deadlift</span>
                  <span className="text-emerald-400 font-bold text-sm">50.0 kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-900 rounded-xl font-mono text-xs text-zinc-400">
                  <span className="text-zinc-200 font-semibold">Dumbbell Shoulder Press</span>
                  <span className="text-emerald-400 font-bold text-sm">14.0 kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/********* TAB 4: NUTRITION LOGS & CALORIES *********/}
      {activeTab === "Nutrition" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-805">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Apple className="w-5 h-5 text-emerald-400" /> Macronutrient Logs & Calories Matrix
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Monitor target values against intake logs. Hydration totals update automatically in key databases.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-zinc-400">
              <span className="text-zinc-650">Compliance Target:</span>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black">94% Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Calories Breakdown charts */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {client.nutrition.map((nut) => {
                const totalCal = nut.meals.reduce((t, m) => t + m.calories, 0);
                const totalProtein = nut.meals.reduce((t, m) => t + m.protein, 0);
                const totalCarbs = nut.meals.reduce((t, m) => t + m.carbs, 0);
                const totalFats = nut.meals.reduce((t, m) => t + m.fats, 0);

                return (
                  <div key={nut.id} className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-4.5 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs font-mono pb-2.5 border-b border-zinc-900">
                      <span className="font-bold text-zinc-300">Intake Ledger: {nut.date}</span>
                      <span className="text-teal-400 font-semibold">{nut.waterIntakeMl}ml Water Synced</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 font-mono">
                        <span className="text-[8.5px] uppercase font-bold text-zinc-600 block">Calories</span>
                        <span className="text-white text-sm font-black">{totalCal} / {nut.targetCalories}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">kcal energy</span>
                      </div>
                      <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 font-mono">
                        <span className="text-[8.5px] uppercase font-bold text-zinc-600 block">Protein</span>
                        <span className="text-white text-sm font-black">{totalProtein}g / {nut.targetProtein}g</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">amino profile</span>
                      </div>
                      <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 font-mono">
                        <span className="text-[8.5px] uppercase font-bold text-zinc-600 block">Carbohydrates</span>
                        <span className="text-white text-sm font-black">{totalCarbs}g / {nut.targetCarbs}g</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">glycogen pools</span>
                      </div>
                      <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 font-mono">
                        <span className="text-[8.5px] uppercase font-bold text-zinc-600 block">Fats</span>
                        <span className="text-white text-sm font-black">{totalFats}g / {nut.targetFats}g</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">lipid reserves</span>
                      </div>
                    </div>

                    {/* Meal items */}
                    <div className="space-y-2 mt-2">
                      <span className="text-[9.5px] uppercase font-mono tracking-wider font-bold text-zinc-500 block">Meal journals</span>
                      {nut.meals.map((m) => (
                        <div key={m.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-900/70 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-zinc-200 block">{m.name}</span>
                            <span className="text-[10px] text-zinc-600 font-mono">{m.time} &bull; Protein {m.protein}g</span>
                          </div>
                          <span className="font-mono font-bold text-white uppercase">{m.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nutrition Advice sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-300 flex items-center gap-1.5 pb-2 border-b border-zinc-800/60">
                  <Apple className="w-4 h-4 text-emerald-400" /> Dynamic coaching advisory
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  The biometric metabolic profile indicates dynamic thermogenesis adaptivity is stable. Lower carbohydrates ratios slightly on non-training (resting) protocol windows.
                </p>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-[10px] text-zinc-500">
                  Daily Hydration Goal: <strong className="text-emerald-400">2.7L Base</strong> &bull; Squeeze fresh lemons for intracellular electrolyte minerals.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/********* TAB 5: ADVANCED GOALS & MILESTONES *********/}
      {activeTab === "Goals" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-805">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-5 h-5 text-emerald-400" /> Active Client Milestone Goals
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Add target milestones or configure predictions dates utilizing neural fitness models.
              </p>
            </div>

            <button
              onClick={() => setShowGoalModal(!showGoalModal)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5 font-bold" /> Formulate Goal
            </button>
          </div>

          {showGoalModal && (
            <div className="bg-zinc-950 border border-zinc-805 p-5 rounded-2xl flex flex-col gap-4.5 text-zinc-300 text-xs animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-650 block font-bold">Goal Statement</label>
                  <input
                    type="text"
                    placeholder="E.g. Lock deadlift 180kg or reach 62kg"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-650 block font-bold">Type</label>
                    <select
                      value={goalType}
                      onChange={(e) => setGoalType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs"
                    >
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Strength">Strength</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-650 block font-bold">Target Value</label>
                    <input
                      type="number"
                      placeholder="60"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-650 block font-bold">Unit</label>
                    <input
                      type="text"
                      placeholder="kg"
                      value={goalUnit}
                      onChange={(e) => setGoalUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-550 block">Target Completion Date</label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-850 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCreateGoal}
                    className="px-5 py-2.5 bg-emerald-500 text-zinc-950 font-bold rounded-xl uppercase tracking-wider text-xs cursor-pointer"
                  >
                    Commit Goal
                  </button>
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="px-4 py-2.5 border border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-900 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Goals render listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {client.goals.map((g) => {
              // Predict goal calculation ratio
              const progressPct = g.type === "Weight Loss" 
                ? Math.max(0, Math.min(100, Math.round(((client.startingWeight - client.weight) / (client.startingWeight - g.targetValue)) * 100)))
                : 60; // Mock 60 for strength goals

              return (
                <div key={g.id} className="bg-zinc-950/40 p-4.5 border border-zinc-850 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-zinc-900 text-zinc-400 text-[8.5px] font-mono uppercase tracking-widest px-2 py-0.5 rounded">
                        {g.type} Goal
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2 font-sans">{g.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Target: {g.targetValue} {g.unit}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded">
                      On Track
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-550 mb-1">
                      <span>Goal Completion Probability</span>
                      <span>{progressPct}% Achieve probability</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[10.5px] font-mono text-zinc-500 flex justify-between border-t border-zinc-900 pt-2 text-center mt-1">
                    <span>Opened: {g.startDate}</span>
                    <span>Deadline: {g.targetDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/********* TAB 6: CORE EXERCISE TECHNIQUE ANALYSIS *********/}
      {activeTab === "Technique" && (
        <div className="grid grid-cols-1 gap-6">
          <ExerciseVideoLibrary />
        </div>
      )}

      {/********* TAB 7: AI FIT COACH ASSISTANT *********/}
      {activeTab === "AI" && (
        <div className="grid grid-cols-1 gap-6">
          <AICoachPanel client={client} onUpdateClient={onUpdateClient} />
        </div>
      )}

    </div>
  );
}
