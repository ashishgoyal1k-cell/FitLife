import React, { useState, useEffect } from 'react';
import { calculateMacroTargets, setCurrentUser } from '../utils/db';
import { Scale, Ruler, Sparkles, Flame, Check } from 'lucide-react';
import { PhotoCapture } from './PhotoCapture';
import './Profile.css';

export const Profile = ({ user, onUpdate, isInitialSetup = false }) => {
  const [age, setAge] = useState(user.age);
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height);
  const [gender, setGender] = useState(user.gender);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel);
  const [goal, setGoal] = useState(user.goal);
  const [targetWeight, setTargetWeight] = useState(user.targetWeight || user.weight);
  const [photo, setPhoto] = useState(user.photo);

  const [saved, setSaved] = useState(false);

  // Live calculated values
  const [liveTargets, setLiveTargets] = useState({
    calories: user.targetCalories,
    protein: user.targetProtein,
    carbs: user.targetCarbs,
    fat: user.targetFat,
  });

  useEffect(() => {
    const targets = calculateMacroTargets(weight, height, age, gender, activityLevel, goal);
    setLiveTargets(targets);
  }, [age, weight, height, gender, activityLevel, goal]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(false);

    const updatedProfile = {
      username: user.username,
      age,
      weight,
      height,
      gender,
      activityLevel,
      goal,
      targetWeight,
      targetCalories: liveTargets.calories,
      targetProtein: liveTargets.protein,
      targetCarbs: liveTargets.carbs,
      targetFat: liveTargets.fat,
      photo,
    };

    setCurrentUser(updatedProfile);
    onUpdate(updatedProfile);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-slide-up profile-container">
      <div className="profile-header">
        <h2 className="profile-header-title">
          {isInitialSetup ? 'Welcome to FitLife! Setup Your Profile' : 'Configure Your Goals'}
        </h2>
        <p className="text-muted-desc">
          {isInitialSetup
            ? 'Please enter your current body measurements and goals so we can calculate a tailored daily calorie budget.'
            : 'Update your weight, height, activity level, or calorie goal. Changes apply instantly to your budget.'}
        </p>
      </div>

      <div className="profile-layout-grid">
        {/* Left Side: Edit Form */}
        <div className="glass-card">
          <form onSubmit={handleSave}>
            <div className="profile-photo-wrapper">
              <PhotoCapture
                photo={photo}
                onPhotoChange={setPhoto}
                label="Profile Picture / Current Shape (Optional)"
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="profile-gender-group">
                  <button
                    type="button"
                    className={`btn ${gender === 'male' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setGender('male')}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={`btn ${gender === 'female' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setGender('female')}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Age (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="form-input"
                  value={age}
                  onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Current Weight (kg)</label>
                <div className="profile-input-icon-wrapper">
                  <Scale size={16} className="profile-input-icon" />
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    className="form-input profile-input-with-icon"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(20, parseFloat(e.target.value) || 0))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <div className="profile-input-icon-wrapper">
                  <Ruler size={16} className="profile-input-icon" />
                  <input
                    type="number"
                    min="50"
                    max="270"
                    className="form-input profile-input-with-icon"
                    value={height}
                    onChange={(e) => setHeight(Math.max(50, parseInt(e.target.value) || 0))}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Target Weight (kg)</label>
                <div className="profile-input-icon-wrapper">
                  <Scale size={16} className="profile-input-icon" />
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    className="form-input profile-input-with-icon"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Math.max(20, parseFloat(e.target.value) || 0))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Weight Goal</label>
                <select
                  className="form-input form-select"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="lose">Weight Loss (Lose fat)</option>
                  <option value="maintain">Maintain Weight (Healthy balance)</option>
                  <option value="gain">Weight Gain (Build muscle)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Weekly Activity Level</label>
              <select
                className="form-input form-select"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <option value="sedentary">Sedentary (Little/no exercise, desk job)</option>
                <option value="light">Lightly Active (Light exercise 1-3 days/week)</option>
                <option value="moderate">Moderately Active (Moderate exercise 3-5 days/week)</option>
                <option value="active">Very Active (Heavy workouts/sports 6-7 days/week)</option>
              </select>
            </div>

            <div className="profile-submit-row">
              <button type="submit" className="btn btn-primary profile-submit-btn">
                {isInitialSetup ? 'Complete Setup' : 'Save Changes'}
              </button>
            </div>

            {saved && (
              <div className="alert-box alert-success animate-fade profile-success-alert">
                <Check size={18} />
                <span>Profile updated successfully! Calorie budget refreshed.</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Interactive Summary Box */}
        <div className="profile-sidebar">
          <div className="glass-card profile-targets-card">
            <h3 className="profile-targets-header">
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              Calculated Daily Targets
            </h3>

            <div className="profile-calorie-box">
              <span className="text-muted-desc profile-calorie-label">Calories Budget</span>
              <div className="profile-calorie-number">
                <Flame size={28} style={{ color: 'var(--primary)' }} />
                {liveTargets.calories} <span className="profile-calorie-unit">kcal</span>
              </div>
            </div>

            <div className="profile-macros-row">
              <div>
                <span className="text-muted-desc" style={{ fontSize: '0.8rem' }}>Carbs</span>
                <div className="profile-macro-val-carbs">{liveTargets.carbs}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45%</div>
              </div>

              <div className="profile-macro-divider">
                <span className="text-muted-desc" style={{ fontSize: '0.8rem' }}>Protein</span>
                <div className="profile-macro-val-protein">{liveTargets.protein}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>25%</div>
              </div>

              <div>
                <span className="text-muted-desc" style={{ fontSize: '0.8rem' }}>Fat</span>
                <div className="profile-macro-val-fat">{liveTargets.fat}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>30%</div>
              </div>
            </div>
          </div>

          <div className="glass-card profile-metrics-card">
            <h4 style={{ marginBottom: '8px' }}>Metabolic Metrics</h4>
            <div className="profile-metric-row profile-metric-border">
              <span style={{ color: 'var(--text-secondary)' }}>Basal Metabolic Rate (BMR):</span>
              <span className="text-mono" style={{ fontWeight: 600 }}>
                {Math.round(weight * 10 + height * 6.25 - age * 5 + (gender === 'male' ? 5 : -161))} kcal
              </span>
            </div>
            <div className="profile-metric-row">
              <span style={{ color: 'var(--text-secondary)' }}>Daily Maintenance (TDEE):</span>
              <span className="text-mono" style={{ fontWeight: 600 }}>
                {Math.round(
                  weight * 10 +
                    height * 6.25 -
                    age * 5 +
                    (gender === 'male' ? 5 : -161) *
                      (activityLevel === 'sedentary'
                        ? 1.2
                        : activityLevel === 'light'
                        ? 1.375
                        : activityLevel === 'moderate'
                        ? 1.55
                        : 1.725)
                )}{' '}
                kcal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
