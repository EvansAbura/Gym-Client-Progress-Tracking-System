/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Client } from "../types";
import { X, UserPlus, Info, CheckCircle } from "lucide-react";

interface AddClientModalProps {
  onClose: () => void;
  onSave: (client: Client) => void;
  editingClient?: Client;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=200&auto=format&fit=crop", // Female fitness
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", // Male athlete
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", // Male young
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"  // Female active
];

export default function AddClientModal({ onClose, onSave, editingClient }: AddClientModalProps) {
  const [fullName, setFullName] = useState(editingClient?.fullName || "");
  const [profilePhoto, setProfilePhoto] = useState(editingClient?.profilePhoto || PRESET_AVATARS[0]);
  const [age, setAge] = useState<number>(editingClient?.age || 26);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">(editingClient?.gender || "Female");
  const [height, setHeight] = useState<number>(editingClient?.height || 170);
  const [weight, setWeight] = useState<number>(editingClient?.weight || 70);
  const [targetWeight, setTargetWeight] = useState<number>(editingClient?.targetWeight || 65);
  const [bodyFat, setBodyFat] = useState<number>(editingClient?.bodyFatPercentage || 22);
  const [goalsString, setGoalsString] = useState(editingClient?.fitnessGoals.join(", ") || "Weight Loss, Toning");
  const [email, setEmail] = useState(editingClient?.contactInfo.email || "");
  const [phone, setPhone] = useState(editingClient?.contactInfo.phone || "");
  const [address, setAddress] = useState(editingClient?.contactInfo.address || "");
  const [emergencyName, setEmergencyName] = useState(editingClient?.emergencyContact.name || "");
  const [emergencyRelation, setEmergencyRelation] = useState(editingClient?.emergencyContact.relationship || "");
  const [emergencyPhone, setEmergencyPhone] = useState(editingClient?.emergencyContact.phone || "");
  const [medical, setMedical] = useState(editingClient?.medicalConditions.join(", ") || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const parsedGoals = goalsString
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    const parsedMedical = medical
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const newClient: Client = {
      id: editingClient?.id || `client-${Date.now()}`,
      fullName,
      profilePhoto,
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      startingWeight: editingClient?.startingWeight || Number(weight),
      targetWeight: Number(targetWeight),
      bodyFatPercentage: Number(bodyFat),
      startingBodyFat: editingClient?.startingBodyFat || Number(bodyFat),
      fitnessGoals: parsedGoals,
      contactInfo: {
        email,
        phone,
        address
      },
      emergencyContact: {
        name: emergencyName || "N/A",
        relationship: emergencyRelation || "N/A",
        phone: emergencyPhone || "N/A"
      },
      medicalConditions: parsedMedical,
      membershipStatus: editingClient?.membershipStatus || "Active",
      joinDate: editingClient?.joinDate || new Date().toISOString().split("T")[0],
      trainerAssigned: editingClient?.trainerAssigned || "Coach Evans",
      engagementScore: editingClient?.engagementScore || 85,
      isAtRisk: editingClient?.isAtRisk || false,
      weightHistory: editingClient?.weightHistory || [{ date: new Date().toISOString().split("T")[0], value: Number(weight) }],
      bodyFatHistory: editingClient?.bodyFatHistory || [{ date: new Date().toISOString().split("T")[0], value: Number(bodyFat) }],
      stepsHistory: editingClient?.stepsHistory || [],
      caloriesBurnedHistory: editingClient?.caloriesBurnedHistory || [],
      measurements: editingClient?.measurements || [],
      photos: editingClient?.photos || [],
      workouts: editingClient?.workouts || [],
      nutrition: editingClient?.nutrition || [],
      goals: editingClient?.goals || [
        {
          id: `g-init-${Date.now()}`,
          title: `Reach ${targetWeight}kg`,
          type: "Weight Loss",
          targetValue: Number(targetWeight),
          currentValue: Number(weight),
          unit: "kg",
          startDate: new Date().toISOString().split("T")[0],
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "In Progress",
          milestones: [{ id: "m-1", title: "Scale halfway point", achieved: false }]
        }
      ],
      wearable: editingClient?.wearable || {
        provider: "None",
        status: "Disconnected",
        lastSynced: "Never",
        stepsToday: 0,
        caloriesBurnedToday: 0,
        activeMinutesToday: 0
      },
      payments: editingClient?.payments || [],
      attendance: editingClient?.attendance || []
    };

    onSave(newClient);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/70 p-4 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {editingClient ? "Modify Gym Client Profile" : "Onboard Advanced New Client"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Preset Photo Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-2.5">
              Profile Photo Avatar Presets
            </label>
            <div className="flex items-center gap-3">
              <img
                src={profilePhoto}
                alt="Selected Avatar"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md transform hover:scale-105 transition"
                referrerPolicy="no-referrer"
              />
              <div className="flex gap-2">
                {PRESET_AVATARS.map((pic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfilePhoto(pic)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                      profilePhoto === pic ? "border-emerald-500 shadow-sm scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={pic} alt={`preset-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Full Client Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Connor"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah.connor@resistance.net"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Age (years)
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                required
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target Weight */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>

            {/* Body Fat Percentage */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Body Fat %
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={bodyFat}
                onChange={(e) => setBodyFat(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>

            {/* Telephone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 012-3456"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-zinc-950 rounded-2xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              Upon initializing this record, standard weight trends, body measurements comparison timelines, and an adaptive nutrition diary are registered automatically using biometric macros baselines.
            </p>
          </div>

          {/* Fitness Goals (Multi-select via text) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 dark:text-zinc-400 mb-1 flex justify-between">
              <span>Primary Fitness Goals</span>
              <span className="text-[10px] text-emerald-400 font-mono italic">Comma-separated</span>
            </label>
            <input
              type="text"
              value={goalsString}
              onChange={(e) => setGoalsString(e.target.value)}
              placeholder="Weight Loss, Core Strength, Toning, Hypertrophy"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100 placeholder-zinc-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1">
              Residential Address (Optional)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Workout Ave, Muscle City, FL"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
            />
          </div>

          {/* Medical & History */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 dark:text-zinc-400 mb-1 flex justify-between">
              <span>Medical Conditions & Previous Injuries</span>
              <span className="text-[10px] text-zinc-500 font-mono">Comma-separated</span>
            </label>
            <input
              type="text"
              value={medical}
              onChange={(e) => setMedical(e.target.value)}
              placeholder="Recovered shoulder impingement, Mild asthma"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 dark:text-zinc-100 placeholder-zinc-500"
            />
          </div>

          {/* Emergency Contacts */}
          <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-850 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
              🚨 Emergency Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Relationship (e.g. Spouse)"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Contact Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 text-zinc-950 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 cursor-pointer transition active:scale-[0.99]"
          >
            <CheckCircle className="w-4 h-4 font-bold" />
            {editingClient ? "Save Modified Changes" : "Commit New Client Roster"}
          </button>
        </form>
      </div>
    </div>
  );
}
