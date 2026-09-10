import React, { useEffect, useState } from 'react';
import { LogOut, Sun, Moon, Flame, Apple, Activity, User, Dumbbell } from 'lucide-react';
import './Header.css';

export const Header = ({ user, activeTab, setActiveTab, onLogout }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'food-logs', label: 'Food Log' },
    { id: 'exercise', label: 'Exercises' },
    { id: 'weight-tracker', label: 'Weight Progress' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo-wrapper" onClick={() => setActiveTab('dashboard')}>
          <div className="header-logo-badge">
            <Flame size={20} fill="var(--primary)" style={{ color: 'var(--primary)' }} />
            <span className="header-logo-text">
              <span className="header-logo-fit">Fit</span>
              <span className="header-logo-life">Life</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side settings */}
        <div className="header-actions">
          {user.photo && (
            <img
              src={user.photo}
              alt="Profile"
              className="header-avatar"
            />
          )}
          <div className="header-profile-info">
            <span className="header-profile-username">@{user.username}</span>
            <span className="header-profile-goal">
              Goal: {user.goal === 'lose' ? 'Weight Loss' : user.goal === 'gain' ? 'Muscle Gain' : 'Maintenance'}
            </span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-secondary btn-icon-only header-btn-icon"
            title="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={onLogout}
            className="btn btn-secondary btn-icon-only header-btn-logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.id === 'dashboard' && <Flame size={20} fill={isActive ? 'currentColor' : 'none'} />}
              {item.id === 'food-logs' && <Apple size={20} />}
              {item.id === 'exercise' && <Dumbbell size={20} />}
              {item.id === 'weight-tracker' && <Activity size={20} />}
              {item.id === 'profile' && <User size={20} />}
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
