import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://robocraft.site/api/v1';

// Types based on API responses
type FoodSize = { 
  id?: number;
  name: string; 
  is_new: boolean; 
  price: number; 
};

type FoodType = { 
  id: number; 
  name: string; 
};

type ModifierCategory = { 
  id: number; 
  name: string; 
};

type ModifierOption = {
  id: number;
  name: string;
  price: number;
  modifier_category_id: number;
};

type FoodProduct = {
  id: number;
  name: string;
  description: string;
  food_type_id: number;
  food_type_name: string;
  food_sizes: FoodSize[];
  food_modifiers: Array<{
    modifier_cat_id: number;
    modifier_cat_name: string;
    modifier_options: ModifierOption[];
  }>;
};

type MenuCategory = {
  food_type_id: number;
  food_type_name: string;
  foods: FoodProduct[];
};

type MenuItem = {
  id: number;
  food_id: number;
  priority_level: number;
  food: FoodProduct;
};

// UI Components
const SectionCard: React.FC<{ 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, children, className = '' }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const InputField: React.FC<{
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, type = 'text', placeholder, required, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition ${
        error ? 'border-red-300' : 'border-gray-300'
      }`}
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, options, placeholder, required, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition ${
        error ? 'border-red-300' : 'border-gray-300'
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || 'Выберите...'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const Toggle: React.FC<{ 
  label: string; 
  checked: boolean; 
  onChange: (v: boolean) => void;
  description?: string;
}> = ({ label, checked, onChange, description }) => (
  <div className="flex items-start gap-3">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative w-11 h-6 rounded-full transition flex-shrink-0 mt-1 ${
        checked ? 'bg-red-500' : 'bg-gray-300'
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
        checked ? 'left-5' : 'left-0.5'
      }`}/>
    </button>
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  </div>
);

const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, disabled, variant = 'primary', size = 'md', children, className = '' }) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white",
    secondary: "bg-gray-900 hover:bg-black focus:ring-gray-500 text-white",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const AdminPanel: React.FC = () => {
  const { token, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  console.log('AdminPanel: Component rendered', { 
    token: !!token, 
    isLoading, 
    tokenLength: token?.length || 0 
  });

  // Data state
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [modifierCategories, setModifierCategories] = useState<ModifierCategory[]>([]);
  const [modifierOptions, setModifierOptions] = useState<ModifierOption[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [createdFoods, setCreatedFoods] = useState<FoodProduct[]>([]);

  // Form states
  const [activeTab, setActiveTab] = useState<'food' | 'types' | 'modifiers' | 'menu'>('food');
  
  // Food creation form
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    type_id: '',
    sizes: [{ name: '', is_new: false, price: 0 }],
    modifiers: [] as number[]
  });
  
  // Type creation form
  const [typeForm, setTypeForm] = useState({ name: '' });
  
  // Modifier forms
  const [modifierCategoryForm, setModifierCategoryForm] = useState({ name: '' });
  const [modifierOptionForm, setModifierOptionForm] = useState({
    name: '',
    category_id: '',
    price: 0
  });
  
  // Menu management
  const [menuForm, setMenuForm] = useState({
    food_id: '',
    priority_level: 1
  });

  // Image management
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});
  const [foodImages, setFoodImages] = useState<Record<number, string>>({});

  // Loading states
  const [refreshing, setRefreshing] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  const disabled = useMemo(() => !token, [token]);

  // Load initial data
  const loadData = useCallback(async () => {
    if (!token) {
      console.log('AdminPanel: No token, skipping data load');
      return;
    }
    
    console.log('AdminPanel: Starting data load...');
    
    try {
      console.log('AdminPanel: Fetching food types...');
      const typesRes = await fetch(`${API_BASE}/food/type`, { 
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } 
      });
      console.log('AdminPanel: Food types response:', { status: typesRes.status, ok: typesRes.ok });
      
      if (typesRes.ok) {
        const types: FoodType[] = await typesRes.json();
        console.log('AdminPanel: Food types loaded:', types);
        setFoodTypes(types);
        // Clear error if successful
        setApiErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['food_types'];
          return newErrors;
        });
      } else {
        console.error('AdminPanel: Failed to load food types:', typesRes.status, typesRes.statusText);
        setApiErrors(prev => ({ ...prev, food_types: `HTTP ${typesRes.status}: ${typesRes.statusText}` }));
      }
      
      console.log('AdminPanel: Fetching modifier categories...');
      const categoriesRes = await fetch(`${API_BASE}/food/modifiers`, { 
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } 
      });
      console.log('AdminPanel: Modifier categories response:', { status: categoriesRes.status, ok: categoriesRes.ok });
      
      if (categoriesRes.ok) {
        const categories: ModifierCategory[] = await categoriesRes.json();
        console.log('AdminPanel: Modifier categories loaded:', categories);
        setModifierCategories(categories);
        // Clear error if successful
        setApiErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['modifier_categories'];
          return newErrors;
        });
      } else {
        console.error('AdminPanel: Failed to load modifier categories:', categoriesRes.status, categoriesRes.statusText);
        setApiErrors(prev => ({ ...prev, modifier_categories: `HTTP ${categoriesRes.status}: ${categoriesRes.statusText}` }));
      }
      
      console.log('AdminPanel: Fetching modifier options...');
      const optionsRes = await fetch(`${API_BASE}/food/modifiers/options`, { 
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } 
      });
      console.log('AdminPanel: Modifier options response:', { status: optionsRes.status, ok: optionsRes.ok });
      
      if (optionsRes.ok) {
        const options: ModifierOption[] = await optionsRes.json();
        console.log('AdminPanel: Modifier options loaded:', options);
        setModifierOptions(options);
        // Clear error if successful
        setApiErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['modifier_options'];
          return newErrors;
        });
      } else {
        console.error('AdminPanel: Failed to load modifier options:', optionsRes.status, optionsRes.statusText);
        setApiErrors(prev => ({ ...prev, modifier_options: `HTTP ${optionsRes.status}: ${optionsRes.statusText}` }));
      }
      
      console.log('AdminPanel: Fetching menu...');
      const menuRes = await fetch(`${API_BASE}/food/menu`, { 
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } 
      });
      console.log('AdminPanel: Menu response:', { status: menuRes.status, ok: menuRes.ok });
      
      if (menuRes.ok) {
        const menu: MenuCategory[] = await menuRes.json();
        console.log('AdminPanel: Menu loaded:', menu);
        console.log('AdminPanel: Menu item structure:', menu[0]); // Логируем структуру первого элемента
        
        // Создаем MenuItem из MenuCategory для совместимости
        const menuItems: MenuItem[] = menu.flatMap(category => 
          (category.foods || []).map(food => ({
            id: food.id,
            food_id: food.id,
            priority_level: 1,
            food: food
          }))
        );
        
        setMenuItems(menuItems);
        
        // Извлекаем блюда
        const foods = menu.flatMap(category => category.foods || []);
        
        console.log('AdminPanel: Extracted foods from menu:', foods);
        setCreatedFoods(foods);
      } else {
        console.error('AdminPanel: Failed to load menu:', menuRes.status, menuRes.statusText);
      }
      
      console.log('AdminPanel: Data load completed successfully');
    } catch (error) {
      console.error('AdminPanel: Failed to load data:', error);
      // Не показываем toast при первой загрузке, чтобы избежать спама
    }
  }, [token]);

  useEffect(() => {
    console.log('AdminPanel: useEffect triggered', { isLoading, token: !!token });
    
    if (isLoading) {
      console.log('AdminPanel: Still loading, skipping...');
      return;
    }
    
    if (!token) {
      console.log('AdminPanel: No token, showing auth message');
      showToast({ 
        title: 'Требуется авторизация', 
        description: 'Войдите чтобы использовать админ-панель', 
        type: 'info' 
      });
      return;
    }
    
    console.log('AdminPanel: All conditions met, loading data...', { token: !!token, isLoading });
    loadData();
  }, [token, isLoading]);

  // Load food images
  const loadFoodImage = useCallback(async (foodId: number) => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE}/food/${foodId}/image`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const imageData = await res.json();
        setFoodImages(prev => ({ ...prev, [foodId]: imageData }));
      }
    } catch {
      // Image not found or error loading
    }
  }, [token]);

  // Refresh data
  const handleRefresh = useCallback(async () => {
    if (!token) return;
    
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast({ title: 'Данные обновлены', type: 'success' });
  }, [token, loadData, showToast]);

  // Food creation
  const handleCreateFood = useCallback(async () => {
    if (disabled || !foodForm.name || !foodForm.type_id || !foodForm.sizes.some(s => s.name && s.price > 0)) {
      showToast({ 
        title: 'Заполните все поля', 
        description: 'Название, тип и хотя бы один размер с ценой обязательны', 
        type: 'error' 
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/food`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: foodForm.name,
          description: foodForm.description,
          food_sizes: foodForm.sizes.filter(s => s.name && s.price > 0),
          possible_food_modifiers: foodForm.modifiers,
          type_id: Number(foodForm.type_id)
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || 'Не удалось создать блюдо');
      }

      const result = await res.json();
      setCreatedFoods(prev => [...prev, result]);
      
      // Reset form
      setFoodForm({
        name: '',
        description: '',
        type_id: '',
        sizes: [{ name: '', is_new: false, price: 0 }],
        modifiers: []
      });
      
      showToast({ title: 'Блюдо создано', description: 'Теперь добавьте его в меню', type: 'success' });
      
      // Load image for the newly created food
      if (result.id) {
        loadFoodImage(result.id);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [token, disabled, foodForm, showToast, loadFoodImage]);

  // Type creation
  const handleCreateType = useCallback(async () => {
    if (disabled || !typeForm.name.trim()) {
      showToast({ title: 'Ошибка', description: 'Введите название типа', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/food/type`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: typeForm.name.trim() })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || 'Не удалось создать тип блюда');
      }

      const result = await res.json();
      setFoodTypes(prev => [...prev, result]);
      setTypeForm({ name: '' });
      showToast({ title: 'Тип блюда создан', type: 'success' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [token, disabled, typeForm.name, showToast]);

  // Modifier category creation
  const handleCreateModifierCategory = useCallback(async () => {
    if (disabled || !modifierCategoryForm.name.trim()) {
      showToast({ title: 'Ошибка', description: 'Введите название категории', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/food/modifiers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: modifierCategoryForm.name.trim() })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || 'Не удалось создать категорию модификаторов');
      }

      const result = await res.json();
      setModifierCategories(prev => [...prev, { id: Date.now(), name: result }]);
      setModifierCategoryForm({ name: '' });
      showToast({ title: 'Категория модификаторов создана', type: 'success' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [token, disabled, modifierCategoryForm.name, showToast]);

  // Modifier option creation
  const handleCreateModifierOption = useCallback(async () => {
    if (disabled || !modifierOptionForm.name.trim() || !modifierOptionForm.category_id) {
      showToast({ title: 'Ошибка', description: 'Заполните все поля', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/food/modifiers/options`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: modifierOptionForm.name.trim(),
          modifier_category_id: Number(modifierOptionForm.category_id),
          price: Number(modifierOptionForm.price)
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || 'Не удалось создать опцию модификатора');
      }

      const result = await res.json();
      setModifierOptions(prev => [...prev, {
        id: Date.now(),
        name: result,
        price: Number(modifierOptionForm.price),
        modifier_category_id: Number(modifierOptionForm.category_id)
      }]);
      
      setModifierOptionForm({ name: '', category_id: '', price: 0 });
      showToast({ title: 'Опция модификатора создана', type: 'success' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [token, disabled, modifierOptionForm, showToast]);

  // Add to menu
  const handleAddToMenu = useCallback(async () => {
    if (disabled || !menuForm.food_id) {
      showToast({ title: 'Ошибка', description: 'Выберите блюдо', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/food/menu`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          food_id: Number(menuForm.food_id),
          priority_level: Number(menuForm.priority_level)
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || 'Не удалось добавить в меню');
      }

      const result = await res.json();
      const selectedFood = createdFoods.find(f => f.id === Number(menuForm.food_id));
      
      if (selectedFood) {
        setMenuItems(prev => [...prev, {
          id: result.id,
          food_id: result.food_id,
          priority_level: result.priority_level,
          food: selectedFood
        }]);
      }
      
      setMenuForm({ food_id: '', priority_level: 1 });
      showToast({ title: 'Добавлено в меню', type: 'success' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [token, disabled, menuForm, createdFoods, showToast]);

  // Image upload
  const handleImageUpload = useCallback(async (foodId: number) => {
    if (!selectedImage || disabled) return;
    
    setUploadingImages(prev => ({ ...prev, [foodId]: true }));
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      const res = await fetch(`${API_BASE}/food/${foodId}/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || 'Не удалось загрузить изображение');
      }
      
      showToast({ title: 'Изображение загружено', type: 'success' });
      setSelectedImage(null);
      
      // Update the food images state
      setFoodImages(prev => ({ ...prev, [foodId]: URL.createObjectURL(selectedImage) }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка загрузки', description: msg, type: 'error' });
    } finally {
      setUploadingImages(prev => ({ ...prev, [foodId]: false }));
    }
  }, [selectedImage, disabled, token, showToast]);

  // Form handlers
  const handleAddSize = useCallback(() => {
    setFoodForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', is_new: false, price: 0 }]
    }));
  }, []);

  const handleRemoveSize = useCallback((idx: number) => {
    setFoodForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== idx)
    }));
  }, []);

  const handleSizeChange = useCallback((idx: number, key: keyof FoodSize, value: string | boolean | number) => {
    setFoodForm(prev => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => 
        i === idx ? { ...s, [key]: key === 'price' ? Number(value) : value } as FoodSize : s
      )
    }));
  }, []);

  // Load images for existing foods
  useEffect(() => {
    if (!token || createdFoods.length === 0) return;
    
    createdFoods.forEach(food => {
      if (food.id && !foodImages[food.id]) {
        loadFoodImage(food.id);
      }
    });
  }, [token, createdFoods, foodImages, loadFoodImage]);

  if (isLoading) {
    console.log('AdminPanel: Rendering loading state');
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Загрузка...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!token) {
    console.log('AdminPanel: Rendering no token state');
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Требуется авторизация</h2>
              <p className="text-gray-600">Войдите чтобы использовать админ-панель</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  try {
    console.log('AdminPanel: Rendering main content', { 
      foodTypes: foodTypes?.length || 0,
      modifierCategories: modifierCategories?.length || 0,
      modifierOptions: modifierOptions?.length || 0,
      menuItems: menuItems?.length || 0,
      createdFoods: createdFoods?.length || 0
    });
    
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
              <p className="text-gray-600">Управление меню ресторана</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleRefresh} 
                disabled={refreshing}
                variant="secondary" 
                size="sm"
              >
                {refreshing ? 'Обновление...' : '🔄 Обновить'}
              </Button>
              <Button 
                onClick={loadData} 
                variant="secondary" 
                size="sm"
              >
                📡 Загрузить данные
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="secondary" 
                size="sm"
              >
                ← На главную
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'food', label: 'Создание блюд', icon: '🍽️' },
                { id: 'types', label: 'Типы блюд', icon: '🏷️' },
                { id: 'modifiers', label: 'Модификаторы', icon: '⚙️' },
                { id: 'menu', label: 'Управление меню', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'food' | 'types' | 'modifiers' | 'menu')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Data Status */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Статус данных:</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${foodTypes?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>Типы: {foodTypes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${modifierCategories?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>Категории: {modifierCategories?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${modifierOptions?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>Опции: {modifierOptions?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${menuItems?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>Меню: {menuItems?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${createdFoods?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>Блюда: {createdFoods?.length || 0}</span>
            </div>
          </div>
          
          {/* API Errors */}
          {Object.keys(apiErrors).length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-900 mb-2">Ошибки API:</h4>
              {Object.entries(apiErrors).map(([endpoint, error]) => (
                <div key={endpoint} className="text-xs text-red-700 mb-1">
                  <strong>{endpoint}:</strong> {error}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'food' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Food creation form */}
            <div className="space-y-6">
              <SectionCard title="Создание нового блюда" subtitle="Заполните информацию о блюде">
                <div className="space-y-4">
                  <InputField
                    label="Название блюда"
                    value={foodForm.name}
                    onChange={(v) => setFoodForm(prev => ({ ...prev, name: v }))}
                    placeholder="Например: Шаурма с курицей"
                    required
                  />
                  
                  <InputField
                    label="Описание"
                    value={foodForm.description}
                    onChange={(v) => setFoodForm(prev => ({ ...prev, description: v }))}
                    placeholder="Краткое описание блюда"
                  />
                  
                  <SelectField
                    label="Тип блюда"
                    value={foodForm.type_id}
                    onChange={(v) => setFoodForm(prev => ({ ...prev, type_id: v }))}
                    options={(foodTypes || []).map(t => ({ value: String(t.id), label: t.name }))}
                    placeholder="Выберите тип блюда"
                    required
                  />
                </div>
              </SectionCard>

              <SectionCard title="Размеры и цены" subtitle="Добавьте варианты размера и стоимость">
                <div className="space-y-4">
                  {foodForm.sizes.map((size, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end p-4 border border-gray-200 rounded-lg">
                      <div className="sm:col-span-2">
                        <InputField
                          label="Название размера"
                          value={size.name}
                          onChange={(v) => handleSizeChange(idx, 'name', v)}
                          placeholder="Например: Маленькая, Большая"
                        />
                      </div>
                      <div>
                        <InputField
                          label="Цена (₸)"
                          value={size.price}
                          onChange={(v) => handleSizeChange(idx, 'price', v)}
                          type="number"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Toggle
                          label="Новинка"
                          checked={size.is_new}
                          onChange={(v) => handleSizeChange(idx, 'is_new', v)}
                          description="Отметить как новинку"
                        />
                        {foodForm.sizes.length > 1 && (
                          <button
                            onClick={() => handleRemoveSize(idx)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={handleAddSize} variant="secondary" size="sm">
                    + Добавить размер
                  </Button>
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <Button onClick={handleCreateFood} disabled={disabled}>
                  🍽️ Создать блюдо
                </Button>
              </div>
            </div>

            {/* Right: Preview and created foods */}
            <div className="space-y-6">
              <SectionCard title="Предпросмотр" subtitle="Как будет выглядеть блюдо">
                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <p className="text-sm">Изображение</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 truncate">
                        {foodForm.name || 'Новое блюдо'}
                      </h3>
                      <span className="text-red-600 font-bold text-lg">
                        {foodForm.sizes.length && foodForm.sizes.some(s => s.price > 0) 
                          ? `от ${Math.min(...foodForm.sizes.map(s => s.price || 0))}₸` 
                          : '0₸'
                        }
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {foodForm.description || 'Описание блюда появится здесь'}
                    </p>
                                            <div className="flex flex-wrap gap-2">
                          {(foodForm.sizes || []).map((size, i) => (
                            <span key={i} className="text-sm px-3 py-1 rounded-full border border-gray-200 text-gray-700">
                              {size.name || 'Размер'} • {size.price || 0}₸
                              {size.is_new && (
                                <span className="ml-1 text-red-500 text-xs">✨</span>
                              )}
                            </span>
                          ))}
                        </div>
                  </div>
                </div>
              </SectionCard>

              {createdFoods && createdFoods.length > 0 && (
                <SectionCard title="Созданные блюда" subtitle="Управление изображениями">
                  <div className="space-y-3">
                    {createdFoods.map(food => (
                      <div key={food.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {foodImages[food.id] ? (
                              <img 
                                src={foodImages[food.id]} 
                                alt={food.name || 'Блюдо'}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">IMG</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{food.name || 'Без названия'}</p>
                            <p className="text-sm text-gray-500">{food.food_type_name || 'Без типа'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  showToast({ 
                                    title: 'Ошибка', 
                                    description: 'Файл слишком большой. Максимум: 5MB', 
                                    type: 'error' 
                                  });
                                  return;
                                }
                                setSelectedImage(file);
                                handleImageUpload(food.id);
                              }
                            }}
                            className="hidden"
                            id={`image-upload-${food.id}`}
                          />
                          <Button
                            onClick={() => document.getElementById(`image-upload-${food.id}`)?.click()}
                            disabled={uploadingImages[food.id]}
                            variant="secondary"
                            size="sm"
                          >
                            {uploadingImages[food.id] ? '⏳' : '📷'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionCard title="Создать новый тип блюда" subtitle="Добавьте новую категорию">
              <div className="space-y-4">
                <InputField
                  label="Название типа"
                  value={typeForm.name}
                  onChange={(v) => setTypeForm({ name: v })}
                  placeholder="Например: Основные блюда, Закуски, Напитки"
                  required
                />
                <Button onClick={handleCreateType} disabled={disabled}>
                  🏷️ Создать тип
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Существующие типы" subtitle="Все доступные категории блюд">
              <div className="space-y-3">
                {(foodTypes || []).map(type => (
                  <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{type.name}</span>
                    <span className="text-sm text-gray-500">ID: {type.id}</span>
                  </div>
                ))}
                {(!foodTypes || foodTypes.length === 0) && (
                  <p className="text-gray-500 text-center py-4">Типы блюд не найдены</p>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'modifiers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <SectionCard title="Создать категорию модификаторов" subtitle="Например: Соусы, Добавки">
                <div className="space-y-4">
                  <InputField
                    label="Название категории"
                    value={modifierCategoryForm.name}
                    onChange={(v) => setModifierCategoryForm({ name: v })}
                    placeholder="Например: Соусы"
                    required
                  />
                  <Button onClick={handleCreateModifierCategory} disabled={disabled}>
                    🏷️ Создать категорию
                  </Button>
                </div>
              </SectionCard>

              <SectionCard title="Создать опцию модификатора" subtitle="Добавьте конкретные опции в категорию">
                <div className="space-y-4">
                  <InputField
                    label="Название опции"
                    value={modifierOptionForm.name}
                    onChange={(v) => setModifierOptionForm(prev => ({ ...prev, name: v }))}
                    placeholder="Например: Кетчуп, Майонез"
                    required
                  />
                  <SelectField
                    label="Категория"
                    value={modifierOptionForm.category_id}
                    onChange={(v) => setModifierOptionForm(prev => ({ ...prev, category_id: v }))}
                    options={(modifierCategories || []).map(c => ({ value: String(c.id), label: c.name }))}
                    placeholder="Выберите категорию"
                    required
                  />
                  <InputField
                    label="Доплата (₸)"
                    value={modifierOptionForm.price}
                    onChange={(v) => setModifierOptionForm(prev => ({ ...prev, price: Number(v) || 0 }))}
                    type="number"
                    placeholder="0"
                  />
                  <Button onClick={handleCreateModifierOption} disabled={disabled}>
                    ⚙️ Создать опцию
                  </Button>
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard title="Категории модификаторов" subtitle="Все доступные категории">
                <div className="space-y-3">
                  {(modifierCategories || []).map(category => (
                    <div key={category.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
                      <div className="space-y-1">
                        {(modifierOptions || [])
                          .filter(option => option.modifier_category_id === category.id)
                          .map(option => (
                            <div key={option.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{option.name}</span>
                              <span className="text-gray-500">+{option.price}₸</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                  {(!modifierCategories || modifierCategories.length === 0) && (
                    <p className="text-gray-500 text-center py-4">Категории не найдены</p>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <SectionCard title="Добавить блюдо в меню" subtitle="Управление отображением блюд">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <SelectField
                  label="Выберите блюдо"
                  value={menuForm.food_id}
                  onChange={(v) => setMenuForm(prev => ({ ...prev, food_id: v }))}
                  options={(createdFoods || [])
                    .filter(food => !(menuItems || []).some(item => item.food_id === food.id))
                    .map(food => ({ value: String(food.id), label: food.name }))
                  }
                  placeholder="Выберите блюдо для добавления"
                  required
                />
                <InputField
                  label="Приоритет отображения"
                  value={menuForm.priority_level}
                  onChange={(v) => setMenuForm(prev => ({ ...prev, priority_level: Number(v) || 1 }))}
                  type="number"
                  placeholder="1"
                />
                <Button onClick={handleAddToMenu} disabled={disabled || !menuForm.food_id}>
                  📋 Добавить в меню
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Текущее меню" subtitle="Блюда, отображаемые в каталоге">
              <div className="space-y-4">
                {(menuItems && menuItems.length > 0) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.food?.name || 'Без названия'}</h4>
                          <span className="text-sm text-gray-500">Приоритет: {item.priority_level}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.food?.food_type_name || 'Без типа'}</p>
                        <div className="flex flex-wrap gap-1">
                          {(item.food?.food_sizes || []).map(size => (
                            <span key={size.id || Math.random()} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                              {size.name} • {size.price}₸
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">В меню пока нет блюд</p>
                    <p className="text-sm text-gray-400 mt-1">Создайте блюда и добавьте их в меню</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </main>
    );
  } catch (error) {
    console.error('AdminPanel render error:', error);
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка рендеринга</h1>
            <p className="text-gray-600">Произошла ошибка при загрузке админ панели</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      </main>
    );
  }
};

export default AdminPanel;
