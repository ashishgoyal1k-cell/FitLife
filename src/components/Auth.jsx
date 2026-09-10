import React, { useState, useEffect } from 'react';
import { getAllUsers, setCurrentUser } from '../utils/db';
import { Flame, Eye, EyeOff, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import './Auth.css';

export const Auth = ({ onAuthSuccess }) => {
  // Mode: true for "Log In", false for "Sign Up"
  const [isLogin, setIsLogin] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('fitlife_remember_email') || localStorage.getItem('healthify_remember_email') || '');
  const [contactNumber, setContactNumber] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('maintain');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status Alerts
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    setError('');
    setSuccessMessage('');
  }, [isLogin]);

  // Handle Log In Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('fitlife_remember_email', cleanEmail);
      } else {
        localStorage.removeItem('fitlife_remember_email');
        localStorage.removeItem('healthify_remember_email');
      }

      const users = getAllUsers();
      const pwdKey = `fitlife_pwd_${cleanEmail}`;
      const savedPwd = localStorage.getItem(pwdKey) || localStorage.getItem(`healthify_pwd_${cleanEmail}`);

      // Check existing user by email key or username
      let matchedUser = users[cleanEmail];
      if (!matchedUser) {
        const prefix = cleanEmail.split('@')[0];
        matchedUser = users[prefix] || Object.values(users).find(
          (u) => u.username.toLowerCase() === prefix || u.username.toLowerCase() === cleanEmail
        );
      }

      if (matchedUser) {
        if (savedPwd && savedPwd !== password) {
          setError('Invalid password. Please try again or click Forgot Password.');
          setLoading(false);
          return;
        }
        setCurrentUser(matchedUser);
        onAuthSuccess(matchedUser, false);
      } else {
        // Create user profile on first login
        const newProfile = createProfile(cleanEmail.split('@')[0], 'maintain');
        localStorage.setItem(pwdKey, password);
        const all = getAllUsers();
        all[cleanEmail] = newProfile;
        localStorage.setItem('fitlife_users', JSON.stringify(all));
        setCurrentUser(newProfile);
        onAuthSuccess(newProfile, true);
      }
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const users = getAllUsers();
      if (users[cleanEmail]) {
        setError('An account with this email already exists. Please log in.');
        setLoading(false);
        return;
      }

      // Save password
      localStorage.setItem(`fitlife_pwd_${cleanEmail}`, password);
      if (rememberMe) {
        localStorage.setItem('fitlife_remember_email', cleanEmail);
      }

      // Create profile
      const newProfile = createProfile(cleanName, fitnessGoal, contactNumber.trim());
      users[cleanEmail] = newProfile;
      users[cleanName.toLowerCase()] = newProfile;
      localStorage.setItem('fitlife_users', JSON.stringify(users));

      setCurrentUser(newProfile);
      onAuthSuccess(newProfile, true);
    } catch {
      setError('Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Account Chooser
  const handleGoogleSelect = (gUser) => {
    setShowGoogleModal(false);
    setError('');

    const cleanEmail = gUser.email.toLowerCase();
    const cleanName = gUser.name;
    const users = getAllUsers();
    const existing = users[cleanEmail] || users[cleanEmail.split('@')[0]];

    if (existing) {
      setCurrentUser(existing);
      onAuthSuccess(existing, false);
    } else {
      const newProfile = createProfile(cleanName, 'maintain');
      users[cleanEmail] = newProfile;
      localStorage.setItem('fitlife_users', JSON.stringify(users));
      setCurrentUser(newProfile);
      onAuthSuccess(newProfile, true);
    }
  };

  // Profile Factory (Pure JS)
  const createProfile = (name, goal, contact = '') => {
    const goalVal = goal || 'maintain';
    return {
      username: name || 'User',
      contactNumber: contact || '',
      age: 25,
      weight: 70,
      height: 170,
      gender: 'male',
      activityLevel: 'moderate',
      goal: goalVal,
      targetCalories: goalVal === 'lose' ? 1800 : (goalVal === 'gain' ? 2400 : 2000),
      targetProtein: 130,
      targetCarbs: 220,
      targetFat: 65,
      waterTarget: 2500,
      sleepTarget: 8,
    };
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetDone(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setResetDone(false);
      setSuccessMessage(`Password reset instructions sent to ${resetEmail}`);
    }, 1200);
  };

  return (
    <div className="auth-container">
      <div className="glass-card animate-fade auth-card">
        {/* Brand Logo & Name (Original FitLife Branding) */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Flame size={24} fill="var(--primary)" style={{ color: 'var(--primary)' }} />
            <span className="auth-brand-name">
              <span className="auth-brand-fit">Fit</span>
              <span className="auth-brand-life">Life</span>
            </span>
          </div>

          <h1 className="auth-title">
            {isLogin ? (
              <>Welcome <span className="auth-title-accent">Back!</span></>
            ) : (
              <>Create <span className="auth-title-accent">Account</span></>
            )}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Log in to continue tracking your meals & fitness'
              : 'Join FitLife and begin your health transformation'}
          </p>
        </div>

        {/* Tab Switcher: Log In / Sign Up */}
        <div className="auth-tabs">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="animate-fade auth-alert-error">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="animate-fade auth-alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-password-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="auth-options-row">
              <label className="auth-remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>Remember for 30 days</span>
              </label>

              <button
                type="button"
                className="auth-forgot-btn"
                onClick={() => {
                  setResetEmail(email);
                  setShowForgotPasswordModal(true);
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Log In Button */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              className="btn btn-secondary auth-google-btn"
              onClick={() => setShowGoogleModal(true)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.4 3.66 1.48 7.55l3.77 2.92C6.15 7.57 8.85 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.11 2.73-2.36 3.57l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.59z" />
                <path fill="#FBBC05" d="M5.25 14.77c-.25-.75-.39-1.55-.39-2.37s.14-1.62.39-2.37L1.48 7.11C.53 9.02 0 11.16 0 13.4s.53 4.38 1.48 6.29l3.77-2.92z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.7-2.87c-1.02.68-2.33 1.09-3.58 1.09-3.15 0-5.85-2.53-6.75-5.43L1.48 16.03C3.4 19.92 7.37 23 12 23z" />
              </svg>
              <span>Log in with Google</span>
            </button>

            {/* Switch to Sign Up */}
            <div className="auth-footer-text">
              <span>Don't have an account? </span>
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 XXXXXXXXXX"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select
                className="form-input form-select"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="lose">Weight Loss (Calorie Deficit)</option>
                <option value="maintain">Maintain Fitness & Health</option>
                <option value="gain">Muscle Gain (Hypertrophy)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-password-input"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Primary Sign Up Button */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              className="btn btn-secondary auth-google-btn"
              onClick={() => setShowGoogleModal(true)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.4 3.66 1.48 7.55l3.77 2.92C6.15 7.57 8.85 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.11 2.73-2.36 3.57l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.59z" />
                <path fill="#FBBC05" d="M5.25 14.77c-.25-.75-.39-1.55-.39-2.37s.14-1.62.39-2.37L1.48 7.11C.53 9.02 0 11.16 0 13.4s.53 4.38 1.48 6.29l3.77-2.92z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.7-2.87c-1.02.68-2.33 1.09-3.58 1.09-3.15 0-5.85-2.53-6.75-5.43L1.48 16.03C3.4 19.92 7.37 23 12 23z" />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Switch to Log In */}
            <div className="auth-footer-text">
              <span>Already have an account? </span>
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <div className="auth-modal-overlay">
          <div className="glass-card animate-fade auth-modal-card">
            <div className="auth-modal-header">
              <svg viewBox="0 0 24 24" width="32" height="32" style={{ display: 'block', margin: '0 auto 12px auto' }}>
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.4 3.66 1.48 7.55l3.77 2.92C6.15 7.57 8.85 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.11 2.73-2.36 3.57l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.59z" />
                <path fill="#FBBC05" d="M5.25 14.77c-.25-.75-.39-1.55-.39-2.37s.14-1.62.39-2.37L1.48 7.11C.53 9.02 0 11.16 0 13.4s.53 4.38 1.48 6.29l3.77-2.92z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.7-2.87c-1.02.68-2.33 1.09-3.58 1.09-3.15 0-5.85-2.53-6.75-5.43L1.48 16.03C3.4 19.92 7.37 23 12 23z" />
              </svg>
              <h3 className="auth-modal-title">Choose an account</h3>
              <p className="auth-modal-subtitle">to continue to FitLife</p>
            </div>

            <div style={{ padding: '8px 0' }}>
              {[
                { name: 'Ashish Goyal', email: 'ashishgoyal@gmail.com', avatar: 'AG' },
                { name: 'Fit Explorer', email: 'fit.explorer@gmail.com', avatar: 'FE' },
              ].map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => handleGoogleSelect(acc)}
                  className="auth-google-item"
                >
                  <div className="auth-google-avatar">
                    {acc.avatar}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{acc.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{acc.email}</span>
                  </div>
                  <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="auth-modal-overlay">
          <div className="glass-card animate-fade auth-modal-card">
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">Reset Password</h3>
              <p className="auth-modal-subtitle">
                Enter your email address to receive reset instructions
              </p>
            </div>
            <form onSubmit={handleForgotPassword} style={{ padding: '20px 24px' }}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                >
                  {resetDone ? 'Sent!' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
