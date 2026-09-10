import React, { useState, useEffect } from 'react';
import { getAllUsers, getFoods, addFood, updateFood, deleteFood, resetFoodsToDefaults } from '../utils/db';
import { Trash2, Edit, Plus, Search, Users, Flame, RefreshCw, X, Database, Sparkles, TrendingUp, Lock, ShieldCheck, KeyRound, LogOut, Eye, EyeOff, ShieldAlert, CheckCircle2, Key } from 'lucide-react';
import './Admin.css';

const getFoodCategory = (food) => {
  if (food.category) return food.category;
  
  const name = food.name.toLowerCase();
  
  // Packaged/packet foods
  if (
    name.includes('maggi') || name.includes('yippee') || name.includes('chips') ||
    name.includes('biscuit') || name.includes('sev') || name.includes('bhujia') ||
    name.includes('oreo') || name.includes('kitkat') || name.includes('dairy milk') ||
    name.includes('chocolate') || name.includes('cold drink') || name.includes('cola') ||
    name.includes('sprite') || name.includes('limca') || name.includes('soda') ||
    name.includes('red bull') || name.includes('soup') || name.includes('bournvita') ||
    name.includes('horlicks') || name.includes('flakes') || name.includes('muesli') ||
    name.includes('real orange') || name.includes('packaged')
  ) {
    return 'packet food';
  }
  
  // Raw items
  if (
    name.includes('raw') || name.includes('atta') || name.includes('grain') ||
    name.includes('flour') || name.includes('moong dal') || name.includes('toor dal') ||
    name.includes('urad dal') || name.includes('masoor dal') || name.includes('chana dal') ||
    name.includes('besan') || name.includes('maida') || name.includes('suji') ||
    name.includes('rava') || name.includes('daliya') || name.includes('oats') ||
    name.includes('milk') || name.includes('curd') || name.includes('paneer (raw') ||
    name.includes('butter (plain') || name.includes('ghee') || name.includes('oil') ||
    name.includes('vegetable oil') || name.includes('apple') || name.includes('banana') ||
    name.includes('orange') || name.includes('mango') || name.includes('grapes') ||
    name.includes('papaya') || name.includes('watermelon') || name.includes('spinach') ||
    name.includes('tomato') || name.includes('onion') || name.includes('potato') ||
    name.includes('cucumber') || name.includes('cauliflower') || name.includes('cabbage') ||
    name.includes('carrot') || name.includes('fresh') || name.includes('raw block') ||
    name.includes('cheese slice') || name.includes('cheese block')
  ) {
    return 'raw';
  }
  
  // Fast food
  if (
    name.includes('samosa') || name.includes('pav bhaji') || name.includes('pani puri') ||
    name.includes('aloo tikki') || name.includes('momos') || name.includes('burger') ||
    name.includes('pizza') || name.includes('french fries') || name.includes('spring roll') ||
    name.includes('kathi roll') || name.includes('chilli chicken') || name.includes('manchurian') ||
    name.includes('noodles (cooked') || name.includes('gulab jamun') || name.includes('jalebi') ||
    name.includes('rasgulla') || name.includes('kulfi') || name.includes('ice cream') ||
    name.includes('waffle') || name.includes('donut') || name.includes('cake') ||
    name.includes('pastry')
  ) {
    return 'fast food';
  }
  
  // Indian food
  return 'indian food';
};

export const Admin = () => {
  const DEFAULT_ADMIN_EMAIL = 'ashishgoyal.3k@gmail.com';
  const DEFAULT_ADMIN_PIN = '8529';

  // Admin Authentication States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('fitlife_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState(() => {
    return sessionStorage.getItem('fitlife_admin_user') || '';
  });
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('stats');
  
  // Data States
  const [users, setUsers] = useState({});
  const [foods, setFoods] = useState([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Filtering & Sorting States
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Statistics State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLogs: 0,
    avgWeight: 0,
    goals: { lose: 0, maintain: 0, gain: 0 }
  });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFoodToEdit, setSelectedFoodToEdit] = useState(null);

  // Form Field States
  const [formName, setFormName] = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [formProtein, setFormProtein] = useState('');
  const [formCarbs, setFormCarbs] = useState('');
  const [formFat, setFormFat] = useState('');
  const [formServingSize, setFormServingSize] = useState('1');
  const [formServingUnit, setFormServingUnit] = useState('piece');
  const [formQuantity, setFormQuantity] = useState('');
  const [formCategory, setFormCategory] = useState('indian food');

  // Master PIN Authentication
  const handlePinLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const currentPin = localStorage.getItem('fitlife_admin_master_pin') || DEFAULT_ADMIN_PIN;
    if (pinInput.trim() === currentPin || pinInput.trim() === DEFAULT_ADMIN_PIN) {
      sessionStorage.setItem('fitlife_admin_auth', 'true');
      sessionStorage.setItem('fitlife_admin_user', 'Master PIN Admin');
      setIsAdminAuthenticated(true);
      setAdminUser('Master PIN Admin');
      setPinInput('');
      setAuthError('');
    } else {
      setAuthError('Incorrect Master PIN. Access denied.');
    }
  };

  // Google OAuth Admin Authentication (Strictly for ashishgoyal.3k@gmail.com)
  const handleGoogleAdminLogin = () => {
    setAuthError('');
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('fitlife_google_client_id') || '677917742316-gqi5ai82alpmdk5scikg9t3gg9jeeb0p.apps.googleusercontent.com';

    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async (resp) => {
            if (resp.error) {
              if (resp.error !== 'popup_closed_by_user') {
                setAuthError(`Google Error: ${resp.error_description || resp.error}`);
              }
              return;
            }
            if (resp.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${resp.access_token}` },
                });
                const info = await res.json();
                const cleanEmail = (info.email || '').toLowerCase().trim();
                if (cleanEmail === DEFAULT_ADMIN_EMAIL) {
                  sessionStorage.setItem('fitlife_admin_auth', 'true');
                  sessionStorage.setItem('fitlife_admin_user', cleanEmail);
                  setIsAdminAuthenticated(true);
                  setAdminUser(cleanEmail);
                  setAuthError('');
                } else {
                  setAuthError(`⛔ Access Denied: "${cleanEmail}" is NOT authorized. Only ${DEFAULT_ADMIN_EMAIL} has access.`);
                }
              } catch (err) {
                setAuthError(`Could not verify Google account: ${err.message}`);
              }
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        setAuthError(`Google Sign-In initialization failed: ${err.message}`);
      }
    } else {
      setAuthError('Google Sign-In service is unavailable. Please enter your Master PIN.');
    }
  };

  // Admin Logout / Lock
  const handleLogout = () => {
    sessionStorage.removeItem('fitlife_admin_auth');
    sessionStorage.removeItem('fitlife_admin_user');
    setIsAdminAuthenticated(false);
    setAdminUser('');
    setPinInput('');
    setAuthError('');
  };

  // Change Master PIN
  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      setAuthError('New PIN must be at least 4 digits/characters.');
      return;
    }
    localStorage.setItem('fitlife_admin_master_pin', newPinInput.trim());
    setPinChangeSuccess('Master PIN updated successfully!');
    setTimeout(() => {
      setShowChangePinModal(false);
      setPinChangeSuccess('');
      setNewPinInput('');
    }, 1200);
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
    }
  }, [isAdminAuthenticated]);

  const loadData = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);

    const allFoods = getFoods();
    setFoods(allFoods);

    // Calculate overall statistics
    const userList = Object.values(allUsers);
    const totalUsers = userList.length;

    let totalWeight = 0;
    const goalsCount = { lose: 0, maintain: 0, gain: 0 };
    userList.forEach(u => {
      totalWeight += u.weight;
      if (u.goal === 'lose' || u.goal === 'maintain' || u.goal === 'gain') {
        goalsCount[u.goal]++;
      }
    });

    const avgWeight = totalUsers > 0 ? Math.round(totalWeight / totalUsers * 10) / 10 : 0;

    let totalLogs = 0;
    userList.forEach(u => {
      const logKey = `fitlife_meal_logs_${u.username}`;
      const logsData = localStorage.getItem(logKey) || localStorage.getItem(`healthify_meal_logs_${u.username}`);
      if (logsData) {
        try {
          const parsed = JSON.parse(logsData);
          totalLogs += Array.isArray(parsed) ? parsed.length : 0;
        } catch {}
      }
    });

    setStats({
      totalUsers,
      totalLogs,
      avgWeight,
      goals: goalsCount
    });
  };

  const getUserLogCount = (username) => {
    const logKey = `fitlife_meal_logs_${username}`;
    const logsData = localStorage.getItem(logKey) || localStorage.getItem(`healthify_meal_logs_${username}`);
    if (logsData) {
      try {
        const parsed = JSON.parse(logsData);
        return Array.isArray(parsed) ? parsed.length : 0;
      } catch {}
    }
    return 0;
  };

  const resetForm = () => {
    setFormName('');
    setFormCalories('');
    setFormProtein('');
    setFormCarbs('');
    setFormFat('');
    setFormServingSize('1');
    setFormServingUnit('piece');
    setFormQuantity('');
    setFormCategory('indian food');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const quantity = parseFloat(formQuantity) || parseFloat(formServingSize) || 1;
    const baseSize = parseFloat(formServingSize) || 1;
    const factor = quantity / baseSize;
    const newFood = {
      id: `custom_${Date.now().toString(36)}`,
      name: formName.trim(),
      calories: Math.max(0, Math.round((parseInt(formCalories) || 0) * factor)),
      protein: Math.max(0, Math.round(((parseFloat(formProtein) || 0) * factor) * 10) / 10),
      carbs: Math.max(0, Math.round(((parseFloat(formCarbs) || 0) * factor) * 10) / 10),
      fat: Math.max(0, Math.round(((parseFloat(formFat) || 0) * factor) * 10) / 10),
      servingSize: quantity,
      servingUnit: formServingUnit.trim() || 'piece',
      category: formCategory,
      createdAt: new Date().toISOString()
    };

    addFood(newFood);
    loadData();
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClick = (food) => {
    setSelectedFoodToEdit(food);
    setFormName(food.name);
    setFormCalories(food.calories.toString());
    setFormProtein(food.protein.toString());
    setFormCarbs(food.carbs.toString());
    setFormFat(food.fat.toString());
    setFormServingSize(food.servingSize.toString());
    setFormServingUnit(food.servingUnit);
    setFormQuantity(food.servingSize.toString());
    setFormCategory(food.category || getFoodCategory(food));
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedFoodToEdit || !formName.trim()) return;

    const quantity = parseFloat(formQuantity) || parseFloat(formServingSize) || 1;
    const baseSize = parseFloat(formServingSize) || 1;
    const factor = quantity / baseSize;
    const updatedFood = {
      ...selectedFoodToEdit,
      name: formName.trim(),
      calories: Math.max(0, Math.round((parseInt(formCalories) || 0) * factor)),
      protein: Math.max(0, Math.round(((parseFloat(formProtein) || 0) * factor) * 10) / 10),
      carbs: Math.max(0, Math.round(((parseFloat(formCarbs) || 0) * factor) * 10) / 10),
      fat: Math.max(0, Math.round(((parseFloat(formFat) || 0) * factor) * 10) / 10),
      servingSize: quantity,
      servingUnit: formServingUnit.trim() || 'piece',
      category: formCategory,
      createdAt: selectedFoodToEdit.createdAt || new Date().toISOString()
    };

    updateFood(updatedFood);
    loadData();
    setShowEditModal(false);
    setSelectedFoodToEdit(null);
    resetForm();
  };

  const handleDeleteClick = (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item from the database?')) {
      deleteFood(foodId);
      loadData();
    }
  };

  const handleResetDb = () => {
    if (window.confirm('This will restore the default food database and delete any custom additions or edits. Continue?')) {
      resetFoodsToDefaults();
      loadData();
    }
  };

  // Filter lists based on searches
  const filteredFoods = foods
    .filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase());
      if (!matchesSearch) return false;

      if (filterCategory !== 'all') {
        const cat = food.category || getFoodCategory(food);
        return cat === filterCategory;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'new') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a.id) || 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b.id) || 0;
        return timeB - timeA;
      } else if (sortBy === 'old') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a.id) || 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b.id) || 0;
        return timeA - timeB;
      }
      return 0;
    });

  const filteredUsers = Object.values(users).filter(user =>
    user.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  // High-Security Lock Screen when not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="admin-lock-wrapper animate-fade">
        <div className="glass-card admin-lock-card">
          <div className="admin-lock-header">
            <div className="admin-lock-badge">
              <Lock size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <h2 className="admin-lock-title">Admin Console Security</h2>
            <p className="admin-lock-subtitle">
              Restricted Area. Authorized administrator access only.
            </p>
          </div>

          {authError && (
            <div className="animate-fade auth-alert-error" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          {/* Option 1: Official Google Sign-In (Restricted to ashishgoyal.3k@gmail.com) */}
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleGoogleAdminLogin}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', gap: '10px' }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.4 3.66 1.48 7.55l3.77 2.92C6.15 7.57 8.85 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.11 2.73-2.36 3.57l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.59z" />
                <path fill="#FBBC05" d="M5.25 14.77c-.25-.75-.39-1.55-.39-2.37s.14-1.62.39-2.37L1.48 7.11C.53 9.02 0 11.16 0 13.4s.53 4.38 1.48 6.29l3.77-2.92z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.7-2.87c-1.02.68-2.33 1.09-3.58 1.09-3.15 0-5.85-2.53-6.75-5.43L1.48 16.03C3.4 19.92 7.37 23 12 23z" />
              </svg>
              <span>Sign In as Admin (Google)</span>
            </button>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '6px' }}>
              Only <strong>ashishgoyal.3k@gmail.com</strong> is authorized
            </div>
          </div>

          <div className="auth-divider" style={{ marginBottom: '20px' }}>
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or Master PIN</span>
            <div className="auth-divider-line" />
          </div>

          {/* Option 2: Master PIN Form */}
          <form onSubmit={handlePinLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={14} /> Master Security PIN
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPin ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter Master PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  style={{ paddingRight: '42px' }}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', fontWeight: 600 }}
            >
              <ShieldCheck size={18} /> Unlock Admin Console
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <a href="./" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
              &larr; Return to FitLife Tracker
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      
      {/* Admin Security Bar */}
      <div className="admin-security-bar animate-fade">
        <div className="admin-security-user">
          <ShieldCheck size={18} color="var(--primary)" />
          <span>
            Logged in as <strong>{adminUser}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px', gap: '6px' }}
            onClick={() => setShowChangePinModal(true)}
          >
            <Key size={14} /> Change Master PIN
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px', gap: '6px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
            onClick={handleLogout}
          >
            <LogOut size={14} /> Lock & Logout
          </button>
        </div>
      </div>

      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database className="text-primary" size={28} /> Admin Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage the application database and monitor user statistics.
          </p>
        </div>
        
        {/* Toggle navigation tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              color: activeTab === 'stats' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'stats' ? 'var(--primary-glow)' : 'transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            User Statistics
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              color: activeTab === 'foods' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'foods' ? 'var(--primary-glow)' : 'transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            Food Database
          </button>
        </div>
      </div>

      {/* TABS RENDER */}
      {activeTab === 'stats' ? (
        /* STATISTICS DASHBOARD */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Metrics summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            {/* Total Users */}
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Users</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>{stats.totalUsers}</h3>
              </div>
            </div>

            {/* Total Logs */}
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
                <Flame size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Logs Recorded</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>{stats.totalLogs}</h3>
              </div>
            </div>

            {/* Average weight */}
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--tertiary-glow)', color: 'var(--tertiary)' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Avg Weight</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>{stats.avgWeight} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>kg</span></h3>
              </div>
            </div>

            {/* Weight Goal Breakdown */}
            <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Goal Breakdown</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '4px' }}>
                <span style={{ color: 'var(--danger)' }}>Lose Weight: <strong>{stats.goals.lose}</strong></span>
                <span style={{ color: 'var(--primary)' }}>Maintain: <strong>{stats.goals.maintain}</strong></span>
                <span style={{ color: 'var(--secondary)' }}>Gain Muscle: <strong>{stats.goals.gain}</strong></span>
              </div>
            </div>

          </div>

          {/* User Directory List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Registered Users Directory</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Search user..."
                  className="form-input"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ padding: '8px 12px 8px 12px', fontSize: '0.85rem', borderRadius: '10px' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    <th style={{ padding: '12px 8px' }}>Username</th>
                    <th style={{ padding: '12px 8px' }}>Goal</th>
                    <th style={{ padding: '12px 8px' }}>Height / Weight</th>
                    <th style={{ padding: '12px 8px' }}>Macro Target</th>
                    <th style={{ padding: '12px 8px' }}>Age / Gender</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Total Logs</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No users registered.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.username} style={{ borderBottom: '1px solid var(--border)', transition: 'background var(--transition-fast)' }} className="table-row-hover">
                        <td style={{ padding: '12px 8px', fontWeight: 700 }}>@{u.username}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: u.goal === 'lose' ? 'var(--danger-glow)' : u.goal === 'gain' ? 'var(--secondary-glow)' : 'var(--primary-glow)',
                            color: u.goal === 'lose' ? 'var(--danger)' : u.goal === 'gain' ? 'var(--secondary)' : 'var(--primary)'
                          }}>
                            {u.goal === 'lose' ? 'Loss' : u.goal === 'gain' ? 'Gain' : 'Maintain'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>{u.height} cm / {u.weight} kg</td>
                        <td style={{ padding: '12px 8px' }}>{u.targetCalories} kcal (P:{u.targetProtein}g • C:{u.targetCarbs}g • F:{u.targetFat}g)</td>
                        <td style={{ padding: '12px 8px', textTransform: 'capitalize' }}>{u.age} yrs / {u.gender}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 700, textAlign: 'center' }}>{getUserLogCount(u.username)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* FOOD DATABASE MANAGER */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Control Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search food item..."
                className="form-input"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                style={{ padding: '10px 12px 10px 40px', borderRadius: '10px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-input"
                style={{ padding: '6px 8px', borderRadius: '8px' }}
              >
                <option value="all">All</option>
                <option value="raw">Raw</option>
                <option value="fast food">Fast Food</option>
                <option value="packet food">Packet Food</option>
                <option value="indian food">Indian Food</option>
              </select>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
                style={{ padding: '6px 8px', borderRadius: '8px' }}
              >
                <option value="name">Name</option>
                <option value="new">Newest</option>
                <option value="old">Oldest</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleResetDb}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px' }}
                title="Restore default Indian food items"
              >
                <RefreshCw size={16} /> Reset defaults
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px' }}
              >
                <Plus size={16} /> Add Food Item
              </button>
            </div>
          </div>

          {/* Database Food Grid/List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    <th style={{ padding: '12px 8px' }}>Food Name</th>
                    <th style={{ padding: '12px 8px' }}>Serving Details</th>
                    <th style={{ padding: '12px 8px' }}>Calories</th>
                    <th style={{ padding: '12px 8px' }}>Protein</th>
                    <th style={{ padding: '12px 8px' }}>Carbohydrates</th>
                    <th style={{ padding: '12px 8px' }}>Fats</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No foods matching "{foodSearch}" found.
                      </td>
                    </tr>
                  ) : (
                    filteredFoods.map(food => (
                      <tr key={food.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                        <td style={{ padding: '12px 8px', fontWeight: 600 }}>{food.name}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{food.servingSize} {food.servingUnit}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 700 }} className="text-mono">{food.calories} kcal</td>
                        <td style={{ padding: '12px 8px', color: 'var(--primary)', fontWeight: 600 }}>{food.protein}g</td>
                        <td style={{ padding: '12px 8px', color: 'var(--secondary)', fontWeight: 600 }}>{food.carbs}g</td>
                        <td style={{ padding: '12px 8px', color: 'var(--tertiary)', fontWeight: 600 }}>{food.fat}g</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleEditClick(food)}
                              className="btn btn-secondary btn-icon-only"
                              title="Edit nutritional information"
                              style={{ width: '28px', height: '28px', padding: 0 }}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(food.id)}
                              className="btn btn-secondary btn-icon-only"
                              title="Delete food item"
                              style={{ width: '28px', height: '28px', padding: 0, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.15)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ADD FOOD MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card animate-fade" style={{ maxWidth: '480px', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles className="text-primary" size={20} /> Add Food to Tracker
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Food Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Dosa (Extra Ghee)"
                  className="form-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 250"
                    className="form-input"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 8.5"
                    className="form-input"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 42.0"
                    className="form-input"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 11.5"
                    className="form-input"
                    value={formFat}
                    onChange={(e) => setFormFat(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Serving Size</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1"
                    className="form-input"
                    value={formServingSize}
                    onChange={(e) => setFormServingSize(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. g"
                    className="form-input"
                    value={formServingUnit}
                    onChange={(e) => setFormServingUnit(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Quantity (g)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 100"
                    className="form-input"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                Add to Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FOOD MODAL */}
      {showEditModal && selectedFoodToEdit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card animate-fade" style={{ maxWidth: '480px', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit className="text-primary" size={20} /> Edit Food Item
              </h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Food Item Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-input"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-input"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-input"
                    value={formFat}
                    onChange={(e) => setFormFat(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Serving Size</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-input"
                    value={formServingSize}
                    onChange={(e) => setFormServingSize(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Serving Unit</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formServingUnit}
                    onChange={(e) => setFormServingUnit(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Master PIN Modal */}
      {showChangePinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card animate-fade" style={{ maxWidth: '400px', width: '100%', padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <KeyRound size={32} style={{ color: 'var(--primary)', margin: '0 auto 10px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Change Master PIN</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Set a new secret PIN for your Admin Console.</p>
            </div>

            {pinChangeSuccess && (
              <div className="animate-fade auth-alert-success" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>{pinChangeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePin}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">New Master PIN (at least 4 digits/characters)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 8529 or your secret pin"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowChangePinModal(false);
                    setNewPinInput('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
