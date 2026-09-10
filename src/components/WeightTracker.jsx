import React, { useState, useEffect } from 'react';
import { getWeightLogs, saveWeightLog, deleteWeightLog } from '../utils/db';
import { Scale, Calendar, Trash2, TrendingDown, Target, List, Image as ImageIcon, X } from 'lucide-react';
import { PhotoCapture } from './PhotoCapture';
import './WeightTracker.css';

export const WeightTracker = ({ user, onWeightLogged }) => {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [photo, setPhoto] = useState(undefined);
  const [error, setError] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Lightbox Modal state for full progress photo view
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [user]);

  const loadLogs = () => {
    setLogs(getWeightLogs(user.username));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const wt = parseFloat(weight);
    if (!wt || wt <= 20 || wt > 300) {
      setError('Please enter a valid weight between 20kg and 300kg');
      return;
    }

    saveWeightLog(user.username, date, wt, photo);
    setWeight('');
    setPhoto(undefined);
    loadLogs();
    onWeightLogged();
  };

  const handleDelete = (logDate) => {
    deleteWeightLog(user.username, logDate);
    loadLogs();
    onWeightLogged();
  };

  // SVG Chart Configurations
  const width = 600;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute weight ranges (including target weight if specified)
  const targetWt = user.targetWeight || user.weight;
  const allWeights = [...logs.map((l) => l.weight), targetWt];
  const minW = Math.min(...allWeights, user.weight);
  const maxW = Math.max(...allWeights, user.weight);

  // Pad values slightly for chart boundaries
  const paddingWeight = (maxW - minW) * 0.15 || 2;
  const yMin = Math.max(10, minW - paddingWeight);
  const yMax = maxW + paddingWeight;

  // Map log data points to SVG coordinate space
  const points = logs.map((log, index) => {
    const x =
      logs.length > 1
        ? paddingLeft + (index * chartWidth) / (logs.length - 1)
        : paddingLeft + chartWidth / 2;
    const y = paddingTop + chartHeight - ((log.weight - yMin) / (yMax - yMin)) * chartHeight;
    return { x, y, weight: log.weight, date: log.date };
  });

  // Generate Path strings
  let linePath = '';
  let areaPath = '';
  if (points.length > 0) {
    linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${
      paddingTop + chartHeight
    } Z`;
  }

  // Target line y coordinate
  const targetY = paddingTop + chartHeight - ((targetWt - yMin) / (yMax - yMin)) * chartHeight;

  // Format short date (e.g. Jun 24)
  const formatShortDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="animate-slide-up weight-tracker-container">
      <div>
        <h2 className="weight-header-title">Weight Progression</h2>
        <p className="text-muted-desc">Log your body weight consistently and track your journey toward your fitness goal.</p>
      </div>

      <div className="weight-layout-grid">
        {/* Left Side: Chart & Status cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Custom SVG Line Chart */}
          <div className="glass-card" style={{ position: 'relative' }}>
            <div className="weight-chart-header">
              <h3 className="weight-chart-title">
                <TrendingDown size={18} style={{ color: 'var(--primary)' }} />
                Progress Chart
              </h3>
              <div className="weight-chart-legend">
                <span className="weight-legend-item">
                  <span className="weight-legend-bar-primary" />
                  Weight History
                </span>
                <span className="weight-legend-item">
                  <span className="weight-legend-bar-target" />
                  Target: {targetWt} kg
                </span>
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="weight-empty-chart">
                <Scale size={48} style={{ color: 'var(--border)' }} />
                <span>Please log some weight entries to display your graph.</span>
              </div>
            ) : (
              <div className="weight-chart-container">
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '320px', height: '100%', display: 'block' }}>
                  <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines (y-axis points) */}
                  {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
                    const wtLabel = Math.round(yMin + val * (yMax - yMin));
                    const yPos = paddingTop + chartHeight - val * chartHeight;
                    return (
                      <g key={idx}>
                        <line x1={paddingLeft} y1={yPos} x2={width - paddingRight} y2={yPos} className="chart-grid" />
                        <text x={paddingLeft - 8} y={yPos + 4} textAnchor="end" style={{ fill: 'var(--text-secondary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                          {wtLabel}kg
                        </text>
                      </g>
                    );
                  })}

                  {/* Dotted Target Weight line */}
                  {targetY >= paddingTop && targetY <= paddingTop + chartHeight && (
                    <line
                      x1={paddingLeft}
                      y1={targetY}
                      x2={width - paddingRight}
                      y2={targetY}
                      stroke="var(--tertiary)"
                      strokeWidth="2"
                      strokeDasharray="4,6"
                    />
                  )}

                  {/* Area fill */}
                  {areaPath && <path d={areaPath} className="chart-area" />}

                  {/* Line path */}
                  {linePath && <path d={linePath} className="chart-line" />}

                  {/* Data points */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r="5"
                      className="chart-point"
                      onMouseEnter={() => setHoveredPoint({ index: idx, x: p.x, y: p.y, weight: p.weight, date: p.date })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}

                  {/* X-axis date labels */}
                  {logs.map((log, index) => {
                    const showLabel = logs.length <= 6 || index === 0 || index === logs.length - 1 || index === Math.floor(logs.length / 2);
                    if (!showLabel) return null;

                    const x = paddingLeft + (index * chartWidth) / (logs.length - 1);
                    return (
                      <text
                        key={index}
                        x={x}
                        y={height - paddingBottom + 20}
                        textAnchor="middle"
                        style={{ fill: 'var(--text-secondary)', fontSize: '10px', fontWeight: 600 }}
                      >
                        {formatShortDate(log.date)}
                      </text>
                    );
                  })}
                </svg>

                {/* Tooltip Hover Overlay */}
                {hoveredPoint && (
                  <div
                    className="animate-fade weight-tooltip"
                    style={{
                      left: `${(hoveredPoint.x / width) * 100}%`,
                      top: `${(hoveredPoint.y / height) * 100 - 15}%`,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{hoveredPoint.weight} kg</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{formatShortDate(hoveredPoint.date)}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Goals status card */}
          <div className="weight-stat-grid">
            <div className="glass-card weight-stat-card">
              <div className="weight-stat-icon-box">
                <Scale size={24} />
              </div>
              <div>
                <span className="text-muted-desc" style={{ fontSize: '0.8rem' }}>Current Weight</span>
                <h4 style={{ fontSize: '1.2rem', marginTop: '2px' }}>{user.weight} kg</h4>
              </div>
            </div>

            <div className="glass-card weight-stat-card">
              <div className="weight-stat-icon-target">
                <Target size={24} />
              </div>
              <div>
                <span className="text-muted-desc" style={{ fontSize: '0.8rem' }}>Target Goal</span>
                <h4 style={{ fontSize: '1.2rem', marginTop: '2px' }}>{targetWt} kg</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Log Form & Recent Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={18} style={{ color: 'var(--primary)' }} />
              Log Body Weight
            </h3>

            {error && (
              <div className="alert-box alert-danger animate-fade" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="date"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <div style={{ position: 'relative' }}>
                  <Scale size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    placeholder="e.g. 72.5"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <PhotoCapture
                  photo={photo}
                  onPhotoChange={setPhoto}
                  label="Progress Photo (Optional)"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Save Weight Entry
              </button>
            </form>
          </div>

          {/* History List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <List size={18} style={{ color: 'var(--primary)' }} />
              Recent Logs
            </h3>

            <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                  No logs recorded yet.
                </div>
              ) : (
                [...logs].reverse().map((log) => (
                  <div key={log.date} className="weight-log-item">
                    <div>
                      <div style={{ fontWeight: 600 }}>{formatShortDate(log.date)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {log.photo && (
                        <img
                          src={log.photo}
                          alt="Progress Thumbnail"
                          onClick={() => setLightboxPhoto({ url: log.photo, date: log.date, weight: log.weight })}
                          className="weight-thumbnail"
                        />
                      )}
                      <span className="text-mono" style={{ fontWeight: 700 }}>{log.weight} kg</span>
                      <button
                        onClick={() => handleDelete(log.date)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Delete log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Progress Photos */}
      {lightboxPhoto && (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setLightboxPhoto(null)}>
          <div
            className="modal-content animate-fade weight-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="weight-lightbox-header">
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                Progress Picture - {lightboxPhoto.date}
              </span>
              <button
                onClick={() => setLightboxPhoto(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={lightboxPhoto.url}
              alt="Weight Progress"
              className="weight-lightbox-img"
            />
            <div className="weight-lightbox-footer">
              Weight Logged: {lightboxPhoto.weight} kg
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
