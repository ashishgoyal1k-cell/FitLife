import type { FoodItem } from '../types';

export const INDIAN_FOODS: FoodItem[] = [
  // Breads / Starch
  { id: '1', name: 'Roti / Chapati (Plain)', calories: 70, protein: 2.5, carbs: 15, fat: 0.5, servingSize: 1, servingUnit: 'piece' },
  { id: '2', name: 'Butter Roti / Chapati', calories: 95, protein: 2.5, carbs: 15, fat: 3.5, servingSize: 1, servingUnit: 'piece' },
  { id: '3', name: 'Tandoori Roti', calories: 110, protein: 3.5, carbs: 22, fat: 1, servingSize: 1, servingUnit: 'piece' },
  { id: '4', name: 'Butter Naan', calories: 260, protein: 6, carbs: 45, fat: 6, servingSize: 1, servingUnit: 'piece' },
  { id: '5', name: 'Aloo Paratha (Plain)', calories: 210, protein: 4, carbs: 35, fat: 6, servingSize: 1, servingUnit: 'piece' },
  { id: '6', name: 'Aloo Paratha (with Butter)', calories: 260, protein: 4, carbs: 35, fat: 11, servingSize: 1, servingUnit: 'piece' },
  { id: '7', name: 'White Rice (Cooked)', calories: 200, protein: 4, carbs: 44, fat: 0.4, servingSize: 1, servingUnit: 'cup (150g)' },
  { id: '8', name: 'Brown Rice (Cooked)', calories: 170, protein: 3.5, carbs: 36, fat: 1.2, servingSize: 1, servingUnit: 'cup (150g)' },
  
  // Breakfast Items
  { id: '9', name: 'Idli', calories: 60, protein: 1.5, carbs: 13, fat: 0.2, servingSize: 1, servingUnit: 'piece' },
  { id: '10', name: 'Plain Dosa', calories: 150, protein: 3, carbs: 29, fat: 3, servingSize: 1, servingUnit: 'piece' },
  { id: '11', name: 'Masala Dosa', calories: 250, protein: 4, carbs: 42, fat: 8, servingSize: 1, servingUnit: 'piece' },
  { id: '12', name: 'Poha', calories: 250, protein: 4, carbs: 45, fat: 6, servingSize: 1, servingUnit: 'plate (150g)' },
  { id: '13', name: 'Upma', calories: 210, protein: 4, carbs: 38, fat: 4, servingSize: 1, servingUnit: 'plate (150g)' },
  { id: '14', name: 'Medu Vada', calories: 100, protein: 2.5, carbs: 12, fat: 5, servingSize: 1, servingUnit: 'piece' },
  { id: '15', name: 'Dhokla', calories: 60, protein: 2, carbs: 9, fat: 1.5, servingSize: 1, servingUnit: 'piece' },

  // Mains - Vegetarian
  { id: '16', name: 'Dal Tadka', calories: 150, protein: 7, carbs: 20, fat: 5, servingSize: 1, servingUnit: 'bowl (150g)' },
  { id: '17', name: 'Dal Makhani', calories: 250, protein: 8, carbs: 22, fat: 15, servingSize: 1, servingUnit: 'bowl (150g)' },
  { id: '18', name: 'Paneer Butter Masala', calories: 320, protein: 12, carbs: 10, fat: 26, servingSize: 1, servingUnit: 'plate (150g)' },
  { id: '19', name: 'Palak Paneer', calories: 190, protein: 9, carbs: 7, fat: 15, servingSize: 1, servingUnit: 'bowl (150g)' },
  { id: '20', name: 'Chole Masala', calories: 180, protein: 6, carbs: 25, fat: 6, servingSize: 1, servingUnit: 'bowl (150g)' },
  { id: '21', name: 'Mix Veg Curry', calories: 120, protein: 3, carbs: 14, fat: 6, servingSize: 1, servingUnit: 'bowl (150g)' },
  { id: '22', name: 'Rajma Curry', calories: 160, protein: 8, carbs: 24, fat: 4, servingSize: 1, servingUnit: 'bowl (150g)' },
  { id: '23', name: 'Veg Biryani', calories: 350, protein: 8, carbs: 65, fat: 7, servingSize: 1, servingUnit: 'plate (250g)' },

  // Mains - Non-Vegetarian
  { id: '24', name: 'Chicken Tikka Masala', calories: 290, protein: 22, carbs: 8, fat: 19, servingSize: 1, servingUnit: 'plate (150g)' },
  { id: '25', name: 'Tandoori Chicken', calories: 180, protein: 24, carbs: 2, fat: 8, servingSize: 1, servingUnit: 'piece (120g)' },
  { id: '26', name: 'Chicken Biryani', calories: 480, protein: 28, carbs: 58, fat: 15, servingSize: 1, servingUnit: 'plate (250g)' },
  { id: '27', name: 'Butter Chicken', calories: 380, protein: 20, carbs: 12, fat: 28, servingSize: 1, servingUnit: 'plate (150g)' },
  { id: '28', name: 'Fish Curry', calories: 220, protein: 20, carbs: 6, fat: 13, servingSize: 1, servingUnit: 'bowl (150g)' },
  { id: '29', name: 'Egg Curry (2 Eggs)', calories: 240, protein: 14, carbs: 8, fat: 16, servingSize: 1, servingUnit: 'bowl (150g)' },

  // Eggs & Poultry (Market Fresh)
  { id: '44', name: 'Egg (Whole, Raw)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, servingSize: 1, servingUnit: 'large' },
  { id: '45', name: 'Boiled Egg (Plain)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, servingSize: 1, servingUnit: 'large' },
  { id: '46', name: 'Egg White (Boiled)', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, servingSize: 1, servingUnit: 'large' },
  { id: '47', name: 'Egg Omelette (Plain, 1 Egg)', calories: 120, protein: 6.5, carbs: 1, fat: 10, servingSize: 1, servingUnit: 'serving' },
  { id: '48', name: 'Egg Omelette (Plain, 2 Eggs)', calories: 210, protein: 13, carbs: 1.5, fat: 18, servingSize: 1, servingUnit: 'serving' },
  { id: '49', name: 'Chicken Breast (Raw)', calories: 120, protein: 25, carbs: 0, fat: 2.5, servingSize: 100, servingUnit: 'g' },
  { id: '50', name: 'Chicken Breast (Cooked)', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: 100, servingUnit: 'g' },

  // Packaged Foods (Brands)
  { id: '51', name: 'Maggi Instant Noodles (Pack)', calories: 310, protein: 7, carbs: 43, fat: 13, servingSize: 1, servingUnit: 'packet (70g)' },
  { id: '83', name: 'Maggi Atta Noodles (Pack)', calories: 315, protein: 8, carbs: 50, fat: 10, servingSize: 1, servingUnit: 'packet (72g)' },
  { id: '84', name: 'Yippee Noodles (Pack)', calories: 300, protein: 6.5, carbs: 45, fat: 11, servingSize: 1, servingUnit: 'packet (70g)' },
  { id: '52', name: 'Haldiram Bhujia Sev', calories: 170, protein: 4, carbs: 11, fat: 12, servingSize: 30, servingUnit: 'g' },
  { id: '53', name: 'Britannia Marie Gold Biscuit', calories: 80, protein: 1.5, carbs: 15, fat: 1.8, servingSize: 4, servingUnit: 'biscuits (19g)' },
  { id: '54', name: 'Parle-G Biscuit', calories: 90, protein: 1.4, carbs: 16, fat: 2.5, servingSize: 4, servingUnit: 'biscuits (20g)' },
  { id: '55', name: 'Lay\'s Potato Chips (Classic)', calories: 160, protein: 2, carbs: 15, fat: 10, servingSize: 1, servingUnit: 'packet (30g)' },
  { id: '56', name: 'Kurkure (Masala Munch)', calories: 170, protein: 2, carbs: 16, fat: 11, servingSize: 1, servingUnit: 'packet (30g)' },
  { id: '85', name: 'Oreo Biscuits (3 pack)', calories: 140, protein: 1.5, carbs: 20, fat: 6, servingSize: 3, servingUnit: 'biscuits (28g)' },
  { id: '86', name: 'KitKat Chocolate Finger', calories: 65, protein: 1, carbs: 8.5, fat: 3, servingSize: 1, servingUnit: 'bar (13g)' },
  { id: '87', name: 'Cadbury Dairy Milk (Small)', calories: 70, protein: 1, carbs: 7.5, fat: 4, servingSize: 1, servingUnit: 'bar (13g)' },
  { id: '88', name: 'Bournvita Powder', calories: 80, protein: 1.4, carbs: 17, fat: 0.6, servingSize: 20, servingUnit: 'g' },
  { id: '89', name: 'Horlicks Powder', calories: 75, protein: 2.2, carbs: 15, fat: 0.6, servingSize: 20, servingUnit: 'g' },
  { id: '90', name: 'Knorr Tomato Soup', calories: 60, protein: 1, carbs: 12, fat: 1.5, servingSize: 1, servingUnit: 'serving' },
  { id: '91', name: 'Kellogg\'s Corn Flakes', calories: 110, protein: 2.4, carbs: 26, fat: 0.3, servingSize: 30, servingUnit: 'g' },
  { id: '92', name: 'Kellogg\'s Muesli', calories: 160, protein: 3.5, carbs: 30, fat: 3, servingSize: 40, servingUnit: 'g' },

  // Cold Drinks & Carbonated Beverages
  { id: '57', name: 'Cola Cold Drink (Coca-Cola / Pepsi)', calories: 140, protein: 0, carbs: 35, fat: 0, servingSize: 1, servingUnit: 'can (330ml)' },
  { id: '58', name: 'Lemon Soda Cold Drink (Sprite / Limca)', calories: 130, protein: 0, carbs: 32, fat: 0, servingSize: 1, servingUnit: 'can (330ml)' },
  { id: '59', name: 'Diet Cold Drink (Coke Zero / Diet Pepsi)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: 1, servingUnit: 'can (330ml)' },
  { id: '60', name: 'Red Bull Energy Drink', calories: 110, protein: 0, carbs: 26, fat: 0, servingSize: 1, servingUnit: 'can (250ml)' },
  { id: '61', name: 'Real Orange Fruit Juice', calories: 90, protein: 0.6, carbs: 21, fat: 0.1, servingSize: 1, servingUnit: 'glass (200ml)' },
  { id: '62', name: 'Fresh Coconut Water', calories: 40, protein: 0.7, carbs: 9, fat: 0.2, servingSize: 1, servingUnit: 'glass (200ml)' },

  // Grocery Staples & Raw Grains (Atta, Rice, Dals, Flour)
  { id: '63', name: 'Whole Wheat Atta (Flour, Raw)', calories: 340, protein: 12, carbs: 72, fat: 2, servingSize: 100, servingUnit: 'g' },
  { id: '64', name: 'Basmati Rice (Raw)', calories: 350, protein: 8, carbs: 78, fat: 0.5, servingSize: 100, servingUnit: 'g' },
  { id: '65', name: 'Toor Dal / Arhar Dal (Raw)', calories: 335, protein: 22, carbs: 58, fat: 1.5, servingSize: 100, servingUnit: 'g' },
  { id: '66', name: 'Moong Dal (Raw)', calories: 340, protein: 24, carbs: 59, fat: 1.2, servingSize: 100, servingUnit: 'g' },
  { id: '93', name: 'Urad Dal (Raw)', calories: 340, protein: 24, carbs: 58, fat: 1.4, servingSize: 100, servingUnit: 'g' },
  { id: '94', name: 'Masoor Dal (Red Lentils, Raw)', calories: 340, protein: 25, carbs: 59, fat: 1.3, servingSize: 100, servingUnit: 'g' },
  { id: '95', name: 'Chana Dal (Raw)', calories: 330, protein: 20, carbs: 57, fat: 5, servingSize: 100, servingUnit: 'g' },
  { id: '96', name: 'Besan (Gram Flour, Raw)', calories: 380, protein: 22, carbs: 57, fat: 5, servingSize: 100, servingUnit: 'g' },
  { id: '97', name: 'Maida (All Purpose Flour, Raw)', calories: 360, protein: 10, carbs: 77, fat: 1, servingSize: 100, servingUnit: 'g' },
  { id: '98', name: 'Suji / Rava (Semolina, Raw)', calories: 360, protein: 12, carbs: 73, fat: 1, servingSize: 100, servingUnit: 'g' },
  { id: '99', name: 'Sabudana (Tapioca Pearls, Raw)', calories: 350, protein: 0.2, carbs: 87, fat: 0.2, servingSize: 100, servingUnit: 'g' },
  { id: '100', name: 'Daliya (Broken Wheat, Raw)', calories: 340, protein: 12, carbs: 72, fat: 1.5, servingSize: 100, servingUnit: 'g' },
  { id: '101', name: 'Kala Chana (Brown Chickpeas, Raw)', calories: 360, protein: 20, carbs: 60, fat: 5, servingSize: 100, servingUnit: 'g' },
  { id: '102', name: 'Kabuli Chana (Chickpeas, Raw)', calories: 360, protein: 19, carbs: 60, fat: 6, servingSize: 100, servingUnit: 'g' },
  { id: '68', name: 'Rolled Oats (Raw)', calories: 380, protein: 13, carbs: 66, fat: 7, servingSize: 100, servingUnit: 'g' },
  { id: '74', name: 'White Bread', calories: 130, protein: 4, carbs: 26, fat: 1.5, servingSize: 2, servingUnit: 'slices (50g)' },
  { id: '75', name: 'Brown Bread', calories: 120, protein: 5, carbs: 24, fat: 1.2, servingSize: 2, servingUnit: 'slices (50g)' },
  { id: '76', name: 'Multigrain Bread', calories: 135, protein: 6, carbs: 22, fat: 2.0, servingSize: 2, servingUnit: 'slices (50g)' },

  // Dairy & Brands (Milk / Butter / Ghee / Cheese)
  { id: '67', name: 'Amul Paneer (Raw Block)', calories: 310, protein: 20, carbs: 4, fat: 24, servingSize: 100, servingUnit: 'g' },
  { id: '103', name: 'Amul Cheese Slice', calories: 60, protein: 4, carbs: 0.5, fat: 5, servingSize: 1, servingUnit: 'slice (20g)' },
  { id: '104', name: 'Amul Cheese Block', calories: 320, protein: 20, carbs: 1.5, fat: 26, servingSize: 100, servingUnit: 'g' },
  { id: '69', name: 'Amul Taaza Toned Milk', calories: 58, protein: 3.2, carbs: 4.7, fat: 3.0, servingSize: 100, servingUnit: 'ml' },
  { id: '70', name: 'Amul Gold Full Cream Milk', calories: 87, protein: 3.4, carbs: 5.0, fat: 6.0, servingSize: 100, servingUnit: 'ml' },
  { id: '105', name: 'Mother Dairy Cow Milk', calories: 63, protein: 3.2, carbs: 4.7, fat: 3.5, servingSize: 100, servingUnit: 'ml' },
  { id: '106', name: 'Soy Milk (Plain)', calories: 43, protein: 3.3, carbs: 4, fat: 1.8, servingSize: 100, servingUnit: 'ml' },
  { id: '107', name: 'Almond Milk (Unsweetened)', calories: 15, protein: 0.5, carbs: 0.3, fat: 1.2, servingSize: 100, servingUnit: 'ml' },
  { id: '71', name: 'Amul Butter', calories: 100, protein: 0.1, carbs: 0, fat: 11, servingSize: 1, servingUnit: 'tbsp (14g)' },
  { id: '72', name: 'Amul Ghee / Mother Dairy Ghee', calories: 125, protein: 0, carbs: 0, fat: 14, servingSize: 1, servingUnit: 'tbsp (14g)' },
  { id: '108', name: 'Amul Fresh Cream', calories: 200, protein: 2.5, carbs: 3.5, fat: 20, servingSize: 100, servingUnit: 'g' },
  { id: '109', name: 'Yakult Probiotic Drink', calories: 50, protein: 0.8, carbs: 12, fat: 0, servingSize: 1, servingUnit: 'bottle (65ml)' },

  // Fresh Fruits & Nuts (Raw)
  { id: '78', name: 'Banana (Raw)', calories: 90, protein: 1.1, carbs: 23, fat: 0.3, servingSize: 1, servingUnit: 'medium (100g)' },
  { id: '79', name: 'Apple (Raw)', calories: 80, protein: 0.4, carbs: 20, fat: 0.3, servingSize: 1, servingUnit: 'medium (150g)' },
  { id: '110', name: 'Mango (Raw/Ripe)', calories: 120, protein: 1.6, carbs: 30, fat: 0.8, servingSize: 1, servingUnit: 'medium (200g)' },
  { id: '111', name: 'Watermelon (Raw)', calories: 30, protein: 0.6, carbs: 7.5, fat: 0.1, servingSize: 100, servingUnit: 'g' },
  { id: '112', name: 'Pomegranate / Anar (Raw)', calories: 83, protein: 1.7, carbs: 18.7, fat: 1.2, servingSize: 100, servingUnit: 'g' },
  { id: '113', name: 'Guava / Amrood (Raw)', calories: 68, protein: 2.5, carbs: 14.3, fat: 1, servingSize: 100, servingUnit: 'g' },
  { id: '114', name: 'Orange (Raw)', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, servingSize: 1, servingUnit: 'medium (130g)' },
  { id: '115', name: 'Papaya (Raw)', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, servingSize: 100, servingUnit: 'g' },
  { id: '116', name: 'Lemon / Nimbu (Raw)', calories: 17, protein: 0.5, carbs: 5.4, fat: 0.1, servingSize: 1, servingUnit: 'piece' },
  { id: '80', name: 'Raw Peanuts', calories: 160, protein: 7, carbs: 6, fat: 14, servingSize: 28, servingUnit: 'g' },
  { id: '81', name: 'Almonds', calories: 70, protein: 2.5, carbs: 2.5, fat: 6, servingSize: 10, servingUnit: 'pieces (12g)' },
  { id: '117', name: 'Cashews', calories: 85, protein: 3, carbs: 4.5, fat: 7, servingSize: 10, servingUnit: 'pieces (15g)' },
  { id: '118', name: 'Chia Seeds', calories: 60, protein: 2, carbs: 5, fat: 4, servingSize: 1, servingUnit: 'tbsp (12g)' },
  { id: '82', name: 'Honey', calories: 60, protein: 0, carbs: 17, fat: 0, servingSize: 1, servingUnit: 'tbsp (20g)' },

  // Fresh Vegetables (Raw Grocery)
  { id: '119', name: 'Potato (Raw)', calories: 77, protein: 2, carbs: 17, fat: 0.1, servingSize: 100, servingUnit: 'g' },
  { id: '120', name: 'Tomato (Raw)', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: 100, servingUnit: 'g' },
  { id: '121', name: 'Onion (Raw)', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, servingSize: 100, servingUnit: 'g' },
  { id: '122', name: 'Spinach / Palak (Raw)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: 100, servingUnit: 'g' },
  { id: '123', name: 'Cauliflower / Gobhi (Raw)', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, servingSize: 100, servingUnit: 'g' },
  { id: '124', name: 'Lady Finger / Bhindi (Raw)', calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, servingSize: 100, servingUnit: 'g' },
  { id: '125', name: 'Cucumber / Kheera (Raw)', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, servingSize: 100, servingUnit: 'g' },
  { id: '126', name: 'Carrot / Gajar (Raw)', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, servingSize: 100, servingUnit: 'g' },

  // Fats / Oils / Spices (Grocery)
  { id: '77', name: 'Olive Oil / Mustard Oil / Sunflower Oil', calories: 120, protein: 0, carbs: 0, fat: 14, servingSize: 1, servingUnit: 'tbsp (14g)' },
  { id: '127', name: 'Coconut Oil', calories: 120, protein: 0, carbs: 0, fat: 14, servingSize: 1, servingUnit: 'tbsp (14g)' },
  { id: '128', name: 'Peanut Butter (Unsweetened)', calories: 95, protein: 4, carbs: 3, fat: 8, servingSize: 1, servingUnit: 'tbsp (16g)' },
  { id: '129', name: 'White Sugar', calories: 48, protein: 0, carbs: 12, fat: 0, servingSize: 1, servingUnit: 'tbsp (12g)' },
  { id: '130', name: 'Jaggery / Gur', calories: 45, protein: 0.1, carbs: 11.5, fat: 0, servingSize: 1, servingUnit: 'tbsp (12g)' },
  { id: '131', name: 'Turmeric Powder / Haldi', calories: 10, protein: 0.2, carbs: 2, fat: 0.3, servingSize: 1, servingUnit: 'tsp (3g)' },
  { id: '132', name: 'Red Chili Powder', calories: 10, protein: 0.4, carbs: 1.5, fat: 0.4, servingSize: 1, servingUnit: 'tsp (3g)' },
  { id: '133', name: 'Cumin Seeds / Jeera', calories: 11, protein: 0.5, carbs: 1.3, fat: 0.6, servingSize: 1, servingUnit: 'tsp (3g)' },

  // Raw Meats & Seafood
  { id: '134', name: 'Mutton / Lamb (Raw)', calories: 250, protein: 20, carbs: 0, fat: 18, servingSize: 100, servingUnit: 'g' },
  { id: '135', name: 'Rohu Fish (Raw)', calories: 97, protein: 17, carbs: 0, fat: 2.7, servingSize: 100, servingUnit: 'g' },
  { id: '136', name: 'Katla Fish (Raw)', calories: 100, protein: 18, carbs: 0, fat: 2.8, servingSize: 100, servingUnit: 'g' },
  { id: '137', name: 'Prawns / Shrimp (Raw)', calories: 85, protein: 20, carbs: 0, fat: 0.5, servingSize: 100, servingUnit: 'g' },

  // Snacks & Street Food
  { id: '30', name: 'Samosa', calories: 200, protein: 3, carbs: 22, fat: 11, servingSize: 1, servingUnit: 'piece' },
  { id: '31', name: 'Chole Bhature', calories: 600, protein: 12, carbs: 75, fat: 28, servingSize: 1, servingUnit: 'plate (2 Bhature + Chole)' },
  { id: '32', name: 'Pani Puri / Golgappa', calories: 150, protein: 2, carbs: 26, fat: 4, servingSize: 6, servingUnit: 'pieces' },
  { id: '33', name: 'Aloo Tikki (1 piece)', calories: 130, protein: 2, carbs: 18, fat: 6, servingSize: 1, servingUnit: 'piece' },
  { id: '34', name: 'Puri Bhaji', calories: 450, protein: 8, carbs: 55, fat: 22, servingSize: 1, servingUnit: 'plate (3 Puris + Bhaji)' },

  // Desserts
  { id: '35', name: 'Gulab Jamun', calories: 150, protein: 2, carbs: 25, fat: 5, servingSize: 1, servingUnit: 'piece' },
  { id: '36', name: 'Jalebi', calories: 125, protein: 1, carbs: 22.5, fat: 3.5, servingSize: 1, servingUnit: 'piece' },
  { id: '37', name: 'Gajar Halwa', calories: 280, protein: 4, carbs: 42, fat: 11, servingSize: 1, servingUnit: 'bowl (100g)' },
  { id: '38', name: 'Rasgulla', calories: 120, protein: 2, carbs: 26, fat: 1, servingSize: 1, servingUnit: 'piece' },

  // Beverages & Dairy (Cooked/Served)
  { id: '39', name: 'Masala Chai (with Milk & Sugar)', calories: 90, protein: 2, carbs: 15, fat: 2.5, servingSize: 1, servingUnit: 'cup (150ml)' },
  { id: '40', name: 'Filter Coffee (with Milk & Sugar)', calories: 80, protein: 2, carbs: 12, fat: 2.5, servingSize: 1, servingUnit: 'cup (150ml)' },
  { id: '41', name: 'Buttermilk / Chaas', calories: 45, protein: 2, carbs: 4, fat: 1, servingSize: 1, servingUnit: 'glass (200ml)' },
  { id: '42', name: 'Sweet Lassi', calories: 220, protein: 5, carbs: 36, fat: 6, servingSize: 1, servingUnit: 'glass (200ml)' },
  { id: '43', name: 'Plain Curd / Yogurt', calories: 60, protein: 3, carbs: 4, fat: 3, servingSize: 1, servingUnit: 'bowl (100g)' }
];
