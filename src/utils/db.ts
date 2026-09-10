import type { UserProfile, MealLog, WaterLog, WeightLog, Gender, ActivityLevel, WeightGoal, FoodItem, SleepLog, ExerciseLog } from '../types';
import { INDIAN_FOODS } from '../data/indianFoods';

// BMR and TDEE Calculators
export function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };
  return bmr * multipliers[activityLevel];
}

export interface MacroSplit {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export function calculateMacroTargets(weight: number, height: number, age: number, gender: Gender, activityLevel: ActivityLevel, goal: WeightGoal): MacroSplit {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  
  let targetCalories = Math.round(tdee);
  if (goal === 'lose') {
    targetCalories = Math.max(1200, Math.round(tdee - 500));
  } else if (goal === 'gain') {
    targetCalories = Math.round(tdee + 400);
  }

  // Macronutrient breakdown: 25% Protein, 45% Carbs, 30% Fat
  const proteinCals = targetCalories * 0.25;
  const carbsCals = targetCalories * 0.45;
  const fatCals = targetCalories * 0.30;

  return {
    calories: targetCalories,
    protein: Math.round(proteinCals / 4),
    carbs: Math.round(carbsCals / 4),
    fat: Math.round(fatCals / 9)
  };
}

// Local Storage Keys
const KEYS = {
  CURRENT_USER: 'fitlife_current_user',
  USERS_LIST: 'fitlife_users',
  MEAL_LOGS: 'fitlife_meal_logs',
  WATER_LOGS: 'fitlife_water_logs',
  WEIGHT_LOGS: 'fitlife_weight_logs',
  FOODS_LIST: 'fitlife_foods_list'
};

// Auto-create admin user if not exists
if (typeof window !== 'undefined') {
  const mockPasswordKey = 'fitlife_pwd_admin';
  if (!localStorage.getItem(mockPasswordKey)) {
    localStorage.setItem(mockPasswordKey, 'admin');
    const adminProfile: UserProfile = {
      username: 'admin',
      age: 30,
      weight: 70,
      height: 170,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
      targetCalories: 2000,
      targetProtein: 125,
      targetCarbs: 225,
      targetFat: 67
    };
    try {
      const data = localStorage.getItem(KEYS.USERS_LIST);
      const users = data ? JSON.parse(data) : {};
      if (!users['admin']) {
        users['admin'] = adminProfile;
        localStorage.setItem(KEYS.USERS_LIST, JSON.stringify(users));
      }
    } catch (e) {
      console.error('Failed to create default admin profile', e);
    }
  }
}

import { syncUserToCloud, syncFoodToCloud } from './firebase';

// Current Session Helpers
export function getCurrentUser(): UserProfile | null {
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(profile: UserProfile | null): void {
  if (profile) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(profile));
    // Also save/update in the user database
    const users = getAllUsers();
    users[profile.username] = profile;
    localStorage.setItem(KEYS.USERS_LIST, JSON.stringify(users));
    // Asynchronously sync to Cloud Firestore
    try {
      syncUserToCloud(profile);
    } catch {}
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export function getAllUsers(): Record<string, UserProfile> {
  const data = localStorage.getItem(KEYS.USERS_LIST);
  return data ? JSON.parse(data) : {};
}

// Meal Log Helpers
export function getMealLogs(username: string, date: string): MealLog[] {
  const data = localStorage.getItem(`${KEYS.MEAL_LOGS}_${username}`);
  const allLogs: MealLog[] = data ? JSON.parse(data) : [];
  return allLogs.filter(log => log.date === date);
}

export function saveMealLog(username: string, log: MealLog): void {
  const key = `${KEYS.MEAL_LOGS}_${username}`;
  const data = localStorage.getItem(key);
  const allLogs: MealLog[] = data ? JSON.parse(data) : [];
  allLogs.push(log);
  localStorage.setItem(key, JSON.stringify(allLogs));
}

export function deleteMealLog(username: string, logId: string): void {
  const key = `${KEYS.MEAL_LOGS}_${username}`;
  const data = localStorage.getItem(key);
  if (!data) return;
  const allLogs: MealLog[] = JSON.parse(data);
  const filtered = allLogs.filter(log => log.id !== logId);
  localStorage.setItem(key, JSON.stringify(filtered));
}

// Water Log Helpers
export function getWaterLog(username: string, date: string): number {
  const key = `${KEYS.WATER_LOGS}_${username}`;
  const data = localStorage.getItem(key);
  const logs: WaterLog[] = data ? JSON.parse(data) : [];
  const log = logs.find(l => l.date === date);
  return log ? log.amountMl : 0;
}

export function updateWaterLog(username: string, date: string, amountMl: number): void {
  const key = `${KEYS.WATER_LOGS}_${username}`;
  const data = localStorage.getItem(key);
  const logs: WaterLog[] = data ? JSON.parse(data) : [];
  const index = logs.findIndex(l => l.date === date);
  if (index >= 0) {
    logs[index].amountMl = amountMl;
  } else {
    logs.push({ date, amountMl });
  }
  localStorage.setItem(key, JSON.stringify(logs));
}

// Weight Log Helpers
export function getWeightLogs(username: string): WeightLog[] {
  const key = `${KEYS.WEIGHT_LOGS}_${username}`;
  const data = localStorage.getItem(key);
  const logs: WeightLog[] = data ? JSON.parse(data) : [];
  // Return sorted by date ascending
  return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function saveWeightLog(username: string, date: string, weight: number, photo?: string): void {
  const key = `${KEYS.WEIGHT_LOGS}_${username}`;
  const data = localStorage.getItem(key);
  const logs: WeightLog[] = data ? JSON.parse(data) : [];
  
  const index = logs.findIndex(l => l.date === date);
  if (index >= 0) {
    logs[index].weight = weight;
    if (photo) {
      logs[index].photo = photo;
    }
  } else {
    logs.push({ date, weight, photo });
  }
  
  localStorage.setItem(key, JSON.stringify(logs));

  // If this log is for today or the most recent, also update the main user profile weight
  const profile = getCurrentUser();
  if (profile && profile.username === username) {
    // Sort logs to find the latest weight
    const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sorted.length > 0 && sorted[0].date === date) {
      profile.weight = weight;
      // Recalculate targets with new weight
      const macros = calculateMacroTargets(
        weight,
        profile.height,
        profile.age,
        profile.gender,
        profile.activityLevel,
        profile.goal
      );
      profile.targetCalories = macros.calories;
      profile.targetProtein = macros.protein;
      profile.targetCarbs = macros.carbs;
      profile.targetFat = macros.fat;
      setCurrentUser(profile);
    }
  }
}

export function deleteWeightLog(username: string, date: string): void {
  const key = `${KEYS.WEIGHT_LOGS}_${username}`;
  const data = localStorage.getItem(key);
  if (!data) return;
  const logs: WeightLog[] = JSON.parse(data);
  const filtered = logs.filter(l => l.date !== date);
  localStorage.setItem(key, JSON.stringify(filtered));
}

// Food database helpers
export function getFoods(): FoodItem[] {
  const data = localStorage.getItem(KEYS.FOODS_LIST);
  if (!data) {
    localStorage.setItem(KEYS.FOODS_LIST, JSON.stringify(INDIAN_FOODS));
    return INDIAN_FOODS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INDIAN_FOODS;
  }
}

export function saveFoods(foods: FoodItem[]): void {
  localStorage.setItem(KEYS.FOODS_LIST, JSON.stringify(foods));
}

export function addFood(food: FoodItem): void {
  const foods = getFoods();
  foods.push(food);
  saveFoods(foods);
  try {
    syncFoodToCloud(food);
  } catch {}
}

export function updateFood(updatedFood: FoodItem): void {
  const foods = getFoods();
  const index = foods.findIndex(f => f.id === updatedFood.id);
  if (index >= 0) {
    foods[index] = updatedFood;
    saveFoods(foods);
    try {
      syncFoodToCloud(updatedFood);
    } catch {}
  }
}

export function deleteFood(foodId: string): void {
  const foods = getFoods();
  const filtered = foods.filter(f => f.id !== foodId);
  saveFoods(filtered);
}

export function resetFoodsToDefaults(): void {
  localStorage.setItem(KEYS.FOODS_LIST, JSON.stringify(INDIAN_FOODS));
}

// Sleep Log Helpers
export function getSleepLog(username: string, date: string): SleepLog | null {
  const key = `fitlife_sleep_logs_${username}`;
  const data = localStorage.getItem(key) || localStorage.getItem(`healthify_sleep_logs_${username}`);
  const logs: SleepLog[] = data ? JSON.parse(data) : [];
  return logs.find(l => l.date === date) || null;
}

export function saveSleepLog(username: string, log: SleepLog): void {
  const key = `fitlife_sleep_logs_${username}`;
  const data = localStorage.getItem(key) || localStorage.getItem(`healthify_sleep_logs_${username}`);
  const logs: SleepLog[] = data ? JSON.parse(data) : [];
  const index = logs.findIndex(l => l.date === log.date);
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(key, JSON.stringify(logs));
}

// Exercise Log Helpers
export function getExerciseLogs(username: string, date?: string): ExerciseLog[] {
  const data = localStorage.getItem('exerciseLogs');
  const all: ExerciseLog[] = data ? JSON.parse(data) : [];
  const userLogs = all.filter(l => l.username === username);
  return date ? userLogs.filter(l => l.date === date) : userLogs;
}

export function addExerciseLog(log: Omit<ExerciseLog, 'id'>): void {
  const logs = JSON.parse(localStorage.getItem('exerciseLogs') || '[]') as ExerciseLog[];
  const newLog: ExerciseLog = { ...log, id: crypto.randomUUID() };
  logs.push(newLog);
  localStorage.setItem('exerciseLogs', JSON.stringify(logs));
}

export function deleteExerciseLog(id: string): void {
  const logs = JSON.parse(localStorage.getItem('exerciseLogs') || '[]') as ExerciseLog[];
  const filtered = logs.filter(l => l.id !== id);
  localStorage.setItem('exerciseLogs', JSON.stringify(filtered));
}
