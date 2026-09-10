import React, { useState, useEffect } from 'react';
import { getExerciseLogs, addExerciseLog, deleteExerciseLog } from '../utils/db';
import { Dumbbell, Trash2, Plus, X, Flame, Clock, Heart, TrendingUp, Sparkles } from 'lucide-react';
import './Exercise.css';

const PREDEFINED_EXERCISES = [
  // Cardio
  { name: 'Running / Jogging', category: 'cardio', met: 8.0, description: 'Moderate pace outdoor or treadmill run' },
  { name: 'Walking', category: 'cardio', met: 3.5, description: 'Brisk walking' },
  { name: 'Cycling', category: 'cardio', met: 7.5, description: 'Moderate effort bicycling' },
  { name: 'Jumping Jacks', category: 'cardio', met: 8.0, description: 'High-intensity jumping jacks' },
  { name: 'Swimming', category: 'cardio', met: 6.0, description: 'General swimming laps' },
  { name: 'Rope Skipping', category: 'cardio', met: 10.0, description: 'Moderate speed jump rope' },

  // Strength
  { name: 'Push-ups', category: 'strength', met: 4.0, description: 'Bodyweight chest and tricep push' },
  { name: 'Squats', category: 'strength', met: 5.0, description: 'Bodyweight or weighted squats' },
  { name: 'Pull-ups', category: 'strength', met: 6.0, description: 'Upper body pulling exercise' },
  { name: 'Plank', category: 'strength', met: 3.0, description: 'Core isometric hold' },
  { name: 'Dumbbell Bicep Curls', category: 'strength', met: 3.0, description: 'Isolated bicep curls' },
  { name: 'Lunges', category: 'strength', met: 4.0, description: 'Bodyweight or weighted leg lunges' },

  // Yoga
  { name: 'Surya Namaskar (Sun Salutation)', category: 'yoga', met: 4.0, description: 'Dynamic sequence of 12 yoga postures' },
  { name: 'Warrior Pose (Virabhadrasana)', category: 'yoga', met: 2.5, description: 'Standing yoga pose for strength and balance' },
  { name: 'Tree Pose (Vrikshasana)', category: 'yoga', met: 2.0, description: 'Balance posture focusing on concentration' },
  { name: 'Cobra Pose (Bhujangasana)', category: 'yoga', met: 2.5, description: 'Back-bending posture to strengthen the spine' },
  { name: 'Downward Dog (Adho Mukha Svanasana)', category: 'yoga', met: 3.0, description: 'Inversion pose stretching the whole body' },
  { name: 'Child\'s Pose (Balasana)', category: 'yoga', met: 1.5, description: 'Restorative resting posture' },
];

export const Exercise = ({ user, selectedDate }) => {
  const [logs, setLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states
  const [category, setCategory] = useState('cardio');
  const [exerciseName, setExerciseName] = useState(PREDEFINED_EXERCISES.filter((e) => e.category === 'cardio')[0].name);
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [logDate, setLogDate] = useState(selectedDate);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLogs();
  }, [user, selectedDate]);

  useEffect(() => {
    setLogDate(selectedDate);
  }, [selectedDate]);

  // Update default exercise selection when category changes
  useEffect(() => {
    if (!isCustom) {
      const filtered = PREDEFINED_EXERCISES.filter((e) => e.category === category);
      if (filtered.length > 0) {
        setExerciseName(filtered[0].name);
      }
    }
  }, [category, isCustom]);

  const loadLogs = () => {
    setLogs(getExerciseLogs(user.username, selectedDate));
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setIsCustom(false);
    setCustomExerciseName('');
  };

  // MET calculation
  const getMETForExercise = (name) => {
    const found = PREDEFINED_EXERCISES.find((e) => e.name.toLowerCase() === name.toLowerCase());
    if (found) return found.met;
    if (category === 'strength') return 4.0;
    if (category === 'yoga') return 2.5;
    return 6.0;
  };

  const calculateCaloriesBurned = (log, bodyWeight) => {
    const met = getMETForExercise(log.name);
    let durationMins = log.durationMins || 0;

    if (durationMins === 0 && log.sets) {
      durationMins = log.sets * 1.5;
    }

    if (durationMins === 0) return 0;
    return Math.round((met * 3.5 * bodyWeight) / 200 * durationMins);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const finalName = isCustom ? customExerciseName.trim() : exerciseName;
    if (!finalName) {
      setError('Please select or type an exercise name.');
      return;
    }

    const durationVal = duration ? parseFloat(duration) : undefined;
    const setsVal = sets ? parseInt(sets, 10) : undefined;
    const repsVal = reps ? parseInt(reps, 10) : undefined;
    const weightVal = weight ? parseFloat(weight) : undefined;

    if (category === 'cardio' && !durationVal) {
      setError('Duration is required for cardio activities.');
      return;
    }

    if (category === 'yoga' && !durationVal) {
      setError('Duration is required for yoga sessions.');
      return;
    }

    if (category === 'strength' && !setsVal && !durationVal) {
      setError('Please provide either Sets or Duration for strength exercises.');
      return;
    }

    addExerciseLog({
      username: user.username,
      date: logDate,
      name: finalName,
      reps: repsVal,
      sets: setsVal,
      durationMins: durationVal,
      weightKg: weightVal,
    });

    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    setCustomExerciseName('');
    setIsCustom(false);
    setShowLogModal(false);
    loadLogs();
  };

  const handleDeleteLog = (id) => {
    deleteExerciseLog(id);
    loadLogs();
  };

  // Daily statistics
  const totalWorkouts = logs.length;
  const totalDuration = logs.reduce((sum, log) => sum + (log.durationMins || (log.sets ? log.sets * 1.5 : 0)), 0);
  const totalCalories = logs.reduce((sum, log) => sum + calculateCaloriesBurned(log, user.weight), 0);

  // SVG Chart: Last 7 Days of Active Duration
  const getLast7DaysActive = () => {
    const list = [];
    const dateObj = new Date(selectedDate);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(dateObj);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dailyLogs = getExerciseLogs(user.username, dateStr);

      const mins = dailyLogs.reduce((sum, log) => sum + (log.durationMins || (log.sets ? log.sets * 1.5 : 0)), 0);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = d.getDate();

      list.push({
        date: dateStr,
        dayLabel: `${dayLabel} ${dateNum}`,
        mins,
      });
    }
    return list;
  };

  const chartData = getLast7DaysActive();
  const maxMins = Math.max(...chartData.map((d) => d.mins), 30);

  // SVG Chart layout
  const width = 600;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  return (
    <div className="animate-fade exercise-container">
      {/* Top Banner Dashboard Stats */}
      <div className="exercise-stats-grid">
        {/* Workouts Logged Card */}
        <div className="glass-card exercise-stat-card">
          <div className="exercise-icon-workouts">
            <Dumbbell size={24} />
          </div>
          <div>
            <h4 className="exercise-stat-label">Workouts Today</h4>
            <div className="text-mono exercise-stat-val">
              {totalWorkouts}
            </div>
          </div>
        </div>

        {/* Active Duration Card */}
        <div className="glass-card exercise-stat-card">
          <div className="exercise-icon-duration">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="exercise-stat-label">Active Time</h4>
            <div className="text-mono exercise-stat-val">
              {totalDuration} <span className="exercise-stat-unit">mins</span>
            </div>
          </div>
        </div>

        {/* Calories Burned Card */}
        <div className="glass-card exercise-stat-card">
          <div className="exercise-icon-calories">
            <Flame size={24} />
          </div>
          <div>
            <h4 className="exercise-stat-label">Calories Burned</h4>
            <div className="text-mono exercise-stat-val">
              {totalCalories} <span className="exercise-stat-unit">kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Exercise List/Logger & Chart */}
      <div className="exercise-grid-columns">
        {/* Logs and Activities Table */}
        <div className="glass-card" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '16px',
            marginBottom: '16px',
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={20} style={{ color: '#ef4444' }} />
                Exercise Log
              </h3>
              <p className="text-muted-desc" style={{ marginTop: '2px' }}>Track your strength, cardio, and yoga sessions.</p>
            </div>
            <button
              onClick={() => setShowLogModal(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px' }}
            >
              <Plus size={18} />
              Log Exercise
            </button>
          </div>

          {/* Logged exercises list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {logs.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                gap: '12px',
                padding: '40px 0',
              }}>
                <Dumbbell size={48} style={{ opacity: 0.2 }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>No activities logged for today</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Click "Log Exercise" to track your first workout.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {logs.map((log) => {
                  const met = getMETForExercise(log.name);
                  const calories = calculateCaloriesBurned(log, user.weight);

                  return (
                    <div
                      key={log.id}
                      className="exercise-log-item"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          backgroundColor: 'var(--primary-glow)',
                          color: 'var(--primary)',
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Dumbbell size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{log.name}</h4>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            marginTop: '4px',
                          }}>
                            {log.sets && <span><strong>{log.sets}</strong> sets</span>}
                            {log.reps && <span><strong>{log.reps}</strong> reps</span>}
                            {log.weightKg && <span><strong>{log.weightKg}</strong> kg</span>}
                            {log.durationMins && <span><strong>{log.durationMins}</strong> mins</span>}
                            <span style={{ color: 'var(--primary)' }}>Estimated MET: {met}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span className="text-mono" style={{ fontWeight: 800, fontSize: '1rem', color: '#ef4444', display: 'block' }}>
                            -{calories} kcal
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>burned</span>
                        </div>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.2s',
                          }}
                          className="delete-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Activity Summary Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
              Weekly Summary
            </h3>
            <p className="text-muted-desc" style={{ marginTop: '2px' }}>Active minutes over the last 7 days.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', overflow: 'visible' }}>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" style={{ overflow: 'visible' }}>
              {/* Y Axis Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const yVal = paddingTop + chartHeight - ratio * chartHeight;
                const minLabel = Math.round(ratio * maxMins);
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingLeft}
                      y1={yVal}
                      x2={width - paddingRight}
                      y2={yVal}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={yVal + 4}
                      fill="var(--text-muted)"
                      fontSize="10"
                      textAnchor="end"
                      className="text-mono"
                    >
                      {minLabel}m
                    </text>
                  </g>
                );
              })}

              {/* Bars and labels */}
              {chartData.map((d, index) => {
                const colWidth = chartWidth / chartData.length;
                const barWidth = Math.min(24, colWidth * 0.5);
                const x = paddingLeft + index * colWidth + colWidth / 2 - barWidth / 2;

                const barHeight = (d.mins / maxMins) * chartHeight;
                const y = paddingTop + chartHeight - barHeight;
                const isSelected = d.date === selectedDate;

                return (
                  <g key={d.date}>
                    <rect
                      x={x - 4}
                      y={paddingTop}
                      width={barWidth + 8}
                      height={chartHeight}
                      fill="transparent"
                      rx="4"
                      className="chart-hover-zone"
                      style={{ cursor: 'pointer' }}
                    />

                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 2)}
                      fill={isSelected ? 'var(--primary)' : 'var(--primary-glow)'}
                      stroke={isSelected ? 'var(--primary)' : 'transparent'}
                      rx="4"
                      style={{ transition: 'all 0.3s' }}
                    />

                    {d.mins > 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={y - 6}
                        fill="var(--text-primary)"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                        className="text-mono"
                      >
                        {d.mins}m
                      </text>
                    )}

                    <text
                      x={x + barWidth / 2}
                      y={paddingTop + chartHeight + 16}
                      fill={isSelected ? 'var(--primary)' : 'var(--text-muted)'}
                      fontSize="10"
                      fontWeight={isSelected ? '700' : '500'}
                      textAnchor="middle"
                    >
                      {d.dayLabel}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Line */}
              <line
                x1={paddingLeft}
                y1={paddingTop + chartHeight}
                x2={width - paddingRight}
                y2={paddingTop + chartHeight}
                stroke="var(--border)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-glow)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px',
            marginTop: '8px',
          }}>
            <Sparkles size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              <strong>Tip:</strong> Mix yoga sessions with cardio or strength workouts to keep your routine balanced and promote active recovery.
            </span>
          </div>
        </div>
      </div>

      {/* Log Exercise Modal */}
      {showLogModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
        }} className="animate-fade">
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Log Workout / Yoga</h3>
              <button
                onClick={() => setShowLogModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category selector */}
              <div>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Activity Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {['cardio', 'strength', 'yoga'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`btn ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 4px', textTransform: 'capitalize', fontSize: '0.85rem' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Predefined exercise selection or custom toggle */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label">Exercise / Pose</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustom(!isCustom);
                      setCustomExerciseName('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isCustom ? 'Select from list' : 'Type custom activity'}
                  </button>
                </div>

                {isCustom ? (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Zumba, Bench Press, Plank Pose"
                    value={customExerciseName}
                    onChange={(e) => setCustomExerciseName(e.target.value)}
                    required
                  />
                ) : (
                  <select
                    className="form-input"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {PREDEFINED_EXERCISES.filter((e) => e.category === category).map((e) => (
                      <option key={e.name} value={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                )}
                {!isCustom && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    {PREDEFINED_EXERCISES.find((e) => e.name === exerciseName)?.description}
                  </span>
                )}
              </div>

              {/* Dynamic input fields based on exercise type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {category === 'strength' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Sets</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="form-input"
                      placeholder="e.g. 3"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                    />
                  </div>
                )}

                {category === 'strength' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Reps per set</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      className="form-input"
                      placeholder="e.g. 12"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                    />
                  </div>
                )}

                {category === 'strength' && (
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                    <label className="form-label">Weight lifted (kg, optional)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="500"
                      className="form-input"
                      placeholder="e.g. 20 (leave empty for bodyweight)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label className="form-label">
                    Duration (minutes {category !== 'strength' ? '*' : 'optional'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    className="form-input"
                    placeholder="e.g. 30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required={category !== 'strength'}
                  />
                </div>
              </div>

              {/* Date Input */}
              <div className="form-group">
                <label className="form-label">Workout Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 20px' }}
                >
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise;
