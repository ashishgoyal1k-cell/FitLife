import React, { useState, useEffect } from 'react';
import { getMealLogs, getWaterLog, updateWaterLog, getWeightLogs, saveWeightLog, setCurrentUser, getSleepLog, saveSleepLog, calculateMacroTargets, getExerciseLogs } from '../utils/db';
import { ChevronLeft, ChevronRight, Droplet, Dumbbell, Calendar, Apple, Moon, RefreshCw, Smartphone } from 'lucide-react';
import { AiCoach } from './AiCoach';
import './Dashboard.css';

const formatTimeTo12h = (time24) => {
  if (!time24 || !time24.includes(':')) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  const h = parseInt(hoursStr, 10);
  const m = minutesStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m} ${ampm}`;
};

const calculateSleepDuration = (bedTime, wakeTime) => {
  if (!bedTime || !wakeTime) return 0;
  const [bedH, bedM] = bedTime.split(':').map(Number);
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);
  
  const bedMin = bedH * 60 + bedM;
  const wakeMin = wakeH * 60 + wakeM;
  
  let totalMin = 0;
  if (wakeMin < bedMin) {
    totalMin = (1440 - bedMin) + wakeMin;
  } else {
    totalMin = wakeMin - bedMin;
  }
  return Math.round((totalMin / 60) * 10) / 10;
};

export const Dashboard = ({ user, selectedDate, setSelectedDate, setActiveTab, onWeightLogged, onUserUpdated }) => {
  const [mealLogs, setMealLogs] = useState([]);
  const [waterMl, setWaterMl] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(user.weight);
  const [weightInput, setWeightInput] = useState('');
  const [showWeightInput, setShowWeightInput] = useState(false);

  const [waterTarget, setWaterTarget] = useState(user.waterTarget || 2000);
  const [showWaterEdit, setShowWaterEdit] = useState(false);
  const [editWaterIntake, setEditWaterIntake] = useState('');
  const [editWaterTarget, setEditWaterTarget] = useState('');

  // Calorie & Macros target editing states
  const [showCalorieEdit, setShowCalorieEdit] = useState(false);
  const [editTargetCalories, setEditTargetCalories] = useState(user.targetCalories.toString());
  const [editTargetProtein, setEditTargetProtein] = useState(user.targetProtein.toString());
  const [editTargetCarbs, setEditTargetCarbs] = useState(user.targetCarbs.toString());
  const [editTargetFat, setEditTargetFat] = useState(user.targetFat.toString());

  // Sleep tracker states
  const [sleepHours, setSleepHours] = useState(0);
  const [sleepTarget, setSleepTarget] = useState(user.sleepTarget || 8);
  const [sleepBedTime, setSleepBedTime] = useState('22:30');
  const [sleepWakeTime, setSleepWakeTime] = useState('06:30');
  const [showSleepEdit, setShowSleepEdit] = useState(false);
  const [isSyncingSleep, setIsSyncingSleep] = useState(false);
  const [editSleepBedTimeInput, setEditSleepBedTimeInput] = useState('22:30');
  const [editSleepWakeTimeInput, setEditSleepWakeTimeInput] = useState('06:30');
  const [editSleepTargetInput, setEditSleepTargetInput] = useState('');
  const [isSyncedWithWearable, setIsSyncedWithWearable] = useState(false);

  // Exercise states
  const [exerciseLogs, setExerciseLogs] = useState([]);

  // Load logs on date change
  useEffect(() => {
    setMealLogs(getMealLogs(user.username, selectedDate));
    setWaterMl(getWaterLog(user.username, selectedDate));
    setWaterTarget(user.waterTarget || 2000);
    setExerciseLogs(getExerciseLogs(user.username, selectedDate));
    
    // Find weight for this date
    const weights = getWeightLogs(user.username);
    const weightLog = weights.find(w => w.date === selectedDate);
    if (weightLog) {
      setCurrentWeight(weightLog.weight);
    } else {
      // Default to profile weight
      setCurrentWeight(user.weight);
    }

    // Find sleep log for this date
    const sleepLog = getSleepLog(user.username, selectedDate);
    if (sleepLog) {
      setSleepHours(sleepLog.durationHours);
      setSleepTarget(sleepLog.targetHours);
      setSleepBedTime(sleepLog.bedTime || '22:30');
      setSleepWakeTime(sleepLog.wakeTime || '06:30');
      setIsSyncedWithWearable(!!sleepLog.synced);
    } else {
      setSleepHours(0);
      setSleepTarget(user.sleepTarget || 8);
      setSleepBedTime('22:30');
      setSleepWakeTime('06:30');
      setIsSyncedWithWearable(false);
    }
  }, [selectedDate, user]);

  // Calorie calculations
  const totalCalories = mealLogs.reduce((acc, log) => acc + log.calories, 0);
  const totalProtein = mealLogs.reduce((acc, log) => acc + log.protein, 0);
  const totalCarbs = mealLogs.reduce((acc, log) => acc + log.carbs, 0);
  const totalFat = mealLogs.reduce((acc, log) => acc + log.fat, 0);

  // Exercise Calorie calculations
  const getMETForExercise = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('run') || nameLower.includes('jog')) return 8.0;
    if (nameLower.includes('walk')) return 3.5;
    if (nameLower.includes('cycl')) return 7.5;
    if (nameLower.includes('swimm')) return 6.0;
    if (nameLower.includes('skipping') || nameLower.includes('rope')) return 10.0;
    if (nameLower.includes('push-up') || nameLower.includes('pushup')) return 4.0;
    if (nameLower.includes('squat')) return 5.0;
    if (nameLower.includes('pull-up') || nameLower.includes('pullup')) return 6.0;
    if (nameLower.includes('plank')) return 3.0;
    if (nameLower.includes('surya') || nameLower.includes('sun salutation')) return 4.0;
    if (nameLower.includes('yoga')) return 2.5;
    return 5.0; // default met
  };

  const getCaloriesBurned = (log) => {
    const met = getMETForExercise(log.name);
    let durationMins = log.durationMins || 0;
    if (durationMins === 0 && log.sets) {
      durationMins = log.sets * 1.5;
    }
    if (durationMins === 0) return 0;
    return Math.round((met * 3.5 * user.weight) / 200 * durationMins);
  };

  const totalExerciseDuration = exerciseLogs.reduce((sum, log) => sum + (log.durationMins || (log.sets ? log.sets * 1.5 : 0)), 0);
  const totalExerciseCalories = exerciseLogs.reduce((sum, log) => sum + getCaloriesBurned(log), 0);

  const budget = user.targetCalories;
  const remaining = budget - totalCalories;
  const progressPercent = Math.min(100, Math.round((totalCalories / budget) * 100)) || 0;

  // Circle SVG math
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Shift selected date
  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
  };

  const formatDisplayDate = (dateStr) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';

    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleWaterClick = (index) => {
    const newCups = index + 1;
    const newMl = newCups * 250;
    
    let targetMl = newMl;
    if (waterMl === newMl) {
      targetMl = (newCups - 1) * 250;
    }
    
    setWaterMl(targetMl);
    updateWaterLog(user.username, selectedDate, targetMl);
  };

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    const wt = parseFloat(weightInput);
    if (wt > 20 && wt < 300) {
      saveWeightLog(user.username, selectedDate, wt);
      setCurrentWeight(wt);
      setWeightInput('');
      setShowWeightInput(false);
      if (onWeightLogged) {
        onWeightLogged();
      }
    }
  };

  const handleWaterEditSubmit = (e) => {
    e.preventDefault();
    const targetVal = Math.max(500, parseInt(editWaterTarget) || 2000);
    const intakeVal = Math.max(0, parseInt(editWaterIntake) || 0);

    const updatedUser = { ...user, waterTarget: targetVal };
    setCurrentUser(updatedUser);
    setWaterTarget(targetVal);
    setWaterMl(intakeVal);
    updateWaterLog(user.username, selectedDate, intakeVal);
    
    setShowWaterEdit(false);
  };

  const handleCalorieSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      targetCalories: Math.max(500, Math.min(10000, parseInt(editTargetCalories) || 2000)),
      targetProtein: Math.max(10, Math.min(500, parseInt(editTargetProtein) || 125)),
      targetCarbs: Math.max(10, Math.min(1000, parseInt(editTargetCarbs) || 225)),
      targetFat: Math.max(5, Math.min(300, parseInt(editTargetFat) || 67))
    };
    setCurrentUser(updatedUser);
    setShowCalorieEdit(false);
    if (onUserUpdated) {
      onUserUpdated();
    }
  };

  const handleRestoreCalorieDefaults = () => {
    const defaults = calculateMacroTargets(
      user.weight,
      user.height,
      user.age,
      user.gender,
      user.activityLevel,
      user.goal
    );
    setEditTargetCalories(defaults.calories.toString());
    setEditTargetProtein(defaults.protein.toString());
    setEditTargetCarbs(defaults.carbs.toString());
    setEditTargetFat(defaults.fat.toString());
  };

  const handleSleepSubmit = (e) => {
    e.preventDefault();
    const bed = editSleepBedTimeInput || '22:30';
    const wake = editSleepWakeTimeInput || '06:30';
    const hours = calculateSleepDuration(bed, wake);
    const target = Math.max(4, Math.min(16, parseFloat(editSleepTargetInput) || 8));
    
    setSleepHours(hours);
    setSleepTarget(target);
    setSleepBedTime(bed);
    setSleepWakeTime(wake);
    setIsSyncedWithWearable(false);

    saveSleepLog(user.username, {
      date: selectedDate,
      bedTime: bed,
      wakeTime: wake,
      durationHours: hours,
      targetHours: target,
      synced: false
    });

    const updatedUser = { ...user, sleepTarget: target };
    setCurrentUser(updatedUser);
    setShowSleepEdit(false);
  };

  const handleSyncDevice = () => {
    setIsSyncingSleep(true);
    setTimeout(() => {
      const mockBed = '23:00';
      const mockWake = '06:30';
      const mockHours = calculateSleepDuration(mockBed, mockWake);
      const targetVal = sleepTarget;

      setSleepHours(mockHours);
      setSleepBedTime(mockBed);
      setSleepWakeTime(mockWake);
      setIsSyncedWithWearable(true);
      setIsSyncingSleep(false);

      saveSleepLog(user.username, {
        date: selectedDate,
        bedTime: mockBed,
        wakeTime: mockWake,
        durationHours: mockHours,
        targetHours: targetVal,
        synced: true
      });
    }, 1200);
  };

  const getMealTotalCals = (type) => {
    return mealLogs
      .filter(log => log.mealType === type)
      .reduce((sum, log) => sum + log.calories, 0);
  };

  // Get last 7 days of sleep logs ending on selectedDate
  const getLast7DaysSleep = () => {
    const list = [];
    const dateObj = new Date(selectedDate);
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(dateObj);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = getSleepLog(user.username, dateStr);
      
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = d.getDate();
      
      list.push({
        date: dateStr,
        dayLabel: `${dayLabel} ${dateNum}`,
        hours: log ? log.durationHours : 0,
        target: log ? log.targetHours : sleepTarget
      });
    }
    return list;
  };

  return (
    <div className="animate-slide-up dashboard-wrapper">
      
      {/* Top Row: Date Selector & Quick Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {user.username}!</h2>
          <p className="text-muted-desc">Here's your nutritional summary for today.</p>
        </div>
        
        {/* Date Selector widget */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '4px 8px'
        }}>
          <button onClick={() => changeDate(-1)} className="btn btn-secondary btn-icon-only" style={{ border: 'none', width: '32px', height: '32px' }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px', fontWeight: 600, fontSize: '0.95rem' }}>
            <Calendar size={16} style={{ color: 'var(--primary)' }} />
            <span>{formatDisplayDate(selectedDate)}</span>
          </div>
          <button onClick={() => changeDate(1)} className="btn btn-secondary btn-icon-only" style={{ border: 'none', width: '32px', height: '32px' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Section: Calories & Macros (Full Width) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', border: 'none', padding: 0 }}>Calories & Macros</h3>
            <button
              onClick={() => {
                setEditTargetCalories(user.targetCalories.toString());
                setEditTargetProtein(user.targetProtein.toString());
                setEditTargetCarbs(user.targetCarbs.toString());
                setEditTargetFat(user.targetFat.toString());
                setShowCalorieEdit(!showCalorieEdit);
              }}
              className="btn btn-secondary"
              style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px' }}
            >
              {showCalorieEdit ? 'Cancel' : 'Edit Targets'}
            </button>
          </div>
          
          {showCalorieEdit ? (
            <form onSubmit={handleCalorieSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Daily Calories Target (kcal)</label>
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    className="form-input"
                    value={editTargetCalories}
                    onChange={(e) => setEditTargetCalories(e.target.value)}
                    style={{ padding: '8px 12px' }}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Protein Target (g)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    className="form-input"
                    value={editTargetProtein}
                    onChange={(e) => setEditTargetProtein(e.target.value)}
                    style={{ padding: '8px 12px' }}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Carbohydrates Target (g)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    className="form-input"
                    value={editTargetCarbs}
                    onChange={(e) => setEditTargetCarbs(e.target.value)}
                    style={{ padding: '8px 12px' }}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Fats Target (g)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    className="form-input"
                    value={editTargetFat}
                    onChange={(e) => setEditTargetFat(e.target.value)}
                    style={{ padding: '8px 12px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleRestoreCalorieDefaults}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  Restore Profile Defaults
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCalorieEdit(false)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    Save Targets
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="calories-macros-grid">
              {/* Left Column: Circular Ring and Quick Metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', justifyContent: 'space-around' }} className="flex-row-desktop">
                {/* SVG Progress Circle */}
                <div className="calorie-circle-container">
                  <svg className="calorie-circle-svg">
                    <circle className="circle-bg" cx="80" cy="80" r={circleRadius} />
                    <circle
                      className="circle-progress"
                      cx="80"
                      cy="80"
                      r={circleRadius}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="calorie-circle-text">
                    <span className="calorie-circle-num" style={{ color: remaining >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                      {Math.abs(remaining)}
                    </span>
                    <span className="calorie-circle-lbl" style={{ color: 'var(--text-secondary)' }}>
                      {remaining >= 0 ? 'kcal Left' : 'kcal Over'}
                    </span>
                  </div>
                </div>

                {/* Quick Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '180px', width: '100%', maxWidth: '240px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Daily Target:</span>
                    <span className="text-mono" style={{ fontWeight: 700 }}>{budget} kcal</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Consumed:</span>
                    <span className="text-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{totalCalories} kcal</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Meals Logged:</span>
                    <span style={{ fontWeight: 700 }}>{mealLogs.length} items</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Macro Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                {/* Protein bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                      Protein
                    </span>
                    <span className="text-mono">{totalProtein}g / {user.targetProtein}g</span>
                  </div>
                  <div className="macro-progress-bar-container">
                    <div
                      className="macro-progress-fill"
                      style={{
                        backgroundColor: 'var(--primary)',
                        width: `${Math.min(100, (totalProtein / user.targetProtein) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Carbs bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
                      Carbohydrates
                    </span>
                    <span className="text-mono">{totalCarbs}g / {user.targetCarbs}g</span>
                  </div>
                  <div className="macro-progress-bar-container">
                    <div
                      className="macro-progress-fill"
                      style={{
                        backgroundColor: 'var(--secondary)',
                        width: `${Math.min(100, (totalCarbs / user.targetCarbs) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Fat bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--tertiary)' }} />
                      Fats
                    </span>
                    <span className="text-mono">{totalFat}g / {user.targetFat}g</span>
                  </div>
                  <div className="macro-progress-bar-container">
                    <div
                      className="macro-progress-fill"
                      style={{
                        backgroundColor: 'var(--tertiary)',
                        width: `${Math.min(100, (totalFat / user.targetFat) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <AiCoach
          user={user}
          meals={mealLogs}
          exercises={exerciseLogs}
          waterMl={waterMl}
          sleepHours={sleepHours}
        />

        {/* Bottom Widgets Section: 2-Column Responsive Grid */}
        <div className="bottom-widgets-grid">
          
          {/* Meal breakdown */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Meal Logs</h3>
              <button onClick={() => setActiveTab('food-logs')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}>
                + Add Food
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { type: 'breakfast', label: 'Breakfast', icon: <Apple size={16} /> },
                { type: 'lunch', label: 'Lunch', icon: <Apple size={16} /> },
                { type: 'dinner', label: 'Dinner', icon: <Apple size={16} /> },
                { type: 'snacks', label: 'Snacks / Other', icon: <Apple size={16} /> }
              ].map((meal) => {
                const mealCals = getMealTotalCals(meal.type);
                return (
                  <div key={meal.type} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: mealCals > 0 ? 'var(--primary)' : 'var(--text-secondary)' }}>{meal.icon}</div>
                      <span style={{ fontWeight: 600 }}>{meal.label}</span>
                    </div>
                    <span className="text-mono" style={{ fontWeight: 700 }}>{mealCals} kcal</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sleep Tracker Widget */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Moon size={18} style={{ color: '#fbbf24' }} />
                Sleep Tracker
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-mono" style={{ fontWeight: 700, color: '#fbbf24' }}>
                  {sleepHours} hrs / {sleepTarget} hrs
                </span>
                <button
                  onClick={() => {
                    setEditSleepBedTimeInput(sleepBedTime);
                    setEditSleepWakeTimeInput(sleepWakeTime);
                    setEditSleepTargetInput(sleepTarget.toString());
                    setShowSleepEdit(!showSleepEdit);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  {showSleepEdit ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>
            
            <p className="text-muted-desc">Log your sleep cycle. Synchronize with wearables/devices in real-time.</p>

            {showSleepEdit ? (
              <form onSubmit={handleSleepSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }} className="animate-fade">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Bedtime</label>
                    <input
                      type="time"
                      className="form-input"
                      value={editSleepBedTimeInput}
                      onChange={(e) => setEditSleepBedTimeInput(e.target.value)}
                      style={{ padding: '8px 12px' }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Wake Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={editSleepWakeTimeInput}
                      onChange={(e) => setEditSleepWakeTimeInput(e.target.value)}
                      style={{ padding: '8px 12px' }}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Desired Sleep Cycle Target (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="16"
                    className="form-input"
                    value={editSleepTargetInput}
                    onChange={(e) => setEditSleepTargetInput(e.target.value)}
                    style={{ padding: '8px 12px' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowSleepEdit(false)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Sleep timeline display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    position: 'relative', 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%',
                    background: `conic-gradient(#fbbf24 ${Math.min(100, (sleepHours / sleepTarget) * 100)}%, var(--border) 0%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(251, 191, 36, 0.15)'
                  }}>
                    <div style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--bg-card)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#fbbf24'
                    }}>
                      {Math.round((sleepHours / sleepTarget) * 100) || 0}%
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {sleepHours > 0 ? (
                        <span>{formatTimeTo12h(sleepBedTime)} - {formatTimeTo12h(sleepWakeTime)}</span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>No sleep logged yet</span>
                      )}
                    </div>
                    
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {sleepHours > 0 ? (
                        <span>Duration: <strong>{sleepHours} hrs</strong> (Target: {sleepTarget} hrs)</span>
                      ) : (
                        <span>Set bedtime & wake-time</span>
                      )}
                    </div>
                    
                    {/* Device Sync Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginTop: '2px' }}>
                      {isSyncedWithWearable ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success-text)', backgroundColor: 'var(--success-bg)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                          <Smartphone size={12} /> Wearable Synced
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Ready to sync other device</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SVG 7-Day Sleep Duration History Graph */}
                {(() => {
                  const sleepData = getLast7DaysSleep();
                  const width = 360;
                  const height = 130;
                  const paddingLeft = 20;
                  const paddingRight = 20;
                  const graphWidth = width - paddingLeft - paddingRight;
                  const graphHeight = 80;
                  const axisY = 90;
                  const maxVal = 12;
                  const targetY = axisY - (sleepTarget / maxVal) * graphHeight;
                  const colWidth = graphWidth / 7;

                  return (
                    <div style={{ 
                      marginTop: '8px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '16px'
                    }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        7-Day Sleep Duration History
                      </span>
                      <div style={{ width: '100%', overflowX: 'auto' }}>
                        <svg 
                          viewBox={`0 0 ${width} ${height}`} 
                          width="100%" 
                          height={height} 
                          style={{ overflow: 'visible', minWidth: '320px' }}
                        >
                          {/* Target Reference Line */}
                          <line 
                            x1={paddingLeft} 
                            y1={targetY} 
                            x2={width - paddingRight} 
                            y2={targetY} 
                            stroke="#fbbf24" 
                            strokeWidth="1.2" 
                            strokeDasharray="4 3" 
                            opacity="0.6"
                          />
                          <text 
                            x={width - paddingRight} 
                            y={targetY - 4} 
                            textAnchor="end" 
                            fill="#fbbf24" 
                            fontSize="8px" 
                            fontWeight="700"
                            opacity="0.9"
                          >
                            Target: {sleepTarget}h
                          </text>

                          {/* 7 Days Columns */}
                          {sleepData.map((day, idx) => {
                            const x = paddingLeft + idx * colWidth + (colWidth - 20) / 2;
                            const barH = (day.hours / maxVal) * graphHeight;
                            const barY = axisY - barH;
                            const isActive = day.date === selectedDate;

                            return (
                              <g key={day.date} style={{ cursor: 'pointer' }} onClick={() => setSelectedDate(day.date)}>
                                {/* Invisible click target */}
                                <rect
                                  x={paddingLeft + idx * colWidth}
                                  y="0"
                                  width={colWidth}
                                  height={axisY}
                                  fill="transparent"
                                />
                                
                                {/* Bar */}
                                <rect
                                  x={x}
                                  y={barY}
                                  width="20"
                                  height={Math.max(2, barH)}
                                  rx="4"
                                  fill={isActive ? '#fbbf24' : 'var(--border)'}
                                  style={{ 
                                    transition: 'all 0.3s ease',
                                    filter: isActive ? 'drop-shadow(0px 2px 4px rgba(251, 191, 36, 0.4))' : 'none'
                                  }}
                                />
                                
                                {/* Hours value text above bar */}
                                <text
                                  x={x + 10}
                                  y={barY - 6}
                                  textAnchor="middle"
                                  fill={isActive ? '#fbbf24' : 'var(--text-secondary)'}
                                  fontSize="9px"
                                  fontWeight={isActive ? '800' : '600'}
                                >
                                  {day.hours > 0 ? `${day.hours}h` : '0h'}
                                </text>

                                {/* Day Label below axis */}
                                <text
                                  x={x + 10}
                                  y={axisY + 16}
                                  textAnchor="middle"
                                  fill={isActive ? '#fbbf24' : 'var(--text-muted)'}
                                  fontSize="8px"
                                  fontWeight={isActive ? '800' : '600'}
                                >
                                  {day.dayLabel}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  );
                })()}

                {/* Device sync trigger button */}
                <button
                  type="button"
                  onClick={handleSyncDevice}
                  disabled={isSyncingSleep}
                  className="btn btn-secondary"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    fontSize: '0.85rem', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isSyncingSleep ? 'not-allowed' : 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <RefreshCw size={14} className={isSyncingSleep ? 'animate-spin' : ''} />
                  {isSyncingSleep ? 'Synchronizing Wearable...' : 'Sync Wearable Device'}
                </button>
              </div>
            )}
          </div>

          {/* Water widget */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplet size={18} style={{ color: 'var(--secondary)' }} />
                Water Tracker
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-mono" style={{ fontWeight: 700, color: 'var(--secondary)' }}>{waterMl}ml / {waterTarget}ml</span>
                <button
                  onClick={() => {
                    setEditWaterIntake(waterMl.toString());
                    setEditWaterTarget(waterTarget.toString());
                    setShowWaterEdit(!showWaterEdit);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  {showWaterEdit ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>
            <p className="text-muted-desc">Log your water intake. 1 cup = 250ml. Tap to fill/empty.</p>

            {showWaterEdit ? (
              <form onSubmit={handleWaterEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }} className="animate-fade">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Current Intake (ml)</label>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      max="10000"
                      className="form-input"
                      value={editWaterIntake}
                      onChange={(e) => setEditWaterIntake(e.target.value)}
                      style={{ padding: '8px 12px' }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}>Daily Target (ml)</label>
                    <input
                      type="number"
                      step="100"
                      min="500"
                      max="10000"
                      className="form-input"
                      value={editWaterTarget}
                      onChange={(e) => setEditWaterTarget(e.target.value)}
                      style={{ padding: '8px 12px' }}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowWaterEdit(false)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="water-cup-grid" style={{ gridTemplateColumns: `repeat(${Math.min(8, Math.ceil(waterTarget / 250))}, 1fr)`, rowGap: '12px' }}>
                {Array.from({ length: Math.ceil(waterTarget / 250) }).map((_, i) => {
                  const cupThreshold = (i + 1) * 250;
                  const prevCupThreshold = i * 250;
                  let fillPercent = 0;
                  if (waterMl >= cupThreshold) {
                    fillPercent = 90;
                  } else if (waterMl > prevCupThreshold) {
                    fillPercent = ((waterMl - prevCupThreshold) / 250) * 90;
                  }
                  return (
                    <div
                      key={i}
                      className={`water-cup-item ${waterMl >= cupThreshold ? 'active' : ''}`}
                      onClick={() => handleWaterClick(i)}
                      style={{ borderColor: waterMl > prevCupThreshold ? 'var(--secondary)' : 'var(--border)' }}
                    >
                      <div className="water-cup-fill" style={{ height: `${fillPercent}%` }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weight log shortcut */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dumbbell size={18} style={{ color: 'var(--tertiary)' }} />
                Weight Status
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-mono" style={{ fontWeight: 700 }}>{currentWeight} kg</span>
                <button
                  onClick={() => setShowWeightInput(!showWeightInput)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  {showWeightInput ? 'Cancel' : 'Update'}
                </button>
              </div>
            </div>

            {showWeightInput && (
              <form onSubmit={handleWeightSubmit} style={{ display: 'flex', gap: '8px', marginTop: '12px' }} className="animate-fade">
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 70.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px' }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                  Log
                </button>
              </form>
            )}
          </div>

          {/* Exercise log shortcut */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dumbbell size={18} style={{ color: 'var(--primary)' }} />
                Exercise & Fitness
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {totalExerciseDuration} mins
                </span>
                <button
                  onClick={() => setActiveTab('exercise')}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  Log Workout
                </button>
              </div>
            </div>

            <p className="text-muted-desc">Log your active duration, reps, and yoga poses. Estimate calories burned.</p>
            
            {exerciseLogs.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No workouts logged today</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Click "Log Workout" to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                  {exerciseLogs.map((log) => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.name}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {log.sets && `${log.sets} sets `}
                          {log.reps && `${log.reps} reps `}
                          {log.durationMins && `${log.durationMins} mins`}
                        </div>
                      </div>
                      <span className="text-mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444' }}>
                        -{getCaloriesBurned(log)} kcal
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700 }}>
                  <span>Total Calories Burned</span>
                  <span style={{ color: '#ef4444' }}>-{totalExerciseCalories} kcal</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
