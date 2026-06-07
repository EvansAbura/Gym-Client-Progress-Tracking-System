/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Client, Challenge } from "../types";
import { 
  Users, TrendingUp, AlertTriangle, DollarSign, Award, Target, 
  Search, ShieldAlert, BadgeInfo, Download, Plus, Edit, Trash2, 
  ChevronRight, Calendar, Smartphone, QrCode, Bell, MessageSquare, 
  Sparkles, Check, Flame, Trophy
} from "lucide-react";

interface TrainerOverviewProps {
  clients: Client[];
  challenges: Challenge[];
  onSelectClient: (client: Client) => void;
  onAddClient: (newClient: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onTriggerCheckIn: (clientId: string) => void;
}

export default function TrainerOverview({ 
  clients, 
  challenges, 
  onSelectClient, 
  onAddClient, 
  onDeleteClient,
  onTriggerCheckIn
}: TrainerOverviewProps) {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<"All" | "At Risk" | "Healthy">("All");
  const [activeTab, setActiveTab] = useState<"Roster" | "Challenges" | "Comms" | "Reports">("Roster");
  
  // Notification Simulator State
  const [activeNotification, setActiveNotification] = useState<{
    type: "WhatsApp" | "Email" | "App Push";
    message: string;
    target: string;
    date: string;
  } | null>(null);

  // QR Check-in State
  const [showQrModal, setShowQrModal] = useState<string | null>(null); // clientId to show QR
  const [checkedInClient, setCheckedInClient] = useState<string | null>(null);

  // Search & Filter
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterRisk === "At Risk") return matchesSearch && c.isAtRisk;
    if (filterRisk === "Healthy") return matchesSearch && !c.isAtRisk;
    return matchesSearch;
  });

  // Derived Trainer Stats
  const totalClientsCount = clients.length;
  const activeClientsCount = clients.filter(c => c.membershipStatus === "Active").length;
  const atRiskCount = clients.filter(c => c.isAtRisk).length;
  const averageEngagement = Math.round(clients.reduce((acc, c) => acc + c.engagementScore, 0) / (totalClientsCount || 1));
  const estimatedRevenue = clients.reduce((acc, c) => {
    const totalPayments = c.payments.reduce((pAcc, p) => pAcc + p.amount, 0);
    return acc + (totalPayments || 120); // Default $120 if no payments logged
  }, 0);

  // Trigger QR attendance check-in
  const performQrCheckIn = (clientId: string) => {
    onTriggerCheckIn(clientId);
    setCheckedInClient(clientId);
    setTimeout(() => {
      setCheckedInClient(null);
      setShowQrModal(null);
    }, 2000);
  };

  // Simulate remote notifications delivery
  const dispatchPing = (type: "WhatsApp" | "Email" | "App Push", clientName: string, message: string) => {
    setActiveNotification({
      type,
      message,
      target: clientName,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
    // Autoclose after 4 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 5500);
  };

  // Raw Client CSV compiles data for reports
  const exportRosterToCSV = () => {
    const headers = [
      "Client ID", "Full Name", "Age", "Gender", "Height (cm)", "Current Weight (kg)", 
      "Starting Weight (kg)", "Target Weight (kg)", "Body Fat %", "Engagement Score", "At Risk"
    ];
    const rows = clients.map(c => [
      c.id, c.fullName, c.age, c.gender, c.height, c.weight, 
      c.startingWeight, c.targetWeight, c.bodyFatPercentage, c.engagementScore, c.isAtRisk ? "YES" : "NO"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Snave_Trainer_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Floating Notification Toast Simulation */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 bg-zinc-950 border border-emerald-500/30 p-4 rounded-2xl shadow-2xl z-50 animate-fade-in max-w-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            {activeNotification.type === "WhatsApp" ? <MessageSquare className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400 fill-emerald-400" /> Ping Successful
              </span>
              <span>{activeNotification.date}</span>
            </div>
            <h5 className="text-xs font-semibold text-zinc-200 mt-1">Dispacthed to {activeNotification.target}</h5>
            <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{activeNotification.message}</p>
          </div>
        </div>
      )}

      {/* Banner / Header Title Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="bg-emerald-500 text-zinc-950 px-2.5 py-1 rounded-xl text-lg font-black tracking-widest shadow-md shadow-emerald-500/10 uppercase">
                SNAVE
              </span> 
              Core Control
            </h1>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mt-1">
            Enterprise roster overview, metric adaptation plates, automated PDF exports, and WhatsApp coaching relays.
          </p>
        </div>

        {/* Tab Selector Controllers */}
        <div className="flex bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800 self-start md:self-center">
          {(["Roster", "Challenges", "Comms", "Reports"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-xl uppercase transition cursor-pointer ${
                activeTab === tab 
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trainer Stats Bento Grid Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Clients */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Clients</span>
            <h3 className="text-2xl font-black text-white mt-1">{totalClientsCount}</h3>
            <span className="text-[9px] text-emerald-400 font-mono font-medium block mt-0.5">100% active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-850 flex items-center justify-center text-zinc-300">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Plateau / At Risk</span>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{atRiskCount}</h3>
            <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">Alex Rivera flag</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Engagement Average */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Avg Consistency</span>
            <h3 className="text-2xl font-black text-white mt-1">{averageEngagement}%</h3>
            <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">Daily goal adherence</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/15">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Live Challenges */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Live Challenges</span>
            <h3 className="text-2xl font-black text-white mt-1">{challenges.length}</h3>
            <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">3 active competitors</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-850 flex items-center justify-center text-zinc-400">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        {/* Gross Revenue Valuation */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4.5 rounded-2xl flex items-center justify-between col-span-2 lg:col-span-1">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Gross Billings</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">${estimatedRevenue}</h3>
            <span className="text-[9px] text-emerald-400/80 font-mono block mt-0.5">Subscription active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/********* TAB 1: CLIENT ROSTER *********/}
      {activeTab === "Roster" && (
        <div className="flex flex-col gap-4">
          
          {/* Search bar controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Lookup clients by name or registration email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 self-end">
              <span className="text-xs font-mono text-zinc-500">Filter Risk:</span>
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                {(["All", "At Risk", "Healthy"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-lg uppercase ${
                      filterRisk === r ? "bg-zinc-800 text-emerald-400 border border-zinc-700" : "text-zinc-500"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roster Listing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client) => {
              const weightDiff = client.startingWeight - client.weight;
              const isWeightLoss = client.startingWeight > client.targetWeight;
              
              return (
                <div 
                  key={client.id}
                  className={`bg-zinc-900/60 border rounded-2xl p-5 flex flex-col gap-4.5 transition-all hover:scale-[1.01] hover:bg-zinc-900 ${
                    client.isAtRisk 
                      ? "border-rose-500/20 shadow-lg shadow-rose-950/5 bg-zinc-900/90" 
                      : "border-zinc-800/80 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={client.profilePhoto}
                        alt={client.fullName}
                        className="w-11 h-11 rounded-xl object-cover border border-zinc-700 bg-zinc-950"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white tracking-wide">{client.fullName}</h4>
                        <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{client.age}y • {client.gender}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {client.isAtRisk ? (
                        <span className="bg-rose-500/15 text-rose-400 border border-rose-500/20 text-[8px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldAlert className="w-2.5 h-2.5" /> Plateau Risk
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">
                          On Track
                        </span>
                      )}
                      
                      <button
                        onClick={() => setShowQrModal(client.id)}
                        className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700 transition"
                        title="Display check-in QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Weight Stats */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-zinc-500 text-center bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900">
                    <div>
                      <span className="text-zinc-600 block text-[8px] uppercase font-bold tracking-widest">Current</span>
                      <span className="text-white font-bold">{client.weight} kg</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block text-[8px] uppercase font-bold tracking-widest">Change</span>
                      <span className={`font-black ${weightDiff >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {weightDiff >= 0 ? `-${weightDiff.toFixed(1)}` : `+${Math.abs(weightDiff).toFixed(1)}`} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block text-[8px] uppercase font-bold tracking-widest">Goal</span>
                      <span className="text-zinc-400">{client.targetWeight} kg</span>
                    </div>
                  </div>

                  {/* Consistency Score Slider gauge */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400 mb-1 font-mono">
                      <span>Daily Consistency</span>
                      <span className={client.engagementScore > 80 ? "text-emerald-400" : client.engagementScore > 50 ? "text-amber-400" : "text-rose-400"}>
                        {client.engagementScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                      <div 
                        className={`h-full rounded-full ${
                          client.engagementScore > 80 ? "bg-emerald-500 shadow-md shadow-emerald-500/20" : 
                          client.engagementScore > 50 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${client.engagementScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Wearable Sync status */}
                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500 bg-zinc-950/10 px-2 py-1.5 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-zinc-600" /> Wearable:
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      client.wearable.provider !== "None" ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {client.wearable.provider}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => onSelectClient(client)}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-[11px] uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-1 shadow-md shadow-emerald-500/5 transition cursor-pointer"
                    >
                      Inspect Client <ChevronRight className="w-3.5 h-3.5 font-bold" />
                    </button>
                    <button
                      onClick={() => onDeleteClient(client.id)}
                      className="p-2 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 rounded-xl transition"
                      title="Deplane Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClients.length === 0 && (
            <div className="bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl p-10 text-center text-zinc-500">
              No matching clients found inside lookup arrays.
            </div>
          )}
        </div>
      )}

      {/********* TAB 2: CHALLENGES & LEADERBOARD *********/}
      {activeTab === "Challenges" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((chal) => (
            <div key={chal.id} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-amber-400/10 text-amber-500 border border-amber-400/20 text-[9px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded-full">
                    Competence Challenge
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{chal.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{chal.description}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>

              {/* Leaderboard Competitors */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Leaderboard Position</span>
                {chal.participants.map((p) => {
                  const clientObj = clients.find(c => c.id === p.clientId);
                  if (!clientObj) return null;
                  
                  return (
                    <div 
                      key={p.clientId}
                      onClick={() => onSelectClient(clientObj)}
                      className="bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 flex items-center justify-between gap-2.5 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-5 font-mono text-center font-black text-sm text-zinc-500">
                          {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}
                        </span>
                        <img
                          src={clientObj.profilePhoto}
                          alt={clientObj.fullName}
                          className="w-9 h-9 rounded-lg object-cover border border-zinc-850"
                        />
                        <div>
                          <span className="font-semibold text-xs text-zinc-200">{clientObj.fullName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Hydration rating</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">{p.progress}</span>
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono border-t border-zinc-800/50 pt-3">
                <span>Start: {chal.startDate}</span>
                <span>Ends: {chal.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/********* TAB 3: ACTIVE REMINDERS & COMMUNICATIONS *********/}
      {activeTab === "Comms" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" /> Core Reminders & SMS Relays
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Broadcast active checklist notifications (Check-ins, water, weigh-ins) or trigger real WhatsApp integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Automatic Broadcast setup */}
            <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-5 flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-400">Target Notification Dispatcher</h4>
              
              <div className="flex flex-col gap-2">
                {clients.map(c => (
                  <div key={c.id} className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <img src={c.profilePhoto} alt={c.fullName} className="w-7 h-7 rounded-md object-cover" />
                      <span className="text-xs font-semibold text-zinc-200">{c.fullName}</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => dispatchPing("WhatsApp", c.fullName, "Hi! This is Coach Evans. Remember to log your active compound sets volume today on Snave app. Squat strong!")}
                        className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded hover:bg-emerald-500 hover:text-zinc-950 transition cursor-pointer"
                        title="Ping via WhatsApp"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => dispatchPing("App Push", c.fullName, "Weigh-In Reminder: Your morning adaptation log needs a weight entry. Keep it consistent!")}
                        className="p-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono rounded hover:bg-zinc-700 transition cursor-pointer"
                        title="Trigger Mobile Push"
                      >
                        Push
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated wearable setup information card */}
            <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-5 flex flex-col gap-4.5 justify-between">
              <div className="space-y-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full">
                  API Connect integrations
                </span>
                <h4 className="text-sm font-bold text-white">Apple Health & Fitbit Cloud Sync</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Automatically sync steps, resting heart rates, and calories burned using Apple HealthKit and Garmin Connect REST queries.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-start gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[11px] text-zinc-500 leading-relaxed font-mono">
                  Active Web integration tunnels: <br />
                  • Fitbit OAuth 2.0 State: <span className="text-emerald-400">Linked</span> <br />
                  • Apple Health Sandbox: <span className="text-emerald-400">Active</span> <br />
                  • Last Sync Hook: 15 minutes ago.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/********* TAB 4: AUTOMATED REPORTS EXPORTER *********/}
      {activeTab === "Reports" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" /> PDF & Excel Transformation Exports
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Compile analytical journals, nutrition statistics breakdowns, and diagnostic weight adaptation charts immediately into spreadsheets or simulated high-fidelity document tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Core Roster Spreadsheet exporter */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 transition flex justify-between items-center gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Download Master Clients CSV</h4>
                <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                  Export name, height, weights, starting metrics, body composition thresholds, and coaching warning alerts directly to Excel format.
                </p>
              </div>
              <button
                onClick={exportRosterToCSV}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>

            {/* Complete fitness transformation layout report simulation */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 transition flex justify-between items-center gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Generate Transformation PDF</h4>
                <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                  Synthesize before vs after measurements comparison matrices and strength adaptation curves into a print-ready PDF certificate.
                </p>
              </div>
              <button
                onClick={() => dispatchPing("Email", "Master Account", "Your printable 12-Week Biometrics Transformation Certificate PDF has been compiled successfully and dispatched to target archives.")}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition"
              >
                <Plus className="w-4 h-4 text-emerald-400" /> Export PDF
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QR CHECK-IN INTEGRATION MODAL SCREEN */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm text-center flex flex-col items-center gap-4 animate-fade-in text-white shadow-2xl">
            <h4 className="font-bold text-base">QR Gym Check-In Terminal</h4>
            <div className="p-4 bg-white rounded-2xl w-44 h-44 flex items-center justify-center shadow-lg relative">
              {/* Decorative Mock QR vector lines */}
              <div className="w-full h-full border-[10px] border-zinc-950 flex flex-wrap p-2 gap-1.5 relative">
                <div className="w-10 h-10 border-4 border-zinc-950 shrink-0" />
                <div className="w-10 h-10 border-4 border-zinc-950 shrink-0" />
                <div className="w-10 h-10 border-4 border-zinc-950 shrink-0" />
                <div className="w-full flex-1 border border-zinc-950 border-dashed" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-emerald-500 fill-emerald-500 shrink-0" />
                </div>
              </div>
              {checkedInClient === showQrModal && (
                <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center rounded-2xl animate-pulse p-4">
                  <Check className="w-12 h-12 text-zinc-950 font-black animate-bounce" />
                  <span className="text-zinc-950 font-black text-xs uppercase tracking-widest mt-1">Checked In</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scan this check-in token at the gym portal. Logs attendance instantly to client chronological card.
            </p>

            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={() => performQrCheckIn(showQrModal)}
                className="flex-1 py-2 bg-emerald-500 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Scan Token
              </button>
              <button
                onClick={() => setShowQrModal(null)}
                className="px-4 py-2 border border-zinc-800 hover:bg-zinc-850 rounded-xl text-xs text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
