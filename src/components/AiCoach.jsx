import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import './AiCoach.css';

export function AiCoach({ user, meals, exercises, waterMl, sleepHours }) {
  const [advice, setAdvice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: user,
          meals: meals.map(({ name, calories, protein, carbs, fat, mealType }) => ({ name, calories, protein, carbs, fat, mealType })),
          exercises: exercises.map(({ name, durationMins, sets, reps }) => ({ name, durationMins, sets, reps })),
          waterMl,
          sleepHours,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to get coaching advice.');
      }
      setAdvice(data.advice || 'No advice was returned.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to get coaching advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-card ai-coach-card" aria-labelledby="ai-coach-title">
      <div className="ai-coach-header">
        <div>
          <h3 id="ai-coach-title" className="ai-coach-title">
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            AI Health Coach <span className="ai-badge">Gemini Flash</span>
          </h3>
          <p className="text-muted-desc">Get personalized, actionable wellness guidance from your day’s logged habits.</p>
        </div>
        <div className="ai-coach-actions">
          <button
            type="button"
            onClick={getAdvice}
            disabled={loading}
            className="btn btn-primary ai-coach-btn"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Analyzing Habits...</span>
              </>
            ) : advice ? (
              <>
                <RefreshCw size={16} />
                <span>Refresh Advice</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Get Today's Advice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="ai-coach-error">
          <span>{error}</span>
        </div>
      )}

      {advice && (
        <div className="ai-coach-advice-card animate-slide-up">
          <p className="ai-coach-advice-text">{advice}</p>
        </div>
      )}

      <p className="ai-coach-disclaimer">
        General wellness guidance powered by FitLife AI Health Coach. For clinical or medical concerns, always consult a qualified healthcare provider.
      </p>
    </section>
  );
}
