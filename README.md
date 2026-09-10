# FitLife — Smart Health & Nutrition Tracking Platform

> An all-in-one personal health, nutrition, and fitness tracking web application featuring Indian food calorie tracking, BMR & macro targets, hydration logs, sleep analytics, workout routines, and an AI Health Coach.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Key Features

- **🔥 Nutrition & Calorie Tracking**: Real-time circular SVG calorie budget ring with deficit/surplus pacing.
- **🍛 Indian Foods Database**: Comprehensive library of Indian meals, curries, rotis, snacks, sweets, and beverages with precise portion and gram/cup unit scaling.
- **📸 QR & Barcode Scanner**: Instant product recognition powered by Open Food Facts and camera scanning.
- **💧 Smart Hydration Tracker**: Visual 250ml water cups with configurable daily target intake.
- **🌙 Sleep Quality & Recovery Tracker**: Log bedtimes and wake times with a 7-day SVG duration history graph and simulated wearable sync.
- **🏋️ Exercise & Workout Tracker**: Activity duration, set/rep counters, yoga poses, MET-based calories burned calculation, and 7-day active duration bar chart.
- **⚖️ Body Weight Progress**: Log daily weight with trend analysis and interactive progression chart.
- **🤖 AI Health Coach (Gemini Flash)**: Personalized, encouraging daily wellness advice tailored directly to your logged nutrition, hydration, and sleep habits.
- **🔐 Frictionless Authentication**: Simple email/password login and one-click demo access with zero SMS/OTP hurdles.
- **🛠️ Admin Console**: Database management dashboard to browse users, monitor stats, and add/edit food items.
- **🌓 Dark & Light Mode**: Curated high-contrast themes with glassmorphic cards and vibrant emerald green accents.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ashishgoyal1k-cell/FitLife.git
cd FitLife
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Configure Gemini API Key
FitLife includes an automatic built-in Smart Coach fallback. If you want live Google Gemini responses, copy `.env.example` to `.env` and provide your API key:
```bash
cp .env.example .env
```
Add your key inside `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Pure JSX (`.jsx`)
- **Styling**: Modular CSS (`.css`) with CSS custom properties and Glassmorphism
- **Icons**: Lucide React
- **Build Tool**: Vite 8
- **Data Persistence**: HTML5 LocalStorage with modular database abstractions

---

## 📄 License

MIT © [Ashish Goyal](https://github.com/ashishgoyal1k-cell)
