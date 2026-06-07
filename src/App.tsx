/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { INITIAL_CLIENTS, INITIAL_CHALLENGES } from "./mockData";
import { Client, Challenge, UserRole } from "./types";
import TrainerOverview from "./components/TrainerOverview";
import ClientDetail from "./components/ClientDetail";
import AddClientModal from "./components/AddClientModal";
import { 
  Users, Dumbbell, ShieldAlert, BadgeInfo, Bell, Menu, Sparkles, 
  ToggleLeft, Lock, Trophy, UserCheck, Check, Laptop, LogIn
} from "lucide-react";

export default function App() {
  
  // Roster persistence states
  const [clients, setClients] = useState<Client[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>("Trainer");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  // Initialize and load from local storage
  useEffect(() => {
    const storedClients = localStorage.getItem("snave_clients");
    const storedChallenges = localStorage.getItem("snave_challenges");

    if (storedClients) {
      try {
        setClients(JSON.parse(storedClients));
      } catch (e) {
        setClients(INITIAL_CLIENTS);
      }
    } else {
      setClients(INITIAL_CLIENTS);
      localStorage.setItem("snave_clients", JSON.stringify(INITIAL_CLIENTS));
    }

    if (storedChallenges) {
      try {
        setChallenges(JSON.parse(storedChallenges));
      } catch (e) {
        setChallenges(INITIAL_CHALLENGES);
      }
    } else {
      setChallenges(INITIAL_CHALLENGES);
      localStorage.setItem("snave_challenges", JSON.stringify(INITIAL_CHALLENGES));
    }
  }, []);

  // Sync back state alterations
  const syncClientsToStore = (newClientsList: Client[]) => {
    setClients(newClientsList);
    localStorage.setItem("snave_clients", JSON.stringify(newClientsList));
  };

  const syncChallengesToStore = (newChallengesList: Challenge[]) => {
    setChallenges(newChallengesList);
    localStorage.setItem("snave_challenges", JSON.stringify(newChallengesList));
  };

  // Add / Edit Client roster
  const handleSaveClient = (clientObj: Client) => {
    const exists = clients.some(c => c.id === clientObj.id);
    let updated: Client[];
    
    if (exists) {
      // Edit mode
      updated = clients.map(c => c.id === clientObj.id ? clientObj : c);
    } else {
      // Onboard mode
      updated = [...clients, clientObj];
    }

    syncClientsToStore(updated);
    setShowAddModal(false);
    setEditingClient(undefined);
  };

  // Terminate registration record
  const handleDeleteClient = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to terminate this client's profile record?");
    if (!confirmDelete) return;

    const filtered = clients.filter(c => c.id !== id);
    syncClientsToStore(filtered);
    
    if (selectedClientId === id) {
      setSelectedClientId(null);
    }
  };

  // Record manual/QR Check-in attendance
  const handleRecordAttendance = (clientId: string) => {
    const dateStr = new Date().toISOString().split("T")[0];
    const updated = clients.map(c => {
      if (c.id === clientId) {
        const alreadyCheckedIn = c.attendance.some(a => a.date === dateStr);
        if (!alreadyCheckedIn) {
          return {
            ...c,
            attendance: [
              ...c.attendance,
              { date: dateStr, checkedIn: true, method: "QR" as const }
            ],
            // Boost consistency score on check-in
            engagementScore: Math.min(100, c.engagementScore + 5)
          };
        }
      }
      return c;
    });

    syncClientsToStore(updated);
  };

  // Find inspected client payload
  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  return (
    <div id="snave-root-view" className="min-h-screen bg-[#020617] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 font-sans flex flex-col lg:flex-row relative overflow-x-hidden">
      
      {/* Symmetrical Left Sidebar matching Design HTML */}
      <nav id="snave-left-rail" className="w-full lg:w-64 bg-zinc-900/90 border-r border-zinc-800/80 flex flex-col p-5 shrink-0 justify-between relative z-20 backdrop-blur-md">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1.5">
            <div className="w-8.5 h-8.5 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 font-black italic shadow-sm metric-shadow-active">S</div>
            <div>
              <span className="text-sm font-black tracking-widest text-emerald-400 block uppercase">SNAVE <span className="text-[10px] text-zinc-500 font-mono">PRO</span></span>
              <span className="text-[9px] text-zinc-500 font-mono block">Biometrics & AI</span>
            </div>
          </div>

          <div className="pt-2 space-y-1.5">
            <div className="text-[9.5px] uppercase tracking-widest text-zinc-500 font-mono px-3 py-1 font-bold">Portals</div>
            
            <button 
              id="role-switch-trainer"
              onClick={() => {
                setActiveRole("Trainer");
                setSelectedClientId(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeRole === "Trainer" 
                  ? "bg-zinc-800 text-emerald-400 border border-zinc-700/60 font-black" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 text-emerald-500" />
              Trainer Portal
              <span className="ml-auto bg-zinc-950 text-[10px] px-1.5 py-0.5 rounded-md font-mono text-zinc-400">{clients.length}</span>
            </button>

            <button 
              id="role-switch-client"
              onClick={() => {
                setActiveRole("Client");
                if (clients.length > 0) {
                  setSelectedClientId(clients[0].id);
                }
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeRole === "Client"
                  ? "bg-zinc-800 text-emerald-400 border border-zinc-700/60 font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Dumbbell className="w-4 h-4 text-emerald-500" />
              Client App
            </button>

            <div className="text-[9.5px] uppercase tracking-widest text-zinc-500 font-mono px-3 py-1 font-bold pt-4">Diagnostic Aids</div>
            
            <button 
              id="side-action-analytics"
              onClick={() => alert("Telemetry analysis is linked inside clients' biometric dashboards.")}
              className="w-full text-left px-3.5 py-2 flex items-center gap-3 text-zinc-400 hover:text-white text-xs font-semibold transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Analytics Rail
            </button>
            <button 
              id="side-action-insights"
              onClick={() => {
                if (selectedClientId) {
                  alert(`AI Engine Diagnostics for ${activeClient.fullName}: Hydration deficit calculated at -40% baseline.`);
                } else if (clients.length > 0) {
                  setSelectedClientId(clients[0].id);
                }
              }}
              className="w-full text-left px-3.5 py-2 flex items-center gap-3 text-zinc-400 hover:text-white text-xs font-semibold transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-450"></span>
              AI Insights
            </button>
          </div>
        </div>

        {/* Live Trainer Coach Badge Profile matching High Density Design */}
        <div className="mt-8 border-t border-zinc-800/80 pt-4.5">
          <div className="flex items-center gap-3 px-1.5">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" 
                alt="Marcus Thorne Coach Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Marcus Thorne</p>
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter font-mono">Elite Specialist</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Viewport Content block */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative z-10">
        
        {/* Sleek top telemetry row inside content pane */}
        <header className="h-auto lg:h-16 border-b border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between px-6 gap-4 py-4 lg:py-0 bg-zinc-900/30 backdrop-blur-md shrink-0">
          <div className="flex gap-8 items-center flex-wrap sm:flex-nowrap">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Gross Billings</span>
              <span className="text-xs lg:text-sm font-bold text-white font-mono mt-0.5">${clients.reduce((acc, c) => acc + (c.payments.reduce((pAcc, p) => pAcc + p.amount, 0) || 120), 0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Active Roster</span>
              <span className="text-xs lg:text-sm font-bold text-emerald-400 font-mono mt-0.5">
                {clients.filter(c => c.membershipStatus === "Active").length} / {clients.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">System Score</span>
              <span className="text-xs lg:text-sm font-bold text-white font-mono mt-0.5">
                {clients.length > 0 ? Math.round(clients.reduce((acc, c) => acc + c.engagementScore, 0) / clients.length) : 0}% Avg
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="bg-zinc-950 border border-zinc-850 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-mono text-[10px]">COACH SECTOR</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
            
            {activeRole === "Trainer" && (
              <button
                id="header-shortcut-add-client"
                onClick={() => {
                  setEditingClient(undefined);
                  setShowAddModal(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-lg text-xs uppercase tracking-wider transition cursor-pointer"
              >
                + Client Roster
              </button>
            )}
          </div>
        </header>

        {/* Global Warning Alert Block inside content frame */}
        {activeRole === "Trainer" && clients.some(c => c.isAtRisk) && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 p-4.5 flex items-start gap-3.5 text-xs text-rose-300">
            <ShieldAlert className="w-5 h-5 text-rose-450 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-rose-400 uppercase tracking-widest text-[9px]">Biometric Plateau Notification Alert</span>
              <p className="mt-0.5 leading-relaxed text-zinc-300">
                Alex Rivera is currently identified under physiological high-adaptation parameters. Send check-in prompt to update diet macro profiles.
              </p>
            </div>
          </div>
        )}

        {/* Adaptive viewport body */}
        <div className="flex-1 p-6 overflow-y-auto z-10">
          {activeRole === "Trainer" ? (
            selectedClientId ? (
              <ClientDetail 
                client={activeClient}
                onBack={() => setSelectedClientId(null)}
                onUpdateClient={(updated) => {
                  const refreshed = clients.map(c => c.id === updated.id ? updated : c);
                  syncClientsToStore(refreshed);
                }}
              />
            ) : (
              <TrainerOverview 
                clients={clients}
                challenges={challenges}
                onSelectClient={(c) => setSelectedClientId(c.id)}
                onAddClient={handleSaveClient}
                onDeleteClient={handleDeleteClient}
                onTriggerCheckIn={handleRecordAttendance}
              />
            )
          ) : (
            // Client View Experience Page Wrapper
            activeClient ? (
              <div className="flex flex-col gap-6">
                
                {/* Client Welcome profile badge */}
                <div className="bg-gradient-to-r from-zinc-900/40 to-emerald-500/5 p-6 rounded-3xl border border-zinc-800 flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={activeClient.profilePhoto} 
                      alt={activeClient.fullName} 
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700" 
                    />
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">Welcome Back, {activeClient.fullName}!</h2>
                      <span className="text-xs text-zinc-400 font-mono">Dynamic Personal Workout Tracker</span>
                    </div>
                  </div>

                  {/* Dropdown switcher for playground simulation */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-zinc-500">Switch simulator view:</span>
                    <select
                      value={selectedClientId || ""}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="bg-zinc-950 px-3 py-1.5 border border-zinc-850 rounded-xl text-zinc-300 font-bold focus:outline-none focus:border-emerald-500"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <ClientDetail 
                  client={activeClient}
                  onBack={() => setActiveRole("Trainer")}
                  onUpdateClient={(updated) => {
                    const refreshed = clients.map(c => c.id === updated.id ? updated : c);
                    syncClientsToStore(refreshed);
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500 italic">
                No onboarded client profiles found inside database records.
              </div>
            )
          )}
        </div>

        {/* Responsive platform diagnostic footer */}
        <footer className="h-10 bg-zinc-900 border-t border-zinc-800 px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex gap-4 items-center">
            <span className="text-[10px] text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Offline Database Synced
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-500">Wearables: Fitbit & Watch Active Online</span>
          </div>
          <span className="text-[10.5px] font-bold text-zinc-400 font-mono uppercase tracking-tighter">SNAVE v1.1 EDGE</span>
        </footer>

      </main>

      {/* Onboarding modal container */}
      {showAddModal && (
        <AddClientModal 
          onClose={() => {
            setShowAddModal(false);
            setEditingClient(undefined);
          }}
          onSave={handleSaveClient}
          editingClient={editingClient}
        />
      )}

    </div>
  );
}
