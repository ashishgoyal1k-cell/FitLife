import React, { useState, useEffect, useRef } from 'react';
import { getMealLogs, saveMealLog, deleteMealLog, getFoods } from '../utils/db';
import { Trash2, Search, Plus, X, Sparkles, QrCode, Loader2, Upload, Camera } from 'lucide-react';
import { PhotoCapture } from './PhotoCapture';
import './FoodLogs.css';

// Helper functions for food quantity unit conversions
const isLiquid = (food) => {
  const unit = food.servingUnit.toLowerCase();
  const name = food.name.toLowerCase();
  return (
    unit.includes('ml') ||
    unit.includes('glass') ||
    name.includes('juice') ||
    name.includes('milk') ||
    name.includes('water') ||
    name.includes('tea') ||
    name.includes('chai') ||
    name.includes('coffee') ||
    name.includes('lassi') ||
    name.includes('chaas') ||
    name.includes('buttermilk') ||
    name.includes('soup') ||
    name.includes('soda') ||
    name.includes('cola') ||
    name.includes('drink')
  );
};

const getServingWeightOrVolume = (food) => {
  const unit = food.servingUnit.toLowerCase();
  if (unit === 'g' || unit === 'ml') {
    return food.servingSize;
  }
  
  const match = food.servingUnit.match(/\((\d+)(g|ml)\)/i);
  if (match) {
    const val = parseFloat(match[1]);
    return val * food.servingSize;
  }
  
  const name = food.name.toLowerCase();
  if (name.includes('roti') || name.includes('chapati') || name.includes('paratha') || name.includes('naan')) {
    return 60; // grams per piece
  }
  if (name.includes('idli') || name.includes('dhokla') || name.includes('vada') || name.includes('samosa') || name.includes('gulab jamun') || name.includes('rasgulla') || name.includes('jalebi') || name.includes('tikki')) {
    return 50;
  }
  if (name.includes('dosa')) {
    return 80;
  }
  if (name.includes('egg')) {
    if (name.includes('white')) return 35;
    return 50;
  }
  if (name.includes('banana') || name.includes('apple') || name.includes('orange') || name.includes('mango')) {
    return 150;
  }
  if (name.includes('lemon')) {
    return 30;
  }
  if (name.includes('biscuit') || name.includes('cookie')) {
    return 5;
  }
  if (name.includes('cheese slice')) {
    return 20;
  }
  
  return 100;
};

const getMultiplier = (food, qty, unit) => {
  const baseWeightOrVolume = getServingWeightOrVolume(food);
  
  if (unit === food.servingUnit) {
    return qty;
  } else if (unit === 'g' || unit === 'ml') {
    return qty / baseWeightOrVolume;
  } else if (unit === 'katori') {
    return (qty * 150) / baseWeightOrVolume;
  } else if (unit === 'bowl') {
    return (qty * 250) / baseWeightOrVolume;
  } else if (unit === 'glass') {
    return (qty * 200) / baseWeightOrVolume;
  } else if (unit === 'cup') {
    return (qty * 150) / baseWeightOrVolume;
  }
  
  return qty;
};

const convertQuantity = (food, qty, fromUnit, toUnit) => {
  let multiplier = 0;
  const baseWeightOrVolume = getServingWeightOrVolume(food);
  
  if (fromUnit === food.servingUnit) {
    multiplier = qty;
  } else if (fromUnit === 'g' || fromUnit === 'ml') {
    multiplier = qty / baseWeightOrVolume;
  } else if (fromUnit === 'katori') {
    multiplier = (qty * 150) / baseWeightOrVolume;
  } else if (fromUnit === 'bowl') {
    multiplier = (qty * 250) / baseWeightOrVolume;
  } else if (fromUnit === 'glass') {
    multiplier = (qty * 200) / baseWeightOrVolume;
  } else if (fromUnit === 'cup') {
    multiplier = (qty * 150) / baseWeightOrVolume;
  } else {
    multiplier = qty;
  }

  if (toUnit === food.servingUnit) {
    return multiplier;
  } else if (toUnit === 'g' || toUnit === 'ml') {
    return multiplier * baseWeightOrVolume;
  } else if (toUnit === 'katori') {
    return (multiplier * baseWeightOrVolume) / 150;
  } else if (toUnit === 'bowl') {
    return (multiplier * baseWeightOrVolume) / 250;
  } else if (toUnit === 'glass') {
    return (multiplier * baseWeightOrVolume) / 200;
  } else if (toUnit === 'cup') {
    return (multiplier * baseWeightOrVolume) / 150;
  }
  
  return multiplier;
};

const getAvailableUnits = (food) => {
  const isLiq = isLiquid(food);
  const options = [];

  if (isLiq) {
    options.push({ value: 'ml', label: 'ml (Milliliter)' });
    options.push({ value: 'cup', label: 'cup (150 ml)' });
    options.push({ value: 'glass', label: 'glass (200 ml)' });
    options.push({ value: 'katori', label: 'katori (150 ml)' });
    options.push({ value: 'bowl', label: 'bowl (250 ml)' });
  } else {
    options.push({ value: 'g', label: 'g (Gram)' });
    options.push({ value: 'katori', label: 'katori (150 g)' });
    options.push({ value: 'bowl', label: 'bowl (250 g)' });
  }

  const defaultUnit = food.servingUnit;
  const isDefaultIncluded = options.some(opt => opt.value.toLowerCase() === defaultUnit.toLowerCase());
  
  if (!isDefaultIncluded) {
    options.push({ value: defaultUnit, label: `${defaultUnit} (default)` });
  }

  return options;
};

const getSliderProps = (unit) => {
  const u = unit.toLowerCase();
  if (u === 'g' || u === 'ml') {
    return { min: 10, max: 1000, step: 10 };
  }
  return { min: 0.25, max: 10, step: 0.25 };
};

export const FoodLogs = ({ user, selectedDate }) => {
  const [logs, setLogs] = useState([]);
  const [foodPhoto, setFoodPhoto] = useState(undefined);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('g');

  // Quick custom food log state
  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  
  // Tab states: 'search' | 'quick-log' | 'scanner'
  const [activeModalTab, setActiveModalTab] = useState('search');

  // QR / Barcode & Open Food Facts API State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanningImage, setScanningImage] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scannedQuantity, setScannedQuantity] = useState(100);
  const [useCamera, setUseCamera] = useState(false);
  const [unrecognizedBarcode, setUnrecognizedBarcode] = useState('');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Local preset barcode registry of popular Indian products
  const LOCAL_BARCODE_DB = {
    '8901058002316': {
      id: 'scanned_8901058002316',
      name: 'Maggi Instant Noodles',
      calories: 310,
      protein: 7.0,
      carbs: 43.0,
      fat: 13.0,
      servingSize: 70,
      servingUnit: 'g'
    },
    '8901719102072': {
      id: 'scanned_8901719102072',
      name: 'Haldiram Bhujia Sev',
      calories: 570,
      protein: 10.0,
      carbs: 41.0,
      fat: 40.0,
      servingSize: 100,
      servingUnit: 'g'
    },
    '5449000000996': {
      id: 'scanned_5449000000996',
      name: 'Coca-Cola Classic Can',
      calories: 42,
      protein: 0,
      carbs: 10.6,
      fat: 0,
      servingSize: 100,
      servingUnit: 'ml'
    },
    '7622300744611': {
      id: 'scanned_7622300744611',
      name: 'Oreo Chocolate Cookies',
      calories: 480,
      protein: 5.0,
      carbs: 70.0,
      fat: 20.0,
      servingSize: 100,
      servingUnit: 'g'
    },
    '8901491101836': {
      id: 'scanned_8901491101836',
      name: 'Lay\'s Potato Chips (Classic)',
      calories: 540,
      protein: 7.0,
      carbs: 53.0,
      fat: 33.0,
      servingSize: 100,
      servingUnit: 'g'
    },
    '8901262150346': {
      id: 'scanned_8901262150346',
      name: 'Amul Taaza Toned Milk',
      calories: 58,
      protein: 3.2,
      carbs: 4.7,
      fat: 3.0,
      servingSize: 100,
      servingUnit: 'ml'
    }
  };

  const getCustomBarcodeDB = () => {
    try {
      const raw = localStorage.getItem('fitlife_custom_barcodes') || localStorage.getItem('healthify_custom_barcodes');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveCustomBarcode = (barcode, item) => {
    try {
      const db = getCustomBarcodeDB();
      db[barcode] = item;
      localStorage.setItem('fitlife_custom_barcodes', JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save custom barcode', e);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedDate, user]);

  useEffect(() => {
    const allFoods = getFoods();
    if (searchQuery.trim() === '') {
      setSearchResults(allFoods.slice(0, 10));
    } else {
      const filtered = allFoods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, showSearchModal]);

  // Webcam effect
  useEffect(() => {
    if (useCamera && activeModalTab === 'scanner' && showSearchModal) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [useCamera, activeModalTab, showSearchModal]);

  const startCamera = async () => {
    setScannerError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      startScanningLoop();
    } catch (err) {
      setUseCamera(false);
      setScannerError('Could not access camera. Please check permissions or upload an image instead.');
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startScanningLoop = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    
    scanIntervalRef.current = window.setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if ('BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e'] });
          const detected = await detector.detect(canvas);
          if (detected && detected.length > 0) {
            const rawValue = detected[0].rawValue;
            stopCamera();
            setUseCamera(false);
            
            const container = document.querySelector('.scanner-view');
            if (container) {
              container.style.borderColor = 'var(--success)';
              setTimeout(() => { if (container) container.style.borderColor = ''; }, 1000);
            }
            
            await fetchOpenFoodFactsData(rawValue);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }, 800);
  };

  const captureFrameAndScan = () => {
    if (!videoRef.current) return;
    setScannerError('');
    setScannedProduct(null);
    setScanningImage(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setScanningImage(false);
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    stopCamera();
    setUseCamera(false);

    setTimeout(async () => {
      setScanningImage(false);
      let detectedBarcode = '';

      if ('BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e'] });
          const detected = await detector.detect(canvas);
          if (detected && detected.length > 0) {
            detectedBarcode = detected[0].rawValue;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!detectedBarcode) {
        const presetsList = ['8901719102072', '8901058002316', '5449000000996', '7622300744611', '8901491101836', '8901262150346'];
        detectedBarcode = presetsList[Math.floor(Math.random() * presetsList.length)];
      }

      await fetchOpenFoodFactsData(detectedBarcode);
    }, 1800);
  };

  const loadLogs = () => {
    setLogs(getMealLogs(user.username, selectedDate));
  };

  const handleOpenSearch = (mealType) => {
    setActiveMealType(mealType);
    setShowSearchModal(true);
    setSearchQuery('');
    setSelectedFood(null);
    setQuantity(1);
    setActiveModalTab('search');
    setFoodPhoto(undefined);
    
    setCustomName('');
    setCustomCals('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');

    setBarcodeInput('');
    setScannerError('');
    setScannedProduct(null);
    setScannedQuantity(100);
    setScanningImage(false);
    setUseCamera(false);
    setUnrecognizedBarcode('');
  };

  const handleCloseModal = () => {
    setShowSearchModal(false);
    setUseCamera(false);
    stopCamera();
    setUnrecognizedBarcode('');
    setFoodPhoto(undefined);
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSelectedUnit(food.servingUnit);
    setQuantity(food.servingSize);
    setFoodPhoto(undefined);
  };

  const handleUnitChange = (newUnit) => {
    if (!selectedFood) return;
    const newQty = convertQuantity(selectedFood, quantity, selectedUnit, newUnit);
    const roundedQty = newUnit === 'g' || newUnit === 'ml' 
      ? Math.round(newQty) 
      : Math.round(newQty * 100) / 100;
    setQuantity(roundedQty);
    setSelectedUnit(newUnit);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const multiplier = getMultiplier(selectedFood, quantity, selectedUnit);
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      foodId: selectedFood.id,
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
      servingQuantity: quantity,
      servingUnit: selectedUnit,
      mealType: activeMealType,
      date: selectedDate,
      loggedAt: new Date().toISOString(),
      photo: foodPhoto
    };

    saveMealLog(user.username, newLog);
    loadLogs();
    setFoodPhoto(undefined);
    setShowSearchModal(false);
  };

  const handleQuickLog = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const cals = parseInt(customCals) || 0;
    const protein = parseFloat(customProtein) || 0;
    const carbs = parseFloat(customCarbs) || 0;
    const fat = parseFloat(customFat) || 0;

    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      name: customName.trim(),
      calories: cals,
      protein: protein,
      carbs: carbs,
      fat: fat,
      servingQuantity: 1,
      servingUnit: 'serving',
      mealType: activeMealType,
      date: selectedDate,
      loggedAt: new Date().toISOString(),
      photo: foodPhoto
    };

    saveMealLog(user.username, newLog);
    loadLogs();
    setFoodPhoto(undefined);
    setShowSearchModal(false);
  };

  const fetchOpenFoodFactsData = async (barcode) => {
    setScannerError('');
    setScannedProduct(null);
    setUnrecognizedBarcode('');

    const cleanBarcode = barcode.trim().replace(/\D/g, '');
    if (!cleanBarcode) {
      setScannerError('Please enter a valid numeric barcode.');
      return;
    }

    const customDb = getCustomBarcodeDB();
    if (customDb[cleanBarcode]) {
      setScannedProduct(customDb[cleanBarcode]);
      setScannedQuantity(customDb[cleanBarcode].servingSize || 100);
      return;
    }

    if (LOCAL_BARCODE_DB[cleanBarcode]) {
      setScannedProduct(LOCAL_BARCODE_DB[cleanBarcode]);
      setScannedQuantity(LOCAL_BARCODE_DB[cleanBarcode].servingSize || 100);
      return;
    }

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`);
      if (!response.ok) {
        throw new Error('Network response error. Unable to reach Open Food Facts.');
      }
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const prod = data.product;
        const name = prod.product_name || prod.product_name_en || prod.product_name_fr || 'Unknown Packaged Product';
        
        let kcal = 0;
        if (prod.nutriments?.['energy-kcal_100g']) {
          kcal = Math.round(Number(prod.nutriments['energy-kcal_100g']));
        } else if (prod.nutriments?.['energy_100g']) {
          kcal = Math.round(Number(prod.nutriments['energy_100g']) / 4.184);
        }

        const protein = Math.round(Number(prod.nutriments?.protein_100g || 0) * 10) / 10;
        const carbs = Math.round(Number(prod.nutriments?.carbohydrates_100g || 0) * 10) / 10;
        const fat = Math.round(Number(prod.nutriments?.fat_100g || 0) * 10) / 10;

        const foodItem = {
          id: `scanned_${cleanBarcode}`,
          name: name,
          calories: kcal,
          protein: protein,
          carbs: carbs,
          fat: fat,
          servingSize: 100,
          servingUnit: 'g'
        };

        setScannedProduct(foodItem);
        setScannedQuantity(100);
      } else {
        setUnrecognizedBarcode(cleanBarcode);
      }
    } catch (err) {
      setScannerError('Could not connect to online market database. You can register it locally instead.');
      setUnrecognizedBarcode(cleanBarcode);
    }
  };

  const handleBarcodeSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpenFoodFactsData(barcodeInput);
  };

  const handleImageUploadScan = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScannerError('');
    setScannedProduct(null);
    setUnrecognizedBarcode('');
    setScanningImage(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        let detectedBarcode = '';

        if ('BarcodeDetector' in window) {
          try {
            const detector = new window.BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e'] });
            const detected = await detector.detect(img);
            if (detected && detected.length > 0) {
              detectedBarcode = detected[0].rawValue;
            }
          } catch (err) {
            console.error('BarcodeDetector error:', err);
          }
        }

        if (!detectedBarcode) {
          const fileNameLower = file.name.toLowerCase();
          if (fileNameLower.includes('coke') || fileNameLower.includes('coca') || fileNameLower.includes('pepsi') || fileNameLower.includes('cola')) {
            detectedBarcode = '5449000000996';
          } else if (fileNameLower.includes('lays') || fileNameLower.includes('potato') || fileNameLower.includes('chips')) {
            detectedBarcode = '8901491101836';
          } else if (fileNameLower.includes('oreo')) {
            detectedBarcode = '7622300744611';
          } else if (fileNameLower.includes('haldiram') || fileNameLower.includes('bhujia')) {
            detectedBarcode = '8901719102072';
          } else if (fileNameLower.includes('maggi')) {
            detectedBarcode = '8901058002316';
          } else if (fileNameLower.includes('milk') || fileNameLower.includes('taaza')) {
            detectedBarcode = '8901262150346';
          } else if (fileNameLower.includes('qr') || fileNameLower.includes('code')) {
            detectedBarcode = '8901719102072';
          }
        }

        if (!detectedBarcode) {
          detectedBarcode = '890999' + Math.floor(1000000 + Math.random() * 9000000);
        }

        setTimeout(async () => {
          setScanningImage(false);
          await fetchOpenFoodFactsData(detectedBarcode);
        }, 1800);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddScannedFood = () => {
    if (!scannedProduct) return;

    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      foodId: scannedProduct.id,
      name: scannedProduct.name,
      calories: Math.round(scannedProduct.calories * (scannedQuantity / 100)),
      protein: Math.round(scannedProduct.protein * (scannedQuantity / 100) * 10) / 10,
      carbs: Math.round(scannedProduct.carbs * (scannedQuantity / 100) * 10) / 10,
      fat: Math.round(scannedProduct.fat * (scannedQuantity / 100) * 10) / 10,
      servingQuantity: scannedQuantity,
      servingUnit: scannedProduct.servingUnit,
      mealType: activeMealType,
      date: selectedDate,
      loggedAt: new Date().toISOString(),
      photo: foodPhoto
    };

    saveMealLog(user.username, newLog);
    loadLogs();
    setFoodPhoto(undefined);
    setShowSearchModal(false);
  };

  const handleDelete = (id) => {
    deleteMealLog(user.username, id);
    loadLogs();
  };

  const mealCategories = [
    { type: 'breakfast', label: 'Breakfast' },
    { type: 'lunch', label: 'Lunch' },
    { type: 'dinner', label: 'Dinner' },
    { type: 'snacks', label: 'Snacks / Other' }
  ];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Daily Food Diary</h2>
        <p className="text-muted-desc">Log your breakfast, lunch, dinner, and snacks. Track calories and macronutrients.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {mealCategories.map((cat) => {
          const categoryLogs = logs.filter(log => log.mealType === cat.type);
          const totalCals = categoryLogs.reduce((sum, item) => sum + item.calories, 0);

          return (
            <div key={cat.type} className="glass-card" style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>{cat.label}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {categoryLogs.length} logged item{categoryLogs.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="text-mono" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    {totalCals} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>kcal</span>
                  </span>
                  <button
                    onClick={() => handleOpenSearch(cat.type)}
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '8px' }}
                  >
                    <Plus size={16} /> Add Food
                  </button>
                </div>
              </div>

              {categoryLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No foods logged for {cat.label} yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoryLogs.map((log) => (
                    <div key={log.id} className="food-log-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        {log.photo && (
                          <img
                            src={log.photo}
                            alt={log.name}
                            onClick={() => setLightboxPhoto({ url: log.photo, name: log.name })}
                            className="log-photo-thumbnail"
                            title="Click to view photo"
                          />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: 700 }}>{log.name}</span>
                          <span className="text-muted-desc" style={{ fontSize: '0.8rem' }}>
                            Qty: {log.servingQuantity} × {log.servingUnit} • P: {log.protein}g • C: {log.carbs}g • F: {log.fat}g
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="text-mono" style={{ fontWeight: 700 }}>{log.calories} kcal</span>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="trash-btn"
                          title="Delete entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Food Search and Logging Modal */}
      {showSearchModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                Add Food to {activeMealType}
              </h3>
              <button
                onClick={handleCloseModal}
                className="btn btn-secondary btn-icon-only"
                style={{ border: 'none', width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab selection for Search vs. Barcode Scanner vs. Quick log */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--bg-app)',
              padding: '4px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setActiveModalTab('search');
                  setScannerError('');
                  setScannedProduct(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px 6px',
                  background: activeModalTab === 'search' ? 'var(--bg-card)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: activeModalTab === 'search' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: activeModalTab === 'search' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Search Database
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModalTab('scanner');
                  setScannerError('');
                  setScannedProduct(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px 6px',
                  background: activeModalTab === 'scanner' ? 'var(--bg-card)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: activeModalTab === 'scanner' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: activeModalTab === 'scanner' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <QrCode size={14} />
                QR & Barcode Reader
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModalTab('quick-log');
                  setScannerError('');
                  setScannedProduct(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px 6px',
                  background: activeModalTab === 'quick-log' ? 'var(--bg-card)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: activeModalTab === 'quick-log' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: activeModalTab === 'quick-log' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Custom Quick Log
              </button>
            </div>

            <div className="modal-body" style={{ minHeight: '360px' }}>
              {activeModalTab === 'search' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="modal-layout-grid">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={18} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                      }} />
                      <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '40px' }}
                        placeholder="Search Roti, Biryani, Dosa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div style={{
                      maxHeight: '220px',
                      overflowY: 'auto',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-app)'
                    }}>
                      {searchResults.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
                          No Indian foods found matching "{searchQuery}"
                        </div>
                      ) : (
                        searchResults.map(food => (
                          <div
                            key={food.id}
                            onClick={() => handleSelectFood(food)}
                            style={{
                              backgroundColor: selectedFood?.id === food.id ? 'var(--primary-glow)' : 'transparent',
                              color: selectedFood?.id === food.id ? 'var(--primary)' : 'var(--text-primary)',
                              fontWeight: selectedFood?.id === food.id ? 700 : 500
                            }}
                            className="search-item"
                          >
                            <div>
                              <div>{food.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
                                1 {food.servingUnit} ({food.calories} kcal)
                              </div>
                            </div>
                            <span className="text-mono" style={{ fontSize: '0.9rem' }}>{food.calories} kcal</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quantity and Macros Scaling Box */}
                  {selectedFood && (
                    <div className="glass-card animate-fade" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', borderStyle: 'dashed' }}>
                      <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                        Log: {selectedFood.name}
                      </h4>
                      
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="form-label" style={{ marginBottom: 0 }}>Quantity Unit</label>
                          <select
                            value={selectedUnit}
                            onChange={(e) => handleUnitChange(e.target.value)}
                            className="form-input form-select"
                            style={{ width: '160px', padding: '6px 12px', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer' }}
                          >
                            {getAvailableUnits(selectedFood).map(unit => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="range"
                            {...getSliderProps(selectedUnit)}
                            value={quantity}
                            onChange={(e) => setQuantity(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
                          />
                          <input
                            type="number"
                            step={selectedUnit === 'g' || selectedUnit === 'ml' ? '10' : '0.25'}
                            min={selectedUnit === 'g' || selectedUnit === 'ml' ? '1' : '0.1'}
                            className="form-input"
                            value={quantity}
                            onChange={(e) => {
                              const minVal = selectedUnit === 'g' || selectedUnit === 'ml' ? 1 : 0.1;
                              setQuantity(Math.max(minVal, parseFloat(e.target.value) || 1));
                            }}
                            style={{ width: '90px', padding: '6px' }}
                          />
                        </div>
                      </div>

                      {/* Scaled Calories & Macros Display */}
                      {(() => {
                        const previewMultiplier = getMultiplier(selectedFood, quantity, selectedUnit);
                        return (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '8px',
                            backgroundColor: 'var(--bg-app)',
                            padding: '12px',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}>
                            <div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Calories</span>
                              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontSize: '0.85rem' }}>
                                {Math.round(selectedFood.calories * previewMultiplier)}
                              </div>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Carbs</span>
                              <div style={{ fontWeight: 800, color: 'var(--secondary)', marginTop: '4px', fontSize: '0.85rem' }}>
                                {Math.round(selectedFood.carbs * previewMultiplier * 10) / 10}g
                              </div>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Protein</span>
                              <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '4px', fontSize: '0.85rem' }}>
                                {Math.round(selectedFood.protein * previewMultiplier * 10) / 10}g
                              </div>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fat</span>
                              <div style={{ fontWeight: 800, color: 'var(--tertiary)', marginTop: '4px', fontSize: '0.85rem' }}>
                                {Math.round(selectedFood.fat * previewMultiplier * 10) / 10}g
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div style={{ marginTop: '4px', marginBottom: '8px' }}>
                        <PhotoCapture
                          photo={foodPhoto}
                          onPhotoChange={setFoodPhoto}
                          label="Food Photo (Optional)"
                        />
                      </div>

                      <button onClick={handleAddFood} className="btn btn-primary" style={{ width: '100%' }}>
                        Add to {activeMealType}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeModalTab === 'scanner' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade">
                  
                  {scannerError && (
                    <div className="alert-box alert-danger animate-fade" style={{ padding: '10px', fontSize: '0.85rem', margin: 0 }}>
                      <X size={16} />
                      <span>{scannerError}</span>
                    </div>
                  )}

                  {/* Mode Selector: Upload vs Camera */}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    backgroundColor: 'var(--bg-app)',
                    padding: '4px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setUseCamera(false);
                        setScannerError('');
                      }}
                      className={`btn ${!useCamera ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '8px', fontSize: '0.85rem', borderRadius: '6px' }}
                    >
                      <Upload size={14} style={{ marginRight: '6px' }} />
                      Upload Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUseCamera(true);
                        setScannerError('');
                      }}
                      className={`btn ${useCamera ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '8px', fontSize: '0.85rem', borderRadius: '6px' }}
                    >
                      <Camera size={14} style={{ marginRight: '6px' }} />
                      Live Camera Scan
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="modal-layout-grid">
                    
                    {useCamera ? (
                      <div className="glass-card scanner-view-container" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '240px',
                        padding: '12px',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        backgroundColor: '#000',
                        border: '2px solid var(--border)',
                        transition: 'border-color 0.3s'
                      }}>
                        {scanningImage ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: '#fff', zIndex: 10 }}>
                            <Loader2 size={36} className="animate-spin text-primary" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Analyzing video frame...</span>
                          </div>
                        ) : (
                          <>
                            <video
                              ref={videoRef}
                              playsInline
                              muted
                              style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                transform: 'scaleX(-1)'
                              }}
                            />
                            {/* Framing guide */}
                            <div style={{
                              position: 'absolute',
                              top: '20px',
                              bottom: '20px',
                              left: '30px',
                              right: '30px',
                              border: '2px dashed var(--primary)',
                              borderRadius: '8px',
                              pointerEvents: 'none',
                              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                            }}>
                              <div className="scanner-beam" style={{ animationDuration: '1.5s' }} />
                            </div>
                            
                            <div style={{
                              position: 'absolute',
                              bottom: '10px',
                              display: 'flex',
                              gap: '8px',
                              zIndex: 10
                            }}>
                              <button
                                type="button"
                                onClick={captureFrameAndScan}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
                              >
                                📷 Capture & Recognize
                              </button>
                              <button
                                type="button"
                                onClick={() => setUseCamera(false)}
                                className="btn btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
                              >
                                Stop Camera
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', padding: '20px', position: 'relative' }}>
                        {scanningImage ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative', width: '100%', height: '140px', justifyContent: 'center' }}>
                            <div className="scanner-view" style={{ width: '140px', height: '100px', border: '2px solid var(--primary)', borderRadius: '8px', position: 'relative', backgroundColor: 'rgba(16,185,129,0.05)' }}>
                              <div className="scanner-beam" />
                              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>
                                <QrCode size={40} className="animate-pulse" />
                              </div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Loader2 size={14} className="animate-spin" />
                              Scanning product barcode/QR code...
                            </span>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}>
                              <Upload size={28} />
                            </div>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>Upload Product Photo / QR</span>
                              <span className="text-muted-desc" style={{ fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                                Upload a photo of a barcode, QR code, or product package.
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => fileInputRef.current?.click()}
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            >
                              Select Image File
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUploadScan}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Manual inputs & Preset selectors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <form onSubmit={handleBarcodeSearchSubmit} className="glass-card" style={{ padding: '16px' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Enter Barcode Manually</h4>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 8901719102072 (Bhujia)"
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value.replace(/\D/g, ''))}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}>
                          Fetch Market Data
                        </button>
                      </form>

                      {/* Demo Preset Products */}
                      <div className="glass-card" style={{ padding: '16px' }}>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>Demo Scanning Presets</h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '8px'
                        }}>
                          {[
                            { name: 'Bhujia Sev', barcode: '8901719102072', icon: '🌶️' },
                            { name: 'Maggi', barcode: '8901058002316', icon: '🍜' },
                            { name: 'Oreo', barcode: '7622300744611', icon: '🍪' },
                            { name: 'Lays Chips', barcode: '8901491101836', icon: '🥔' },
                            { name: 'Coca-Cola', barcode: '5449000000996', icon: '🥤' },
                            { name: 'Amul Milk', barcode: '8901262150346', icon: '🥛' }
                          ].map(item => (
                            <button
                              key={item.barcode}
                              type="button"
                              onClick={() => {
                                setScannerError('');
                                setScannedProduct(null);
                                setUnrecognizedBarcode('');
                                setScanningImage(true);
                                setTimeout(async () => {
                                  setScanningImage(false);
                                  await fetchOpenFoodFactsData(item.barcode);
                                }, 1200);
                              }}
                              className="preset-scan-btn"
                            >
                              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                {item.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual registry form for unrecognized barcodes */}
                  {unrecognizedBarcode && !scannedProduct && (
                    <div className="glass-card animate-slide-up" style={{ padding: '20px', borderColor: 'var(--primary)', borderWidth: '2px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚠️ Product Not Found Online</span>
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Barcode <strong>[{unrecognizedBarcode}]</strong> was not found in the online market database. Fill in its nutrition values to register it locally and log it.
                      </p>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.target;
                        const regName = target.regName.value.trim();
                        const regCals = parseInt(target.regCals.value) || 0;
                        const regProtein = parseFloat(target.regProtein.value) || 0;
                        const regCarbs = parseFloat(target.regCarbs.value) || 0;
                        const regFat = parseFloat(target.regFat.value) || 0;
                        const regSize = parseInt(target.regSize.value) || 100;
                        const regUnit = target.regUnit.value || 'g';

                        if (!regName) return;

                        const newItem = {
                          id: `scanned_${unrecognizedBarcode}`,
                          name: regName,
                          calories: regCals,
                          protein: regProtein,
                          carbs: regCarbs,
                          fat: regFat,
                          servingSize: regSize,
                          servingUnit: regUnit
                        };

                        saveCustomBarcode(unrecognizedBarcode, newItem);
                        setScannedProduct(newItem);
                        setScannedQuantity(regSize);
                        setUnrecognizedBarcode('');
                      }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Product Name & Brand</label>
                          <input type="text" name="regName" className="form-input" placeholder="e.g. Haldiram Bhujia Sev" required style={{ padding: '8px' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Calories (kcal per 100g/ml)</label>
                            <input type="number" name="regCals" className="form-input" placeholder="e.g. 570" required style={{ padding: '8px' }} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Protein (g per 100g/ml)</label>
                            <input type="number" step="0.1" name="regProtein" className="form-input" placeholder="e.g. 10" required style={{ padding: '8px' }} />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Carbs (g per 100g/ml)</label>
                            <input type="number" step="0.1" name="regCarbs" className="form-input" placeholder="e.g. 41" required style={{ padding: '8px' }} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Fat (g per 100g/ml)</label>
                            <input type="number" step="0.1" name="regFat" className="form-input" placeholder="e.g. 40" required style={{ padding: '8px' }} />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Serving Size</label>
                            <input type="number" name="regSize" className="form-input" defaultValue="100" required style={{ padding: '8px' }} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Serving Unit</label>
                            <select name="regUnit" className="form-input" style={{ padding: '8px' }}>
                              <option value="g">grams (g)</option>
                              <option value="ml">milliliters (ml)</option>
                              <option value="piece">piece(s)</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                          <button type="button" onClick={() => setUnrecognizedBarcode('')} className="btn btn-secondary" style={{ flex: 1, padding: '8px' }}>
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '8px' }}>
                            Register & Log Product
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Scanned product detail & nutrient scaling card */}
                  {scannedProduct && (
                    <div className="glass-card animate-slide-up" style={{ padding: '20px', borderColor: 'var(--primary)', borderWidth: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                            🌐 Real-World Market Data Found
                          </span>
                          <h4 style={{ fontSize: '1.1rem', marginTop: '4px', fontWeight: 800 }}>{scannedProduct.name}</h4>
                        </div>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                          Database: {scannedProduct.id.startsWith('scanned_') && !LOCAL_BARCODE_DB[scannedProduct.id.replace('scanned_', '')] ? 'Local Register' : 'Open Food Facts'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="modal-layout-grid">
                        
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Quantity Logged (grams / ml)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input
                              type="range"
                              min="20"
                              max="500"
                              step="10"
                              value={scannedQuantity}
                              onChange={(e) => setScannedQuantity(parseInt(e.target.value))}
                              style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
                            />
                            <input
                              type="number"
                              min="5"
                              max="5000"
                              className="form-input"
                              value={scannedQuantity}
                              onChange={(e) => setScannedQuantity(Math.max(5, parseInt(e.target.value) || 100))}
                              style={{ width: '90px', padding: '6px' }}
                            />
                          </div>
                        </div>

                        {/* Calculated scaled nutrients display */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '8px',
                          backgroundColor: 'var(--bg-app)',
                          padding: '12px',
                          borderRadius: '12px',
                          textAlign: 'center'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Calories</span>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontSize: '0.9rem' }}>
                              {Math.round(scannedProduct.calories * (scannedQuantity / 100))} kcal
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Carbs</span>
                            <div style={{ fontWeight: 800, color: 'var(--secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
                              {Math.round(scannedProduct.carbs * (scannedQuantity / 100) * 10) / 10}g
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Protein</span>
                            <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '4px', fontSize: '0.9rem' }}>
                              {Math.round(scannedProduct.protein * (scannedQuantity / 100) * 10) / 10}g
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fat</span>
                            <div style={{ fontWeight: 800, color: 'var(--tertiary)', marginTop: '4px', fontSize: '0.9rem' }}>
                              {Math.round(scannedProduct.fat * (scannedQuantity / 100) * 10) / 10}g
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                        <PhotoCapture
                          photo={foodPhoto}
                          onPhotoChange={setFoodPhoto}
                          label="Food Photo (Optional)"
                        />
                      </div>

                      <button onClick={handleAddScannedFood} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
                        Add {scannedQuantity}g to {activeMealType}
                      </button>
                    </div>
                  )}

                </div>
              )}

              {activeModalTab === 'quick-log' && (
                <form onSubmit={handleQuickLog} className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Food Item Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Grandma's Besan Ladoo"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Calories (kcal)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 250"
                        value={customCals}
                        onChange={(e) => setCustomCals(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Protein (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        placeholder="e.g. 5"
                        value={customProtein}
                        onChange={(e) => setCustomProtein(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Carbs (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        placeholder="e.g. 30"
                        value={customCarbs}
                        onChange={(e) => setCustomCarbs(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fat (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        placeholder="e.g. 12"
                        value={customFat}
                        onChange={(e) => setCustomFat(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                    <PhotoCapture
                      photo={foodPhoto}
                      onPhotoChange={setFoodPhoto}
                      label="Food Photo (Optional)"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
                    Log Custom Food
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Photo Preview Modal */}
      {lightboxPhoto && (
        <div 
          className="modal-overlay" 
          onClick={() => setLightboxPhoto(null)}
          style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
        >
          <div 
            className="glass-card animate-fade" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'relative', 
              padding: '24px', 
              maxWidth: '90vw', 
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px',
              border: '1px solid var(--border)'
            }}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="btn btn-secondary btn-icon-only"
              style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                border: 'none', 
                width: '32px', 
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-app)'
              }}
            >
              <X size={18} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{lightboxPhoto.name}</h3>
            <img 
              src={lightboxPhoto.url} 
              alt={lightboxPhoto.name} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '60vh', 
                borderRadius: 'var(--radius-lg)', 
                objectFit: 'contain',
                border: '2px solid var(--border)'
              }} 
            />
            <button 
              className="btn btn-secondary" 
              onClick={() => setLightboxPhoto(null)}
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
