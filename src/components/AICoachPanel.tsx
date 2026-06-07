/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Client } from "../types";
import { Sparkles, Cpu, Send, RefreshCw, Trophy, Target, AlertTriangle, ShieldCheck } from "lucide-react";

interface AICoachPanelProps {
  client: Client;
  onUpdateClient: (updatedClient: Client) => void;
}

export default function AICoachPanel({ client, onUpdateClient }: AICoachPanelProps) {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [analysis, setAnalysis] = useState<string>("");
  const [lastQuery, setLastQuery] = useState("");

  const triggerAnalysis = async (queryOverride?: string) => {
    setLoading(true);
    const targetQuery = queryOverride || userInput || "Detailed plateau audit & caloric correction.";
    setLastQuery(targetQuery);
    
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientState: client,
          query: targetQuery
        }),
      });
      const data = await response.json();
      setAnalysis(data.text || "Unable to retrieve analysis from AI Coach.");
    } catch (err) {
      console.error(err);
      setAnalysis("Error: Failed to connect with Snave AI fitness engine.");
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  // Helper to parse double-asterisks and simple markdown items into beautiful HTML
  const formatMarkdownToHTML = (text: string) => {
    if (!text) return null;
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let cleaned = line.trim();
      
      // Render Headers
      if (cleaned.startsWith("###")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-emerald-400 mt-5 mb-2 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {cleaned.replace("###", "").trim()}
          </h4>
        );
      }
      if (cleaned.startsWith("####")) {
        return (
          <h5 key={idx} className="text-xs font-semibold text-zinc-300 mt-4 mb-2 uppercase tracking-wide">
            {cleaned.replace("####", "").trim()}
          </h5>
        );
      }
      
      // Render Bullet Points
      if (cleaned.startsWith("*") || cleaned.startsWith("-")) {
        let content = cleaned.replace(/^[\*\-]\s+/, "");
        
        // Highlight Alert/Danger indicators specially
        const isAlert = content.includes("🚨") || content.includes("⚠️") || content.includes("Warning");
        const isSuccess = content.includes("✅") || content.includes("Optimal") || content.includes("Good");

        // Parse bold markers **content**
        const parts = content.split(/\*\*([^*]+)\*\*/g);
        
        return (
          <div
            key={idx}
            className={`flex items-start gap-2.5 p-2 rounded-lg my-1 text-xs border ${
              isAlert ? "bg-rose-500/10 border-rose-500/20 text-rose-300/90" :
              isSuccess ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300/90" :
              "bg-zinc-950/40 border-zinc-900 text-zinc-300"
            }`}
          >
            <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
            <span className="leading-relaxed">
              {parts.map((part, pIdx) => 
                pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-white tracking-wide">{part}</strong> : part
              )}
            </span>
          </div>
        );
      }

      // Standalone alert sections
      if (cleaned.startsWith("🚨") || cleaned.startsWith("⚠️")) {
        return (
          <div key={idx} className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg my-2 text-xs text-rose-300 flex items-start gap-2.5">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <p className="leading-relaxed">{cleaned.replace(/^[🚨⚠️]\s*/, "")}</p>
          </div>
        );
      }

      if (cleaned === "") return <div key={idx} className="h-2" />;

      // Normal lines
      const parts = cleaned.split(/\*\*([^*]+)\*\*/g);
      return (
        <p key={idx} className="text-xs text-zinc-300 leading-relaxed my-1.5">
          {parts.map((part, pIdx) => 
            pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-white">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5 text-zinc-100 shadow-2xl relative overflow-hidden">
      
      {/* Glow highlight graphic decoration */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-lg shrink-0">
            <Cpu className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wider uppercase text-white">SNAVE CO-PILOT</span>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm animate-pulse">
                Active AI Coach
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Adaptive physiological modeling for <span className="text-emerald-400 font-semibold">{client.fullName}</span>
            </p>
          </div>
        </div>

        {/* Prompt presets */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerAnalysis("Perform a complete 12-week Plateau & Metabolic Rate audit.")}
            className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-300 flex items-center gap-1 transition"
          >
            <AlertTriangle className="w-3 h-3 text-emerald-400" /> Plateau Audit
          </button>
          <button
            onClick={() => triggerAnalysis("Suggest calorie and protein macros adjustments based on current weight trends and body fat.")}
            className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-300 flex items-center gap-1 transition"
          >
            <Target className="w-3 h-3 text-emerald-400" /> Re-Macro Caloric Target
          </button>
        </div>
      </div>

      {analysis ? (
        <div className="flex flex-col gap-5">
          {/* AI Message Panel Container */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
            <div className="flex items-center justify-between pb-3 mb-1 text-[10px] uppercase font-mono tracking-widest text-zinc-500 border-b border-zinc-900">
              <span>Coaching Advisory Notes for Evans</span>
              <span>Based on client weight data</span>
            </div>
            <div className="font-sans">
              {formatMarkdownToHTML(analysis)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/20 p-3 rounded-xl border border-zinc-800/35">
            <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
              Last Promoted Query: "{lastQuery}" <br />
              Heuristics calculations trace metabolic adaptation limits over 12-week pools.
            </p>
            <button
              onClick={() => triggerAnalysis(lastQuery)}
              disabled={loading}
              className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:text-white transition cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              )}
              Re-evaluate
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950/30 border border-zinc-800 border-dashed rounded-xl p-8 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="max-w-md">
            <h4 className="text-sm font-bold text-zinc-200">Request High-Octane Coaching Breakdown</h4>
            <p className="text-xs text-zinc-500 leading-relaxed mt-1">
              Snave Co-Pilot synthesizes starting weight logs, nutrition tracking metrics, and exercise milestones to formulate plateaus alerts and pinpoint hypertrophy tweaks instantly.
            </p>
          </div>
          <button
            onClick={() => triggerAnalysis()}
            disabled={loading}
            className="mt-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Cpu className="w-4 h-4" />
            )}
            Compile Biometrics Audit & Program tweaks
          </button>
        </div>
      )}

      {/* Manual Prompt Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask Snave to write a deload week schedule or recalculate macros..."
          className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-sans"
          onKeyDown={(e) => {
            if (e.key === "Enter" && userInput) triggerAnalysis();
          }}
        />
        <button
          onClick={() => triggerAnalysis()}
          disabled={loading || !userInput.trim()}
          className="px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 font-semibold text-zinc-950 rounded-xl flex items-center justify-center transition shrink-0"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-center text-[10px] text-zinc-600 px-1">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> HIPPA-Compliant Secure Biometric Logs
        </div>
        <span>Model: gemini-3.5-flash</span>
      </div>
    </div>
  );
}
