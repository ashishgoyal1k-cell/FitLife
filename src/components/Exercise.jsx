import React, { useState, useEffect, useMemo } from 'react';
import {
  getExerciseLogs,
  addExerciseLog,
  deleteExerciseLog
} from '../utils/db';
import {
  INITIAL_EXERCISES,
  EXERCISE_CATEGORIES
} from '../data/exercisesData';
import {
  Dumbbell,
  Search,
  Filter,
  Plus,
  Heart,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Trash2,
  Activity,
  Award
} from 'lucide-react';
import './Exercise.css';

export const Exercise = ({ user, selectedDate }) => {
  // Navigation tabs within Exercise section
  const [exerciseView, setExerciseView] = useState('library'); // 'library' | 'history'

  // Exercises State (Predefined + Custom)
  const [exercises, setExercises] = useState(() => {
    try {
      const custom = localStorage.getItem(`fitlife_custom_exercises_${user.username}`);
      const parsedCustom = custom ? JSON.parse(custom) : [];
      return [...INITIAL_EXERCISES, ...parsedCustom];
    } catch {
      return INITIAL_EXERCISES;
    }
  });

  // User Favorites State
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(`fitlife_fav_exercises_${user.username}`);
      return saved ? JSON.parse(saved) : ['barbell-bench-press', 'barbell-squat', 'pull-up'];
    } catch {
      return ['barbell-bench-press', 'barbell-squat', 'pull-up'];
    }
  });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'alpha' | 'most_logged'

  // Detail Modal State
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Custom Exercise Creation Modal State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    primaryMuscle: 'Chest',
    secondaryMuscles: '',
    equipment: 'Dumbbell',
    exerciseType: 'Strength',
    difficulty: 'Beginner',
    recommendedReps: '10 - 12 reps',
    description: '',
    instructions: ''
  });

  // Workout Logger State inside Detail Modal
  const [activeSets, setActiveSets] = useState([
    { setNumber: 1, weightKg: 60, reps: 10, completed: false },
    { setNumber: 2, weightKg: 60, reps: 10, completed: false },
    { setNumber: 3, weightKg: 60, reps: 8, completed: false }
  ]);
  const [logSuccess, setLogSuccess] = useState('');
  const [newPrAlert, setNewPrAlert] = useState(null);

  // Exercise Notes State
  const [exerciseNotes, setExerciseNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(`fitlife_exercise_notes_${user.username}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [currentNote, setCurrentNote] = useState('');

  // Rest Timer State
  const [restTime, setRestTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Global Workout Logs
  const [logs, setLogs] = useState([]);

  // Load all logs for user
  useEffect(() => {
    loadLogs();
  }, [user, selectedDate]);

  const loadLogs = () => {
    try {
      const allLogs = JSON.parse(localStorage.getItem('exerciseLogs') || '[]');
      const userLogs = allLogs.filter((l) => l.username === user.username);
      setLogs(userLogs);
    } catch {
      setLogs([]);
    }
  };

  // Save favorites to localStorage
  const toggleFavorite = (exerciseId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (favorites.includes(exerciseId)) {
      updated = favorites.filter((id) => id !== exerciseId);
    } else {
      updated = [...favorites, exerciseId];
    }
    setFavorites(updated);
    localStorage.setItem(`fitlife_fav_exercises_${user.username}`, JSON.stringify(updated));
  };

  // Rest Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
    } else if (restTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTime]);

  const startRestTimer = (seconds) => {
    setRestTime(seconds);
    setIsTimerRunning(true);
  };

  // Open Exercise Detail
  const handleOpenDetail = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentNote(exerciseNotes[exercise.id] || '');
    setLogSuccess('');
    setNewPrAlert(null);

    // Populate default sets based on history or defaults
    const exerciseHistory = logs.filter((l) => l.name.toLowerCase() === exercise.name.toLowerCase());
    if (exerciseHistory.length > 0 && exerciseHistory[0].weightKg) {
      const lastWeight = exerciseHistory[0].weightKg;
      const lastReps = exerciseHistory[0].reps || 10;
      setActiveSets([
        { setNumber: 1, weightKg: lastWeight, reps: lastReps, completed: false },
        { setNumber: 2, weightKg: lastWeight, reps: lastReps, completed: false },
        { setNumber: 3, weightKg: lastWeight, reps: Math.max(lastReps - 2, 6), completed: false }
      ]);
    } else {
      setActiveSets([
        { setNumber: 1, weightKg: 50, reps: 10, completed: false },
        { setNumber: 2, weightKg: 50, reps: 10, completed: false },
        { setNumber: 3, weightKg: 50, reps: 8, completed: false }
      ]);
    }
  };

  // Save Personal Note
  const handleSaveNote = (exerciseId) => {
    const updated = { ...exerciseNotes, [exerciseId]: currentNote };
    setExerciseNotes(updated);
    localStorage.setItem(`fitlife_exercise_notes_${user.username}`, JSON.stringify(updated));
    setLogSuccess('Notes saved!');
    setTimeout(() => setLogSuccess(''), 2500);
  };

  // Add / Remove Set in Active Logger
  const handleAddSet = () => {
    const lastSet = activeSets[activeSets.length - 1];
    setActiveSets([
      ...activeSets,
      {
        setNumber: activeSets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 50,
        reps: lastSet ? lastSet.reps : 10,
        completed: false
      }
    ]);
  };

  const handleRemoveSet = (index) => {
    if (activeSets.length <= 1) return;
    const updated = activeSets.filter((_, i) => i !== index).map((s, i) => ({ ...s, setNumber: i + 1 }));
    setActiveSets(updated);
  };

  const handleSetChange = (index, field, value) => {
    const updated = [...activeSets];
    updated[index][field] = value;
    setActiveSets(updated);
  };

  // Calculate Personal Records for selected exercise
  const exercisePRs = useMemo(() => {
    if (!selectedExercise) return { maxWeight: 0, maxReps: 0, estimated1RM: 0, totalVolume: 0 };
    const matchingLogs = logs.filter((l) => l.name.toLowerCase() === selectedExercise.name.toLowerCase());
    let maxWeight = 0;
    let maxReps = 0;
    let estimated1RM = 0;

    matchingLogs.forEach((l) => {
      const w = Number(l.weightKg) || 0;
      const r = Number(l.reps) || 0;
      if (w > maxWeight) maxWeight = w;
      if (r > maxReps) maxReps = r;

      // Epley Formula: 1RM = Weight * (1 + Reps / 30)
      if (w > 0 && r > 0) {
        const e1rm = Math.round(w * (1 + r / 30));
        if (e1rm > estimated1RM) estimated1RM = e1rm;
      }
    });

    return { maxWeight, maxReps, estimated1RM, count: matchingLogs.length };
  }, [selectedExercise, logs]);

  // Submit Workout Sets to Database
  const handleLogWorkout = (e) => {
    e.preventDefault();
    if (!selectedExercise) return;

    const completedSets = activeSets.filter((s) => s.completed || s.weightKg > 0);
    if (completedSets.length === 0) {
      setActiveSets(activeSets.map((s) => ({ ...s, completed: true })));
    }

    const totalWeight = activeSets.reduce((sum, s) => sum + (Number(s.weightKg) || 0), 0);
    const avgWeight = activeSets.length > 0 ? Math.round(totalWeight / activeSets.length) : 0;
    const maxWeightInSession = Math.max(...activeSets.map((s) => Number(s.weightKg) || 0));
    const maxRepsInSession = Math.max(...activeSets.map((s) => Number(s.reps) || 0));
    const totalVolume = activeSets.reduce((sum, s) => sum + (Number(s.weightKg) || 0) * (Number(s.reps) || 0), 0);

    // Check for Personal Record
    if (maxWeightInSession > exercisePRs.maxWeight && exercisePRs.maxWeight > 0) {
      setNewPrAlert(`🏆 New Personal Record! Heaviest weight: ${maxWeightInSession} kg! 🎉`);
    }

    // Save log entry to FitLife database
    addExerciseLog({
      username: user.username,
      date: selectedDate,
      name: selectedExercise.name,
      sets: activeSets.length,
      reps: maxRepsInSession || 10,
      weightKg: avgWeight || maxWeightInSession,
      durationMins: activeSets.length * 2.5
    });

    loadLogs();
    setLogSuccess(`Logged ${activeSets.length} sets of ${selectedExercise.name} (${totalVolume} kg volume)!`);
    setTimeout(() => {
      setLogSuccess('');
    }, 4000);
  };

  // Create Custom Exercise
  const handleCreateCustomExercise = (e) => {
    e.preventDefault();
    if (!customForm.name.trim()) return;

    const newExercise = {
      id: `custom-${Date.now()}`,
      name: customForm.name.trim(),
      primaryMuscle: customForm.primaryMuscle,
      secondaryMuscles: customForm.secondaryMuscles.split(',').map((s) => s.trim()).filter(Boolean),
      equipment: customForm.equipment,
      exerciseType: customForm.exerciseType,
      difficulty: customForm.difficulty,
      recommendedReps: customForm.recommendedReps || '8 - 12 reps',
      met: 4.0,
      description: customForm.description || 'Custom user created exercise.',
      instructions: customForm.instructions
        ? customForm.instructions.split('\n').filter(Boolean)
        : ['Perform movement with steady control and controlled breathing.'],
      tips: 'Always maintain strict form and warm up prior to heavy sets.',
      isCustom: true
    };

    const customKey = `fitlife_custom_exercises_${user.username}`;
    const existing = JSON.parse(localStorage.getItem(customKey) || '[]');
    const updated = [newExercise, ...existing];
    localStorage.setItem(customKey, JSON.stringify(updated));

    setExercises([newExercise, ...exercises]);
    setShowCustomModal(false);
    setCustomForm({
      name: '',
      primaryMuscle: 'Chest',
      secondaryMuscles: '',
      equipment: 'Dumbbell',
      exerciseType: 'Strength',
      difficulty: 'Beginner',
      recommendedReps: '10 - 12 reps',
      description: '',
      instructions: ''
    });
  };

  // Delete Custom Exercise
  const handleDeleteCustomExercise = (exerciseId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this custom exercise?')) return;
    const customKey = `fitlife_custom_exercises_${user.username}`;
    const existing = JSON.parse(localStorage.getItem(customKey) || '[]');
    const updated = existing.filter((ex) => ex.id !== exerciseId);
    localStorage.setItem(customKey, JSON.stringify(updated));

    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
    if (selectedExercise?.id === exerciseId) {
      setSelectedExercise(null);
    }
  };

  // Filter & Search Logic
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.primaryMuscle.toLowerCase().includes(q) ||
          (ex.secondaryMuscles || []).some((m) => m.toLowerCase().includes(q));
        const matchesEquip = ex.equipment.toLowerCase().includes(q);
        const matchesType = ex.exerciseType.toLowerCase().includes(q);
        if (!matchesName && !matchesMuscle && !matchesEquip && !matchesType) {
          return false;
        }
      }

      // Muscle group filter
      if (selectedMuscle !== 'All' && ex.primaryMuscle.toLowerCase() !== selectedMuscle.toLowerCase()) {
        return false;
      }

      // Equipment filter
      if (selectedEquipment !== 'All' && ex.equipment.toLowerCase() !== selectedEquipment.toLowerCase()) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && ex.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // Exercise Type filter
      if (selectedType !== 'All' && ex.exerciseType.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Favorites only
      if (showOnlyFavorites && !favorites.includes(ex.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'alpha') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'most_logged') {
        const countA = logs.filter((l) => l.name.toLowerCase() === a.name.toLowerCase()).length;
        const countB = logs.filter((l) => l.name.toLowerCase() === b.name.toLowerCase()).length;
        return countB - countA;
      }
      // Popular (default: favorited first, then default order)
      const favA = favorites.includes(a.id) ? 1 : 0;
      const favB = favorites.includes(b.id) ? 1 : 0;
      return favB - favA;
    });
  }, [exercises, searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty, selectedType, showOnlyFavorites, sortBy, favorites, logs]);

  // Overall Workout Stats for History Tab
  const workoutStats = useMemo(() => {
    const totalSessions = logs.length;
    let totalVolumeKg = 0;
    logs.forEach((l) => {
      const sets = l.sets || 1;
      const reps = l.reps || 10;
      const weight = l.weightKg || 0;
      totalVolumeKg += sets * reps * weight;
    });

    return {
      totalSessions,
      totalVolumeKg,
      todaySessions: logs.filter((l) => l.date === selectedDate).length
    };
  }, [logs, selectedDate]);

  return (
    <div className="exercise-section-container animate-fade">
      {/* Page Header */}
      <div className="exercise-header-card glass-card">
        <div className="exercise-header-left">
          <div className="exercise-title-row">
            <div className="exercise-logo-badge">
              <Dumbbell size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="exercise-main-title">Exercise Library</h1>
              <p className="exercise-subtitle">
                Explore exercises, learn proper form, and build better workouts.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="exercise-header-actions">
          <button
            type="button"
            className={`btn ${exerciseView === 'library' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setExerciseView('library')}
          >
            <Dumbbell size={16} /> Library ({filteredExercises.length})
          </button>
          <button
            type="button"
            className={`btn ${exerciseView === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setExerciseView('history')}
          >
            <Clock size={16} /> Workout History ({logs.length})
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-custom-exercise"
            onClick={() => setShowCustomModal(true)}
          >
            <Plus size={16} /> + Custom
          </button>
        </div>
      </div>

      {exerciseView === 'library' && (
        <>
          {/* Search, Filter Bar & Quick Category Chips */}
          <div className="exercise-search-filter-card glass-card">
            {/* Search Box & Sorter Row */}
            <div className="exercise-search-row">
              <div className="exercise-search-box">
                <Search size={18} className="exercise-search-icon" />
                <input
                  type="text"
                  className="exercise-search-input"
                  placeholder="Search exercise by name, muscle (e.g. Chest, Quads), equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="exercise-search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="exercise-sort-box">
                <span className="exercise-sort-label">Sort:</span>
                <select
                  className="form-input exercise-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Popular / Favorites</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                  <option value="most_logged">Most Logged</option>
                </select>
              </div>

              {/* Favorites Filter Toggle */}
              <button
                type="button"
                className={`btn ${showOnlyFavorites ? 'btn-primary' : 'btn-secondary'} exercise-fav-toggle-btn`}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                title="Filter by your favorited exercises"
              >
                <Heart size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
                <span>Favorites ({favorites.length})</span>
              </button>
            </div>

            {/* Muscle Category Chips (Horizontal Scrollable) */}
            <div className="exercise-filter-chips-row">
              <span className="exercise-filter-category-label">Target:</span>
              <div className="exercise-chips-scroll">
                {EXERCISE_CATEGORIES.muscles.map((muscle) => (
                  <button
                    key={muscle}
                    type="button"
                    className={`exercise-chip ${selectedMuscle === muscle ? 'active' : ''}`}
                    onClick={() => setSelectedMuscle(muscle)}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Filter Dropdowns Row */}
            <div className="exercise-secondary-filters-row">
              <div className="exercise-filter-group">
                <label>Equipment:</label>
                <select
                  className="form-input"
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                >
                  {EXERCISE_CATEGORIES.equipment.map((eq) => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>
              </div>

              <div className="exercise-filter-group">
                <label>Difficulty:</label>
                <select
                  className="form-input"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {EXERCISE_CATEGORIES.difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="exercise-filter-group">
                <label>Type:</label>
                <select
                  className="form-input"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {EXERCISE_CATEGORIES.types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {(selectedMuscle !== 'All' || selectedEquipment !== 'All' || selectedDifficulty !== 'All' || selectedType !== 'All' || showOnlyFavorites) && (
                <button
                  type="button"
                  className="btn btn-ghost exercise-clear-filters-btn"
                  onClick={() => {
                    setSelectedMuscle('All');
                    setSelectedEquipment('All');
                    setSelectedDifficulty('All');
                    setSelectedType('All');
                    setShowOnlyFavorites(false);
                    setSearchQuery('');
                  }}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Exercise Cards Grid */}
          <div className="exercise-grid">
            {filteredExercises.map((exercise) => {
              const isFav = favorites.includes(exercise.id);
              const matchingLogsCount = logs.filter((l) => l.name.toLowerCase() === exercise.name.toLowerCase()).length;

              return (
                <div
                  key={exercise.id}
                  className="exercise-card glass-card animate-fade"
                  onClick={() => handleOpenDetail(exercise)}
                >
                  {/* Card Visual Header Badge */}
                  <div className="exercise-card-badge-header">
                    <div className="exercise-visual-icon-box">
                      <Dumbbell size={22} className="exercise-card-icon" />
                      <span className="exercise-muscle-tag">{exercise.primaryMuscle}</span>
                    </div>

                    <div className="exercise-card-top-actions">
                      <button
                        type="button"
                        className={`exercise-card-fav-btn ${isFav ? 'favorited' : ''}`}
                        onClick={(e) => toggleFavorite(exercise.id, e)}
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Heart size={18} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : 'var(--text-secondary)'} />
                      </button>
                      {exercise.isCustom && (
                        <button
                          type="button"
                          className="exercise-card-del-btn"
                          onClick={(e) => handleDeleteCustomExercise(exercise.id, e)}
                          title="Delete custom exercise"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Main Info */}
                  <div className="exercise-card-body">
                    <h3 className="exercise-card-name">{exercise.name}</h3>
                    <p className="exercise-card-meta">
                      <span>{exercise.equipment}</span>
                      <span className="exercise-meta-dot">•</span>
                      <span className={`exercise-difficulty-badge ${exercise.difficulty.toLowerCase()}`}>
                        {exercise.difficulty}
                      </span>
                    </p>
                    <p className="exercise-card-desc">
                      {exercise.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="exercise-card-footer">
                    <span className="exercise-reps-chip">
                      <TrendingUp size={13} /> {exercise.recommendedReps}
                    </span>

                    <button
                      type="button"
                      className="btn btn-primary exercise-quick-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(exercise);
                      }}
                    >
                      <Plus size={15} /> Log Sets
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredExercises.length === 0 && (
            <div className="glass-card exercise-empty-state">
              <Dumbbell size={48} className="exercise-empty-icon" />
              <h3>No exercises found</h3>
              <p>Try adjusting your search terms or clearing active filters.</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedMuscle('All');
                  setSelectedEquipment('All');
                  setSelectedDifficulty('All');
                  setSelectedType('All');
                  setShowOnlyFavorites(false);
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* History & Progress Tab */}
      {exerciseView === 'history' && (
        <div className="exercise-history-view animate-fade">
          {/* Summary Stats Grid */}
          <div className="exercise-stats-grid">
            <div className="glass-card exercise-stat-card">
              <div className="exercise-stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <Activity size={24} />
              </div>
              <div>
                <div className="exercise-stat-value">{workoutStats.totalSessions}</div>
                <div className="exercise-stat-label">Total Completed Sets/Logs</div>
              </div>
            </div>

            <div className="glass-card exercise-stat-card">
              <div className="exercise-stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="exercise-stat-value">{workoutStats.totalVolumeKg.toLocaleString()} kg</div>
                <div className="exercise-stat-label">Total Lifted Volume</div>
              </div>
            </div>

            <div className="glass-card exercise-stat-card">
              <div className="exercise-stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Flame size={24} />
              </div>
              <div>
                <div className="exercise-stat-value">{workoutStats.todaySessions}</div>
                <div className="exercise-stat-label">Logged Today ({selectedDate})</div>
              </div>
            </div>
          </div>

          {/* Logged Exercises Table */}
          <div className="glass-card exercise-history-card">
            <div className="exercise-history-header">
              <h3>Recent Workout Logs</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setExerciseView('library')}
              >
                + Log New Exercise
              </button>
            </div>

            {logs.length > 0 ? (
              <div className="exercise-table-wrapper">
                <table className="exercise-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Exercise</th>
                      <th>Sets & Reps</th>
                      <th>Weight</th>
                      <th>Est. Volume</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const sets = log.sets || 1;
                      const reps = log.reps || 10;
                      const weight = log.weightKg || 0;
                      const volume = sets * reps * weight;

                      return (
                        <tr key={log.id}>
                          <td>{log.date}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.name}</td>
                          <td>{sets} sets × {reps} reps</td>
                          <td>{weight > 0 ? `${weight} kg` : 'Bodyweight'}</td>
                          <td>{volume > 0 ? `${volume} kg` : '—'}</td>
                          <td>
                            <button
                              type="button"
                              className="exercise-log-del-btn"
                              onClick={() => {
                                deleteExerciseLog(log.id);
                                loadLogs();
                              }}
                              title="Delete log"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="exercise-empty-state">
                <Clock size={40} className="exercise-empty-icon" />
                <p>No workout sessions logged yet. Select an exercise from the library to log your first set!</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setExerciseView('library')}
                >
                  Explore Exercises
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EXERCISE DETAIL & LOGGING MODAL */}
      {/* ======================================================== */}
      {selectedExercise && (
        <div className="exercise-modal-overlay" onClick={() => setSelectedExercise(null)}>
          <div
            className="glass-card animate-fade exercise-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="exercise-modal-header">
              <div className="exercise-modal-title-box">
                <span className="exercise-modal-category-chip">{selectedExercise.primaryMuscle}</span>
                <h2 className="exercise-modal-title">{selectedExercise.name}</h2>
                <div className="exercise-modal-badges">
                  <span className="exercise-badge">{selectedExercise.equipment}</span>
                  <span className={`exercise-badge difficulty-${selectedExercise.difficulty.toLowerCase()}`}>
                    {selectedExercise.difficulty}
                  </span>
                  <span className="exercise-badge">{selectedExercise.exerciseType}</span>
                </div>
              </div>

              <div className="exercise-modal-top-buttons">
                <button
                  type="button"
                  className={`exercise-modal-fav-btn ${favorites.includes(selectedExercise.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(selectedExercise.id)}
                >
                  <Heart
                    size={20}
                    fill={favorites.includes(selectedExercise.id) ? '#ef4444' : 'none'}
                    color={favorites.includes(selectedExercise.id) ? '#ef4444' : 'var(--text-secondary)'}
                  />
                </button>
                <button
                  type="button"
                  className="exercise-modal-close-btn"
                  onClick={() => setSelectedExercise(null)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Success & PR Alerts */}
            {newPrAlert && (
              <div className="animate-fade exercise-pr-banner">
                <Award size={20} />
                <span>{newPrAlert}</span>
              </div>
            )}
            {logSuccess && (
              <div className="animate-fade auth-alert-success" style={{ marginBottom: '14px' }}>
                <CheckCircle2 size={18} />
                <span>{logSuccess}</span>
              </div>
            )}

            {/* Modal Body Container */}
            <div className="exercise-modal-body">
              {/* Personal Records (PR) Banner */}
              <div className="exercise-pr-card">
                <div className="exercise-pr-item">
                  <span className="exercise-pr-label">🏆 Heaviest Weight</span>
                  <span className="exercise-pr-value">{exercisePRs.maxWeight > 0 ? `${exercisePRs.maxWeight} kg` : '—'}</span>
                </div>
                <div className="exercise-pr-item">
                  <span className="exercise-pr-label">🏆 Most Reps</span>
                  <span className="exercise-pr-value">{exercisePRs.maxReps > 0 ? `${exercisePRs.maxReps} reps` : '—'}</span>
                </div>
                <div className="exercise-pr-item">
                  <span className="exercise-pr-label">🏆 Estimated 1RM</span>
                  <span className="exercise-pr-value">{exercisePRs.estimated1RM > 0 ? `${exercisePRs.estimated1RM} kg` : '—'}</span>
                </div>
              </div>

              {/* Interactive Workout Logger */}
              <div className="exercise-workout-logger-box">
                <div className="exercise-logger-header">
                  <h4>Active Workout Sets ({selectedDate})</h4>

                  {/* Rest Timer Quick Actions */}
                  <div className="exercise-timer-bar">
                    <span className="exercise-timer-label">Rest:</span>
                    {restTime > 0 ? (
                      <span className="exercise-timer-active animate-pulse">
                        <Clock size={14} /> {restTime}s
                      </span>
                    ) : (
                      <>
                        <button type="button" className="timer-btn" onClick={() => startRestTimer(60)}>60s</button>
                        <button type="button" className="timer-btn" onClick={() => startRestTimer(90)}>90s</button>
                        <button type="button" className="timer-btn" onClick={() => startRestTimer(120)}>120s</button>
                      </>
                    )}
                  </div>
                </div>

                <form onSubmit={handleLogWorkout}>
                  <div className="exercise-sets-list">
                    <div className="exercise-sets-header-row">
                      <span>Set</span>
                      <span>Weight (kg)</span>
                      <span>Reps</span>
                      <span>Done</span>
                      <span></span>
                    </div>

                    {activeSets.map((set, idx) => (
                      <div key={idx} className={`exercise-set-row ${set.completed ? 'completed' : ''}`}>
                        <span className="exercise-set-num">{set.setNumber}</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          className="form-input exercise-set-input"
                          value={set.weightKg}
                          onChange={(e) => handleSetChange(idx, 'weightKg', e.target.value)}
                          placeholder="kg"
                          required
                        />
                        <input
                          type="number"
                          min="1"
                          className="form-input exercise-set-input"
                          value={set.reps}
                          onChange={(e) => handleSetChange(idx, 'reps', e.target.value)}
                          placeholder="reps"
                          required
                        />
                        <button
                          type="button"
                          className={`exercise-set-check-btn ${set.completed ? 'checked' : ''}`}
                          onClick={() => handleSetChange(idx, 'completed', !set.completed)}
                          title="Mark set complete"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <button
                          type="button"
                          className="exercise-set-del-btn"
                          onClick={() => handleRemoveSet(idx)}
                          title="Remove set"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="exercise-sets-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleAddSet}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Plus size={14} /> + Add Set
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary exercise-save-workout-btn"
                    >
                      <CheckCircle2 size={16} /> Save Sets to Workout
                    </button>
                  </div>
                </form>
              </div>

              {/* Instructions & Form Tips */}
              <div className="exercise-instructions-box">
                <h4>Step-by-Step Instructions</h4>
                <ol className="exercise-instructions-list">
                  {selectedExercise.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                {selectedExercise.tips && (
                  <div className="exercise-pro-tip">
                    <Sparkles size={16} className="text-primary" />
                    <span><strong>Pro Form Tip:</strong> {selectedExercise.tips}</span>
                  </div>
                )}
              </div>

              {/* Target Muscles Info */}
              <div className="exercise-muscles-detail">
                <h4>Muscles Worked</h4>
                <div className="exercise-muscle-pills">
                  <span className="pill primary-muscle">Primary: {selectedExercise.primaryMuscle}</span>
                  {selectedExercise.secondaryMuscles?.map((m, i) => (
                    <span key={i} className="pill secondary-muscle">Secondary: {m}</span>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              <div className="exercise-notes-box">
                <h4>Personal Exercise Notes</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Focus on deep stretch at bottom, keep elbows tucked..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleSaveNote(selectedExercise.id)}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE CUSTOM EXERCISE MODAL */}
      {/* ======================================================== */}
      {showCustomModal && (
        <div className="exercise-modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div
            className="glass-card animate-fade exercise-custom-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="exercise-modal-header">
              <h3>Create Custom Exercise</h3>
              <button
                type="button"
                className="exercise-modal-close-btn"
                onClick={() => setShowCustomModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomExercise} style={{ padding: '20px' }}>
              <div className="form-group">
                <label className="form-label">Exercise Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Incline Cable Crossover, Deficit Deadlift..."
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Primary Muscle</label>
                  <select
                    className="form-input"
                    value={customForm.primaryMuscle}
                    onChange={(e) => setCustomForm({ ...customForm, primaryMuscle: e.target.value })}
                  >
                    {EXERCISE_CATEGORIES.muscles.filter((m) => m !== 'All').map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Equipment</label>
                  <select
                    className="form-input"
                    value={customForm.equipment}
                    onChange={(e) => setCustomForm({ ...customForm, equipment: e.target.value })}
                  >
                    {EXERCISE_CATEGORIES.equipment.filter((eq) => eq !== 'All').map((eq) => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-input"
                    value={customForm.difficulty}
                    onChange={(e) => setCustomForm({ ...customForm, difficulty: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Exercise Type</label>
                  <select
                    className="form-input"
                    value={customForm.exerciseType}
                    onChange={(e) => setCustomForm({ ...customForm, exerciseType: e.target.value })}
                  >
                    <option value="Strength">Strength</option>
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Mobility">Mobility</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Secondary Muscles (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Triceps, Front Delts"
                  value={customForm.secondaryMuscles}
                  onChange={(e) => setCustomForm({ ...customForm, secondaryMuscles: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Step-by-Step Instructions (one per line)</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Step 1: Set up bench&#10;Step 2: Grip handles firmly&#10;Step 3: Squeeze and press"
                  value={customForm.instructions}
                  onChange={(e) => setCustomForm({ ...customForm, instructions: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCustomModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
