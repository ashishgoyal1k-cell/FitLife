import React, { useState, useEffect } from 'react';
import { getAllUsers, getFoods, addFood, updateFood, deleteFood, resetFoodsToDefaults } from '../utils/db';
import { Trash2, Edit, Plus, Search, Users, Flame, RefreshCw, X, Database, Sparkles, TrendingUp } from 'lucide-react';
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

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div className="admin-wrapper">
      
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

    </div>
  );
};
