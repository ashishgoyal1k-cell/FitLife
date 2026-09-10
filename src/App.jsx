import React, { useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser } from './utils/db';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FoodLogs } from './components/FoodLogs';
import { WeightTracker } from './components/WeightTracker';
import { Profile } from './components/Profile';
import { Exercise } from './components/Exercise';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isInitialSetup, setIsInitialSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status on load
  useEffect(() => {
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (loggedUser, isNewUser) => {
    setUser(loggedUser);
    if (isNewUser) {
      setIsInitialSetup(true);
      setActiveTab('profile');
    } else {
      setIsInitialSetup(false);
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setIsInitialSetup(false);
    setActiveTab('dashboard');
  };

  const handleRefreshUser = (updatedProfile) => {
    setUser(updatedProfile);
    if (isInitialSetup) {
      setIsInitialSetup(false);
      setActiveTab('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-content">
          <div className="app-spinner" />
          <span style={{ fontWeight: 600 }}>Loading FitLife...</span>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!user) {
    return (
      <main className="app-auth-container">
        <Auth onAuthSuccess={handleAuthSuccess} />
      </main>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Shared Header Navigation */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Tabs Container */}
      <main className="app-container app-main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setActiveTab={setActiveTab}
            onWeightLogged={() => handleRefreshUser(getCurrentUser() || user)}
            onUserUpdated={() => handleRefreshUser(getCurrentUser() || user)}
          />
        )}

        {activeTab === 'food-logs' && (
          <FoodLogs
            user={user}
            selectedDate={selectedDate}
          />
        )}

        {activeTab === 'exercise' && (
          <Exercise
            user={user}
            selectedDate={selectedDate}
          />
        )}

        {activeTab === 'weight-tracker' && (
          <WeightTracker
            user={user}
            onWeightLogged={() => handleRefreshUser(getCurrentUser() || user)}
          />
        )}

        {activeTab === 'profile' && (
          <Profile
            user={user}
            onUpdate={handleRefreshUser}
            isInitialSetup={isInitialSetup}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <p>© {new Date().getFullYear()} FitLife. All rights reserved.</p>
          <p className="app-footer-subtext">
            MVP Phase 1 • Local Storage Serverless Database • Tailored for Indian Food Nutrients
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
