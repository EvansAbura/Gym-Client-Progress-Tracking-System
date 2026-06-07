/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, Challenge } from "./types";

// Date helpers
const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "client-1",
    fullName: "Sarah Connor",
    profilePhoto: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=200&auto=format&fit=crop",
    age: 28,
    gender: "Female",
    height: 168,
    weight: 62.5,
    startingWeight: 68.0,
    targetWeight: 59.0,
    bodyFatPercentage: 21.4,
    startingBodyFat: 26.5,
    fitnessGoals: ["Weight Loss", "Core Strength", "Toning"],
    contactInfo: {
      email: "sarah.connor@resistance.net",
      phone: "+1 (555) 019-2831",
      address: "2029 Cyberdyne Way, Los Angeles, CA"
    },
    emergencyContact: {
      name: "John Connor",
      relationship: "Son",
      phone: "+1 (555) 019-3800"
    },
    medicalConditions: ["Recovered shoulder impingement"],
    membershipStatus: "Active",
    joinDate: getPastDateString(90),
    trainerAssigned: "Coach Evans",
    engagementScore: 92,
    isAtRisk: false,
    
    // 12-week Weight Progression
    weightHistory: [
      { date: getPastDateString(84), value: 68.0 },
      { date: getPastDateString(77), value: 67.2 },
      { date: getPastDateString(70), value: 66.5 },
      { date: getPastDateString(63), value: 65.8 },
      { date: getPastDateString(56), value: 65.1 },
      { date: getPastDateString(49), value: 64.9 },
      { date: getPastDateString(42), value: 64.2 },
      { date: getPastDateString(35), value: 63.8 },
      { date: getPastDateString(28), value: 63.5 },
      { date: getPastDateString(21), value: 63.0 },
      { date: getPastDateString(14), value: 62.8 },
      { date: getPastDateString(7), value: 62.5 }
    ],
    // Body Fat History
    bodyFatHistory: [
      { date: getPastDateString(84), value: 26.5 },
      { date: getPastDateString(56), value: 24.3 },
      { date: getPastDateString(28), value: 22.8 },
      { date: getPastDateString(7), value: 21.4 }
    ],
    // Steps History (Past week)
    stepsHistory: [
      { date: getPastDateString(6), value: 11200 },
      { date: getPastDateString(5), value: 10450 },
      { date: getPastDateString(4), value: 12100 },
      { date: getPastDateString(3), value: 9800 },
      { date: getPastDateString(2), value: 13000 },
      { date: getPastDateString(1), value: 10500 },
      { date: getPastDateString(0), value: 11240 }
    ],
    // Calories Burned History
    caloriesBurnedHistory: [
      { date: getPastDateString(6), value: 2450 },
      { date: getPastDateString(5), value: 2310 },
      { date: getPastDateString(4), value: 2600 },
      { date: getPastDateString(3), value: 2150 },
      { date: getPastDateString(2), value: 2800 },
      { date: getPastDateString(1), value: 2350 },
      { date: getPastDateString(0), value: 2510 }
    ],
    
    // Body Measurements (Multiple benchmarks)
    measurements: [
      {
        id: "meas-initial",
        date: getPastDateString(84),
        chest: 94, waist: 76, hips: 102, neck: 34, shoulders: 108,
        bicepLeft: 29.5, bicepRight: 30.0, forearmLeft: 23.5, forearmRight: 24.0,
        thighLeft: 58.0, thighRight: 58.5, calfLeft: 36.5, calfRight: 37.0
      },
      {
        id: "meas-mid",
        date: getPastDateString(42),
        chest: 91, waist: 71, hips: 98, neck: 33.5, shoulders: 106,
        bicepLeft: 29.0, bicepRight: 29.5, forearmLeft: 23.0, forearmRight: 23.5,
        thighLeft: 56.5, thighRight: 56.8, calfLeft: 36.0, calfRight: 36.2
      },
      {
        id: "meas-latest",
        date: getPastDateString(7),
        chest: 89, waist: 67, hips: 95, neck: 33.0, shoulders: 105,
        bicepLeft: 28.5, bicepRight: 28.8, forearmLeft: 22.8, forearmRight: 23.0,
        thighLeft: 54.5, thighRight: 54.7, calfLeft: 35.5, calfRight: 35.6
      }
    ],
    
    // Progress photos represented as pure gradient layouts or rich URLs
    photos: [
      {
        date: getPastDateString(84),
        front: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        side: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=300&auto=format&fit=crop",
        back: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        notes: "Starting point. Feeling slow but focused."
      },
      {
        date: getPastDateString(7),
        front: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop",
        side: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=300&auto=format&fit=crop",
        back: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop",
        notes: "Major lean adjustments. Shoulders look toned."
      }
    ],
    
    // Workouts
    workouts: [
      {
        id: "work-1",
        date: getPastDateString(0),
        name: "Full Body Toning A",
        completed: true,
        exercises: [
          {
            id: "ex-1",
            name: "Goblet Squats",
            category: "Strength",
            sets: [
              { id: "s1", weight: 16, reps: 12, completed: true },
              { id: "s2", weight: 20, reps: 10, completed: true },
              { id: "s3", weight: 20, reps: 10, completed: true }
            ],
            notes: "Felt strong. Up weight to 24kg next session.",
            personalRecord: 24
          },
          {
            id: "ex-2",
            name: "Dumbbell Shoulder Press",
            category: "Strength",
            sets: [
              { id: "s4", weight: 12, reps: 12, completed: true },
              { id: "s5", weight: 12, reps: 10, completed: true },
              { id: "s6", weight: 14, reps: 8, completed: true }
            ],
            personalRecord: 14
          },
          {
            id: "ex-3",
            name: "Romanian Deadlift",
            category: "Strength",
            sets: [
              { id: "s7", weight: 35, reps: 12, completed: true },
              { id: "s8", weight: 40, reps: 10, completed: true },
              { id: "s9", weight: 45, reps: 8, completed: true }
            ],
            personalRecord: 50
          }
        ]
      }
    ],
    
    // Nutrition logs
    nutrition: [
      {
        id: "nut-today",
        date: getPastDateString(0),
        waterIntakeMl: 2500,
        targetCalories: 1700,
        targetProtein: 125,
        targetCarbs: 160,
        targetFats: 50,
        meals: [
          { id: "m1", time: "08:00 AM", name: "Oatmeal with berries and protein powder", calories: 420, protein: 32, carbs: 55, fats: 8 },
          { id: "m2", time: "12:30 PM", name: "Grilled Chicken Breast, Quinoa, Asparagus", calories: 510, protein: 44, carbs: 48, fats: 11 },
          { id: "m3", time: "04:00 PM", name: "Rice cakes with peanut butter + protein shake", calories: 340, protein: 28, carbs: 22, fats: 14 },
          { id: "m4", time: "07:30 PM", name: "Baked Salmon Salad, olive oil vinaigrette", calories: 410, protein: 34, carbs: 12, fats: 25 }
        ]
      },
      {
        id: "nut-yesterday",
        date: getPastDateString(1),
        waterIntakeMl: 2800,
        targetCalories: 1700,
        targetProtein: 125,
        targetCarbs: 160,
        targetFats: 50,
        meals: [
          { id: "m5", time: "08:15 AM", name: "Greek Yogurt Bowl with walnuts & honey", calories: 380, protein: 26, carbs: 32, fats: 16 },
          { id: "m6", time: "01:00 PM", name: "Tuna Wrap with lettuce & mustard", calories: 430, protein: 38, carbs: 35, fats: 9 },
          { id: "m7", time: "07:00 PM", name: "Lean Sirloin, sweet potato, green beans", calories: 590, protein: 46, carbs: 50, fats: 18 }
        ]
      }
    ],
    
    // Goal structures
    goals: [
      {
        id: "g-1",
        title: "Achieve Target Weight",
        type: "Weight Loss",
        targetValue: 59.0,
        currentValue: 62.5,
        unit: "kg",
        startDate: getPastDateString(90),
        targetDate: getPastDateString(-30), // 30 days into the future
        status: "On Track",
        milestones: [
          { id: "ms-1", title: "Lose first 2kg", achieved: true },
          { id: "ms-2", title: "Reach 64.0kg", achieved: true },
          { id: "ms-3", title: "Hit 61.0kg check-in", achieved: false }
        ]
      },
      {
        id: "g-2",
        title: "Squat Bodyweight 10 Reps",
        type: "Strength",
        targetValue: 60,
        currentValue: 45,
        unit: "kg",
        startDate: getPastDateString(60),
        targetDate: getPastDateString(-15),
        status: "In Progress",
        milestones: [
          { id: "ms-4", title: "Squat 40kg", achieved: true },
          { id: "ms-5", title: "Squat 50kg for 8 reps", achieved: false }
        ]
      }
    ],
    
    // Wearable Sync
    wearable: {
      provider: "Apple Health",
      status: "Connected",
      lastSynced: "10 minutes ago",
      stepsToday: 11240,
      caloriesBurnedToday: 2510,
      activeMinutesToday: 48
    },
    
    payments: [
      { id: "p1", date: getPastDateString(10), amount: 150, status: "Paid", plan: "1-on-1 Elite Coaching" },
      { id: "p2", date: getPastDateString(40), amount: 150, status: "Paid", plan: "1-on-1 Elite Coaching" },
      { id: "p3", date: getPastDateString(70), amount: 150, status: "Paid", plan: "1-on-1 Elite Coaching" }
    ],
    attendance: [
      { date: getPastDateString(0), checkedIn: true, method: "QR" },
      { date: getPastDateString(2), checkedIn: true, method: "Manual" },
      { date: getPastDateString(4), checkedIn: true, method: "QR" },
      { date: getPastDateString(7), checkedIn: true, method: "QR" }
    ]
  },
  {
    id: "client-2",
    fullName: "Marcus Aurelius",
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    age: 45,
    gender: "Male",
    height: 180,
    weight: 88.2,
    startingWeight: 84.5,
    targetWeight: 90.0,
    bodyFatPercentage: 17.2,
    startingBodyFat: 14.8,
    fitnessGoals: ["Muscle Gain", "Discipline", "Mental Toughness"],
    contactInfo: {
      email: "marcus.philosophy@stoic.com",
      phone: "+1 (555) 753-3921",
      address: "Palatine Hill, Rome"
    },
    emergencyContact: {
      name: "Lucius Verus",
      relationship: "Brother",
      phone: "+1 (555) 753-1111"
    },
    medicalConditions: ["Lower back tightness", "Arthritis flare-up risk"],
    membershipStatus: "Active",
    joinDate: getPastDateString(120),
    trainerAssigned: "Coach Evans",
    engagementScore: 98,
    isAtRisk: false,
    
    // Hypertrophy Progression: Heavy but steady
    weightHistory: [
      { date: getPastDateString(84), value: 84.5 },
      { date: getPastDateString(70), value: 85.2 },
      { date: getPastDateString(56), value: 86.1 },
      { date: getPastDateString(42), value: 87.0 },
      { date: getPastDateString(28), value: 87.5 },
      { date: getPastDateString(14), value: 88.0 },
      { date: getPastDateString(0), value: 88.2 }
    ],
    bodyFatHistory: [
      { date: getPastDateString(84), value: 14.8 },
      { date: getPastDateString(42), value: 15.9 },
      { date: getPastDateString(0), value: 17.2 }
    ],
    stepsHistory: [
      { date: getPastDateString(6), value: 8200 },
      { date: getPastDateString(5), value: 9100 },
      { date: getPastDateString(4), value: 8700 },
      { date: getPastDateString(3), value: 10400 },
      { date: getPastDateString(2), value: 7500 },
      { date: getPastDateString(1), value: 8900 },
      { date: getPastDateString(0), value: 9210 }
    ],
    caloriesBurnedHistory: [
      { date: getPastDateString(6), value: 2900 },
      { date: getPastDateString(5), value: 3100 },
      { date: getPastDateString(4), value: 3000 },
      { date: getPastDateString(3), value: 3300 },
      { date: getPastDateString(2), value: 2750 },
      { date: getPastDateString(1), value: 3150 },
      { date: getPastDateString(0), value: 3240 }
    ],
    
    measurements: [
      {
        id: "m-initial-m",
        date: getPastDateString(84),
        chest: 104, waist: 91, hips: 105, neck: 38, shoulders: 118,
        bicepLeft: 38.0, bicepRight: 38.2, forearmLeft: 30.5, forearmRight: 30.8,
        thighLeft: 62.0, thighRight: 62.5, calfLeft: 39.5, calfRight: 39.8
      },
      {
        id: "m-latest-m",
        date: getPastDateString(0),
        chest: 108, waist: 90, hips: 104, neck: 39, shoulders: 122,
        bicepLeft: 40.5, bicepRight: 40.8, forearmLeft: 31.8, forearmRight: 32.0,
        thighLeft: 64.2, thighRight: 64.5, calfLeft: 40.0, calfRight: 40.3
      }
    ],
    
    photos: [
      {
        date: getPastDateString(84),
        front: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        side: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        back: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        notes: "Stoic dedication started. Back focus."
      },
      {
        date: getPastDateString(0),
        front: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop",
        side: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=300&auto=format&fit=crop",
        back: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop",
        notes: "Hypertrophy gains visible on biceps and shoulders."
      }
    ],
    
    workouts: [
      {
        id: "work-2",
        date: getPastDateString(0),
        name: "Stoic Heavy Pull Day",
        completed: true,
        exercises: [
          {
            id: "ex-4",
            name: "Deadlift",
            category: "Strength",
            sets: [
              { id: "s10", weight: 120, reps: 5, completed: true },
              { id: "s11", weight: 140, reps: 5, completed: true },
              { id: "s12", weight: 150, reps: 4, completed: true }
            ],
            notes: "Lower back feels warm, no pain. Controlled descent.",
            personalRecord: 160
          },
          {
            id: "ex-5",
            name: "Weighted Pull-ups",
            category: "Strength",
            sets: [
              { id: "s13", weight: 10, reps: 8, completed: true },
              { id: "s14", weight: 15, reps: 6, completed: true },
              { id: "s15", weight: 15, reps: 5, completed: true }
            ],
            personalRecord: 20
          }
        ]
      }
    ],
    
    nutrition: [
      {
        id: "n-marcus",
        date: getPastDateString(0),
        waterIntakeMl: 3500,
        targetCalories: 3100,
        targetProtein: 180,
        targetCarbs: 350,
        targetFats: 90,
        meals: [
          { id: "m8", time: "07:00 AM", name: "4 Whole Eggs, sourdough bread, avocado", calories: 650, protein: 32, carbs: 45, fats: 34 },
          { id: "m9", time: "11:30 AM", name: "Sirloin Steak (250g) with baked potatoes", calories: 850, protein: 62, carbs: 70, fats: 28 },
          { id: "m10", time: "03:30 PM", name: "Oats with peanut butter, banana & whey", calories: 720, protein: 40, carbs: 95, fats: 18 },
          { id: "m11", time: "08:00 PM", name: "Chicken Thigh Curry with Basmati Rice", calories: 880, protein: 48, carbs: 120, fats: 22 }
        ]
      }
    ],
    
    goals: [
      {
        id: "g-marcus-1",
        title: "Bulk to 90kg Clean",
        type: "Muscle Gain",
        targetValue: 90.0,
        currentValue: 88.2,
        unit: "kg",
        startDate: getPastDateString(84),
        targetDate: getPastDateString(-60),
        status: "On Track",
        milestones: [
          { id: "ms-m1", title: "Reach 86kg", achieved: true },
          { id: "ms-m2", title: "Reach 88kg checkpoint", achieved: true },
          { id: "ms-m3", title: "Scale 90kg dry", achieved: false }
        ]
      }
    ],
    
    wearable: {
      provider: "Garmin",
      status: "Connected",
      lastSynced: "1 hour ago",
      stepsToday: 9210,
      caloriesBurnedToday: 3240,
      activeMinutesToday: 65
    },
    payments: [
      { id: "pm1", date: getPastDateString(15), amount: 180, status: "Paid", plan: "Stoic Athlete Premium" },
      { id: "pm2", date: getPastDateString(45), amount: 180, status: "Paid", plan: "Stoic Athlete Premium" }
    ],
    attendance: [
      { date: getPastDateString(0), checkedIn: true, method: "QR" },
      { date: getPastDateString(1), checkedIn: true, method: "QR" },
      { date: getPastDateString(3), checkedIn: true, method: "QR" }
    ]
  },
  {
    id: "client-3",
    fullName: "Alex Rivera",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    age: 24,
    gender: "Male",
    height: 175,
    weight: 79.8,
    startingWeight: 80.5,
    targetWeight: 75.0,
    bodyFatPercentage: 24.5,
    startingBodyFat: 24.8,
    fitnessGoals: ["Fat Loss", "General Health", "Cardio endurance"],
    contactInfo: {
      email: "alex.rivera@gmail.com",
      phone: "+1 (555) 304-4512",
      address: "15 West Circle, Miami, FL"
    },
    emergencyContact: {
      name: "Maria Rivera",
      relationship: "Mother",
      phone: "+1 (555) 304-9988"
    },
    medicalConditions: ["Slight asthma (uses inhaler before heavy cardio)"],
    membershipStatus: "Active",
    joinDate: getPastDateString(30),
    trainerAssigned: "Coach Evans",
    engagementScore: 42,
    isAtRisk: true,  // AT RISK OF DROPPING OUT due to low engagement activity & plateau
    
    weightHistory: [
      { date: getPastDateString(28), value: 80.5 },
      { date: getPastDateString(21), value: 80.4 },
      { date: getPastDateString(14), value: 80.1 },
      { date: getPastDateString(7), value: 79.9 },
      { date: getPastDateString(0), value: 79.8 }
    ],
    bodyFatHistory: [
      { date: getPastDateString(28), value: 24.8 },
      { date: getPastDateString(0), value: 24.5 }
    ],
    stepsHistory: [
      { date: getPastDateString(6), value: 4500 },
      { date: getPastDateString(5), value: 5000 },
      { date: getPastDateString(4), value: 3800 },
      { date: getPastDateString(3), value: 4100 },
      { date: getPastDateString(2), value: 5600 },
      { date: getPastDateString(1), value: 3100 },
      { date: getPastDateString(0), value: 4200 }
    ],
    caloriesBurnedHistory: [
      { date: getPastDateString(6), value: 1950 },
      { date: getPastDateString(5), value: 2100 },
      { date: getPastDateString(4), value: 1800 },
      { date: getPastDateString(3), value: 1850 },
      { date: getPastDateString(2), value: 2050 },
      { date: getPastDateString(1), value: 1750 },
      { date: getPastDateString(0), value: 1900 }
    ],
    
    measurements: [
      {
        id: "m-initial-ar",
        date: getPastDateString(28),
        chest: 101, waist: 95, hips: 104, neck: 37, shoulders: 114,
        bicepLeft: 32.0, bicepRight: 32.4, forearmLeft: 26.5, forearmRight: 26.8,
        thighLeft: 59.0, thighRight: 59.5, calfLeft: 38.0, calfRight: 38.3
      }
    ],
    
    photos: [
      {
        date: getPastDateString(28),
        front: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        side: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        back: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
        notes: "Introductory photo."
      }
    ],
    
    workouts: [],
    nutrition: [
      {
        id: "n-alex",
        date: getPastDateString(0),
        waterIntakeMl: 1200,
        targetCalories: 2000,
        targetProtein: 140,
        targetCarbs: 220,
        targetFats: 60,
        meals: [
          { id: "m12", time: "09:00 AM", name: "Fast Food McMuffin + hashbrown", calories: 510, protein: 18, carbs: 60, fats: 25 },
          { id: "m13", time: "02:00 PM", name: "Pepperoni Pizza Slice, regular soda", calories: 690, protein: 22, carbs: 90, fats: 24 }
        ]
      }
    ],
    
    goals: [
      {
        id: "g-alex-1",
        title: "Reach 75kg",
        type: "Weight Loss",
        targetValue: 75.0,
        currentValue: 79.8,
        unit: "kg",
        startDate: getPastDateString(28),
        targetDate: getPastDateString(-30),
        status: "At Risk",
        milestones: [
          { id: "ms-ar1", title: "Lose first 2kg", achieved: false }
        ]
      }
    ],
    wearable: {
      provider: "None",
      status: "Disconnected",
      lastSynced: "Never",
      stepsToday: 4200,
      caloriesBurnedToday: 1900,
      activeMinutesToday: 15
    },
    payments: [
      { id: "p-ar1", date: getPastDateString(25), amount: 99, status: "Paid", plan: "Basic Nutrition + Coach Core" }
    ],
    attendance: [
      { date: getPastDateString(10), checkedIn: true, method: "Manual" }
    ]
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "chal-1",
    title: "100k Steps Sprint",
    description: "Hit 100,000 steps over 10 days! Let's build relentless consistency.",
    target: "100,000 steps",
    startDate: getPastDateString(5),
    endDate: getPastDateString(-5),
    participants: [
      { clientId: "client-1", progress: 57450, rank: 2 },
      { clientId: "client-2", progress: 61400, rank: 1 },
      { clientId: "client-3", progress: 14200, rank: 3 }
    ]
  },
  {
    id: "chal-2",
    title: "Hydration Hero",
    description: "Drink at least 3L of water daily for an entire week.",
    target: "3,000ml / Day",
    startDate: getPastDateString(2),
    endDate: getPastDateString(-5),
    participants: [
      { clientId: "client-1", progress: 85, rank: 2 },
      { clientId: "client-2", progress: 100, rank: 1 },
      { clientId: "client-3", progress: 30, rank: 3 }
    ]
  }
];

export const TRAINER_STATS = {
  totalClients: 3,
  activeClients: 3,
  newClientsThisMonth: 1,
  clientsAtRisk: 1,
  averageEngagementScore: 77,
  monthlyRevenue: 429,
  retentionRate: 94
};
