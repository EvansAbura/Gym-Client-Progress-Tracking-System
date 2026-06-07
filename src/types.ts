/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Trainer" | "Client";

export interface BodyMeasurements {
  id: string;
  date: string;
  chest: number; // inches or cm
  waist: number;
  hips: number;
  neck: number;
  shoulders: number;
  bicepLeft: number;
  bicepRight: number;
  forearmLeft: number;
  forearmRight: number;
  thighLeft: number;
  thighRight: number;
  calfLeft: number;
  calfRight: number;
}

export interface ProgressPhoto {
  front: string;
  side: string;
  back: string;
  date: string;
  notes?: string;
}

export interface ExerciseSet {
  id: string;
  weight: number; // lbs or kgs
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  name: string;
  category: "Strength" | "Cardio" | "Endurance" | "Flexibility";
  sets: ExerciseSet[];
  notes?: string;
  personalRecord?: number;
}

export interface DailyWorkout {
  id: string;
  date: string;
  name: string;
  completed: boolean;
  exercises: ExerciseLog[];
}

export interface MealLog {
  id: string;
  time: string;
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number;
  fats: number;
}

export interface DailyNutrition {
  id: string;
  date: string;
  meals: MealLog[];
  waterIntakeMl: number; // ml
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
}

export interface Goal {
  id: string;
  title: string;
  type: "Weight Loss" | "Muscle Gain" | "Strength" | "Endurance" | "Custom";
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  status: "In Progress" | "Achieved" | "On Track" | "At Risk";
  milestones: { id: string; title: string; achieved: boolean }[];
}

export interface WearableSync {
  provider: "Apple Health" | "Fitbit" | "Garmin" | "Samsung Health" | "Google Fit" | "None";
  status: "Connected" | "Disconnected";
  lastSynced: string;
  stepsToday: number;
  caloriesBurnedToday: number;
  activeMinutesToday: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  plan: string;
}

export interface Client {
  id: string;
  fullName: string;
  profilePhoto: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  height: number; // cm
  weight: number; // kg
  startingWeight: number; // kg
  targetWeight: number; // kg
  bodyFatPercentage: number;
  startingBodyFat: number;
  fitnessGoals: string[];
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalConditions: string[];
  membershipStatus: "Active" | "Pending" | "Suspended";
  joinDate: string;
  trainerAssigned: string;
  engagementScore: number; // 1-100 based on consistency
  isAtRisk: boolean;
  
  // Historical data arrays
  weightHistory: { date: string; value: number }[];
  bodyFatHistory: { date: string; value: number }[];
  stepsHistory: { date: string; value: number }[];
  caloriesBurnedHistory: { date: string; value: number }[];
  
  // Linked sub-structures
  measurements: BodyMeasurements[];
  photos: ProgressPhoto[];
  workouts: DailyWorkout[];
  nutrition: DailyNutrition[];
  goals: Goal[];
  wearable: WearableSync;
  payments: PaymentRecord[];
  attendance: { date: string; checkedIn: boolean; method: "Manual" | "QR" }[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: string;
  startDate: string;
  endDate: string;
  participants: { clientId: string; progress: number; rank: number }[];
}

export interface TrainerStats {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  clientsAtRisk: number;
  averageEngagementScore: number;
  monthlyRevenue: number;
  retentionRate: number; // percentage
}
