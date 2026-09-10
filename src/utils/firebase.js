import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

// Default / fallback Firebase configuration
export function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem('fitlife_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && projectId) {
    return {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  return null;
}

export function isFirebaseConfigured() {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
}

// Initialize Firestore lazily
let dbInstance = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
    return null;
  }
}

// Save or sync user profile to Cloud Firestore
export async function syncUserToCloud(profile) {
  if (!profile || !profile.username) return false;
  const db = getDb();
  if (!db) return false;

  try {
    const docId = profile.username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
    const userRef = doc(db, 'users', docId);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firebase] Could not sync user to cloud:', err);
    return false;
  }
}

// Fetch all registered users from Cloud Firestore
export async function fetchUsersFromCloud() {
  const db = getDb();
  if (!db) return null;

  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    const users = {};
    snap.forEach((d) => {
      const data = d.data();
      if (data && data.username) {
        users[data.username] = data;
      }
    });
    return users;
  } catch (err) {
    console.warn('[Firebase] Could not fetch users from cloud:', err);
    return null;
  }
}

// Save new food item to Cloud
export async function syncFoodToCloud(food) {
  if (!food || !food.id) return false;
  const db = getDb();
  if (!db) return false;

  try {
    const foodRef = doc(db, 'foods', String(food.id));
    await setDoc(foodRef, food, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firebase] Could not sync food to cloud:', err);
    return false;
  }
}

// Fetch all foods from Cloud
export async function fetchFoodsFromCloud() {
  const db = getDb();
  if (!db) return null;

  try {
    const foodsCol = collection(db, 'foods');
    const snap = await getDocs(foodsCol);
    const foods = [];
    snap.forEach((d) => {
      foods.push(d.data());
    });
    return foods.length > 0 ? foods : null;
  } catch (err) {
    console.warn('[Firebase] Could not fetch foods from cloud:', err);
    return null;
  }
}
