export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

export type WeightGoal = 'lose' | 'maintain' | 'gain';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface UserProfile {
  username: string;
  contactNumber?: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: WeightGoal;
  targetWeight?: number; // in kg
  targetCalories: number;
  targetProtein: number; // in grams
  targetCarbs: number; // in grams
  targetFat: number; // in grams
  photo?: string; // base64 representation
  waterTarget?: number; // in ml
  sleepTarget?: number; // in hours
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number; // kcal per serving
  protein: number; // grams per serving
  carbs: number; // grams per serving
  fat: number; // grams per serving
  servingSize: number; // numeric quantity
  servingUnit: string; // e.g., 'piece', 'bowl', 'cup', 'plate', 'g';
  category?: string; // e.g. 'raw' | 'fast food' | 'packet food' | 'indian food'
  createdAt?: string; // ISO timestamp for sorting
}

export interface MealLog {
  id: string;
  foodId?: string;
  name: string;
  calories: number; // total for this log
  protein: number; // total for this log
  carbs: number; // total for this log
  fat: number; // total for this log
  servingQuantity: number; // multiplier of food servingSize
  servingUnit: string;
  mealType: MealType;
  date: string; // YYYY-MM-DD
  loggedAt: string; // ISO string
  photo?: string; // base64 representation
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  amountMl: number; // total ml for the day
}

export interface WeightLog {
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  photo?: string; // optional progress photo (base64)
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  bedTime: string; // 24h format "HH:MM"
  wakeTime: string; // 24h format "HH:MM"
  durationHours: number; // calculated logged sleep duration in hours
  targetHours: number; // desired sleep cycle target in hours
  synced?: boolean; // mock sync status
}

export interface ExerciseLog {
  id: string;
  username: string;
  date: string; // ISO date
  name: string; // exercise name
  reps?: number;
  sets?: number;
  durationMins?: number;
  weightKg?: number;
}

