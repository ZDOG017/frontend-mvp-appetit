import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://robocraft.site/api/v1';

type FoodSize = { name: string; is_new: boolean; price: number };
type FoodType = { id: number; name: string };
type ModifierCategory = { id: number; name: string };
type CreatedFood = { id: number; name: string; type_name: string; added_to_menu: boolean };

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }>
  = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
    <div className="mb-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}>
  = ({ label, value, onChange, options, placeholder }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    <select
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || 'Выберите...'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </label>
);

const InputField: React.FC<{
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}>
  = ({ label, value, onChange, type = 'text', placeholder }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    <input
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition"
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
    />
  </label>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }>
  = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 select-none">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative w-11 h-6 rounded-full transition ${checked ? 'bg-red-500' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 ${checked ? 'left-5' : 'left-0.5'} w-5 h-5 rounded-full bg-white shadow transition`}/>
    </button>
  </label>
);

const AdminPanel: React.FC = () => {
  const { token, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Data state
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [modifierCategories, setModifierCategories] = useState<ModifierCategory[]>([]);
  const [createdFoods, setCreatedFoods] = useState<CreatedFood[]>([]);

  // Food form state
  const [foodName, setFoodName] = useState('');
  const [foodDesc, setFoodDesc] = useState('');
  const [foodTypeId, setFoodTypeId] = useState('');
  const [sizes, setSizes] = useState<FoodSize[]>([{ name: '', is_new: false, price: 0 }]);

  // Type form
  const [typeName, setTypeName] = useState('');

  // Modifier category
  const [modCatName, setModCatName] = useState('');

  // Modifier option
  const [modOptName, setModOptName] = useState('');
  const [modOptCatId, setModOptCatId] = useState('');
  const [modOptPrice, setModOptPrice] = useState('0');

  // Menu management
  const [selectedFoodForMenu, setSelectedFoodForMenu] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('1');

  // Image upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});
  const [foodImages, setFoodImages] = useState<Record<number, string>>({});

  const disabled = useMemo(() => !token, [token]);

  // Load initial data
  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    
    if (!token) {
      showToast({ title: 'Требуется авторизация', description: 'Войдите чтобы использовать админ-панель', type: 'info' });
      return;
    }
    
    const loadData = async () => {
      try {
        const [typesRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/food/type`, { headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE}/food/modifiers`, { headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (typesRes.ok) {
          const types: FoodType[] = await typesRes.json();
          setFoodTypes(types);
        }
        
        if (categoriesRes.ok) {
          const categories: ModifierCategory[] = await categoriesRes.json();
          setModifierCategories(categories);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, [token, isLoading, showToast]);

  const handleAddSize = useCallback(() => {
    setSizes((prev) => [...prev, { name: '', is_new: false, price: 0 }]);
  }, []);

  const handleRemoveSize = useCallback((idx: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSizeChange = useCallback((idx: number, key: keyof FoodSize, value: string | boolean) => {
    setSizes((prev) => prev.map((s, i) => i === idx ? { ...s, [key]: key === 'price' ? Number(value) : value } as FoodSize : s));
  }, []);

  const jsonHeaders = useMemo(() => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  // Load existing image for a food item
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
      // Image not found or error loading, keep default state
    }
  }, [token]);

  const handleCreateFood = useCallback(async () => {
    if (disabled || !foodName || !foodTypeId || !sizes.some(s => s.name && s.price > 0)) {
      showToast({ title: 'Заполните все поля', description: 'Название, тип и хотя бы один размер с ценой обязательны', type: 'error' });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/food`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({
          name: foodName,
          description: foodDesc,
          food_sizes: sizes.filter(s => s.name && s.price > 0),
          possible_food_modifiers: [],
          type_id: Number(foodTypeId)
        })
      });
      if (!res.ok) throw new Error('Не удалось создать блюдо');
      const result = await res.json();
      const selectedType = foodTypes.find(t => t.id === Number(foodTypeId));
      const newFood: CreatedFood = {
        id: result.id || Date.now(),
        name: result.name,
        type_name: selectedType?.name || 'Неизвестный тип',
        added_to_menu: false
      };
      setCreatedFoods(prev => [...prev, newFood]);
      showToast({ title: 'Блюдо создано', description: 'Теперь добавьте его в меню', type: 'success' });
      setFoodName(''); setFoodDesc(''); setFoodTypeId(''); setSizes([{ name: '', is_new: false, price: 0 }]);
      
      // Load image for the newly created food
      if (newFood.id) {
        loadFoodImage(newFood.id);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [jsonHeaders, disabled, foodDesc, foodName, foodTypeId, sizes, showToast, foodTypes, loadFoodImage]);

  const handleCreateType = useCallback(async () => {
    if (disabled) return;
    try {
      const res = await fetch(`${API_BASE}/food/type`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ name: typeName })
      });
      if (!res.ok) throw new Error('Не удалось создать тип блюда');
      showToast({ title: 'Тип блюда создан', type: 'success' });
      setTypeName('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [jsonHeaders, disabled, showToast, typeName]);

  const handleCreateModCat = useCallback(async () => {
    if (disabled) return;
    try {
      const res = await fetch(`${API_BASE}/food/modifiers`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ name: modCatName })
      });
      if (!res.ok) throw new Error('Не удалось создать категорию модификаторов');
      showToast({ title: 'Категория модификаторов создана', type: 'success' });
      setModCatName('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [jsonHeaders, disabled, modCatName, showToast]);

  const handleCreateModOpt = useCallback(async () => {
    if (disabled || !modOptName || !modOptCatId) return;
    try {
      const res = await fetch(`${API_BASE}/food/modifiers/options`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ name: modOptName, modifier_category_id: Number(modOptCatId), price: Number(modOptPrice || 0) })
      });
      if (!res.ok) throw new Error('Не удалось создать опцию');
      showToast({ title: 'Опция модификатора создана', type: 'success' });
      setModOptName(''); setModOptCatId(''); setModOptPrice('0');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [jsonHeaders, disabled, modOptCatId, modOptName, modOptPrice, showToast]);

  const handleAddToMenu = useCallback(async () => {
    if (disabled || !selectedFoodForMenu) return;
    try {
      const res = await fetch(`${API_BASE}/food/menu`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ food_id: Number(selectedFoodForMenu), priority_level: Number(priorityLevel) })
      });
      if (!res.ok) throw new Error('Не удалось добавить в меню');
      setCreatedFoods(prev => prev.map(f => f.id === Number(selectedFoodForMenu) ? {...f, added_to_menu: true} : f));
      showToast({ title: 'Добавлено в меню', type: 'success' });
      setSelectedFoodForMenu(''); setPriorityLevel('1');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка', description: msg, type: 'error' });
    }
  }, [jsonHeaders, disabled, selectedFoodForMenu, priorityLevel, showToast]);

  // Load images for existing foods
  useEffect(() => {
    if (!token || createdFoods.length === 0) return;
    
    createdFoods.forEach(food => {
      if (food.id && !foodImages[food.id]) {
        loadFoodImage(food.id);
      }
    });
  }, [token, createdFoods, foodImages, loadFoodImage]);

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
      
      // Update the food images state to show the new image
      setFoodImages(prev => ({ ...prev, [foodId]: URL.createObjectURL(selectedImage) }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      showToast({ title: 'Ошибка загрузки', description: msg, type: 'error' });
    } finally {
      setUploadingImages(prev => ({ ...prev, [foodId]: false }));
    }
  }, [selectedImage, disabled, token, showToast]);

  // Remove image for a food item
  const handleRemoveImage = useCallback((foodId: number) => {
    setFoodImages(prev => {
      const newImages = { ...prev };
      delete newImages[foodId];
      return newImages;
    });
    showToast({ title: 'Изображение удалено', type: 'info' });
  }, [showToast]);



  if (isLoading) {
    return (
      <main className="bg-white">
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

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Админ панель</h1>
            <p className="text-sm text-gray-500">Конструктор блюда: создайте типы, модификаторы и публикуйте</p>
          </div>
          <button onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm text-gray-500 hover:text-gray-700">← На главную</button>
        </div>
        {/* Constructor layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Constructor controls */}
          <div className="space-y-6">
            <SectionCard title="Детали блюда" subtitle="Название, описание, тип">
              <div className="space-y-4">
                <InputField label="Название" value={foodName} onChange={setFoodName} />
                <InputField label="Описание" value={foodDesc} onChange={setFoodDesc} />
                <SelectField 
                  label="Тип блюда" 
                  value={foodTypeId} 
                  onChange={setFoodTypeId}
                  options={foodTypes.map(t => ({ value: String(t.id), label: t.name }))}
                  placeholder="Выберите тип блюда"
                />
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">Создать новый тип</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div className="sm:col-span-2">
                      <InputField label="Название нового типа" value={typeName} onChange={setTypeName} />
                    </div>
                    <button disabled={disabled || !typeName} onClick={handleCreateType} className={`h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold px-4 ${disabled || !typeName ? 'opacity-60 cursor-not-allowed' : 'hover:bg-black'}`}>Создать тип</button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Размеры" subtitle="Добавьте один или несколько размеров и цену">
              <div className="space-y-3">
                {sizes.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                    <div className="sm:col-span-2">
                      <InputField label="Название" value={s.name} onChange={(v) => handleSizeChange(idx, 'name', v)} />
                    </div>
                    <div>
                      <InputField label="Цена" type="number" value={s.price} onChange={(v) => handleSizeChange(idx, 'price', v)} />
                    </div>
                    <div>
                      <Toggle label="Новый" checked={s.is_new} onChange={(v) => handleSizeChange(idx, 'is_new', v)} />
                    </div>
                    <div className="flex justify-end sm:justify-start pt-2">
                      <button onClick={() => handleRemoveSize(idx)} className="text-sm text-gray-500 hover:text-red-600">Удалить</button>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddSize} className="text-sm text-red-600 hover:text-red-700">+ Добавить размер</button>
              </div>
            </SectionCard>

            <SectionCard title="Модификаторы" subtitle="Создайте категории и опции">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">Категория</p>
                  <InputField label="Название категории" value={modCatName} onChange={setModCatName} />
                  <button disabled={disabled || !modCatName} onClick={handleCreateModCat} className={`w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-semibold px-5 py-2.5 rounded-xl transition ${disabled || !modCatName ? 'opacity-60 cursor-not-allowed' : ''}`}>Создать категорию</button>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">Опция</p>
                  <InputField label="Название опции" value={modOptName} onChange={setModOptName} />
                  <SelectField 
                    label="Категория" 
                    value={modOptCatId} 
                    onChange={setModOptCatId}
                    options={modifierCategories.map(c => ({ value: String(c.id), label: c.name }))}
                    placeholder="Выберите категорию"
                  />
                  <InputField label="Цена" value={modOptPrice} onChange={setModOptPrice} type="number" />
                  <button disabled={disabled || !modOptName || !modOptCatId} onClick={handleCreateModOpt} className={`w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-semibold px-5 py-2.5 rounded-xl transition ${disabled || !modOptName || !modOptCatId ? 'opacity-60 cursor-not-allowed' : ''}`}>Создать опцию</button>
                </div>
              </div>
            </SectionCard>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Проверьте предпросмотр справа и создайте блюдо</p>
              <button disabled={disabled} onClick={handleCreateFood} className={`bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>Создать блюдо</button>
            </div>

            {createdFoods.length > 0 && (
              <SectionCard title="Управление меню" subtitle="Добавьте созданные блюда в меню и загружайте изображения для отображения в каталоге">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <SelectField 
                      label="Выберите блюдо" 
                      value={selectedFoodForMenu} 
                      onChange={setSelectedFoodForMenu}
                      options={createdFoods.filter(f => !f.added_to_menu).map(f => ({ value: String(f.id), label: `${f.name} (${f.type_name})` }))}
                      placeholder="Выберите блюдо"
                    />
                    <InputField label="Приоритет" value={priorityLevel} onChange={setPriorityLevel} type="number" placeholder="1" />
                    <button disabled={disabled || !selectedFoodForMenu} onClick={handleAddToMenu} className={`h-11 rounded-xl bg-green-600 text-white text-sm font-semibold px-4 ${disabled || !selectedFoodForMenu ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'}`}>Добавить в меню</button>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Созданные блюда:</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Здесь вы можете загружать изображения для каждого блюда. 
                      Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 5MB.
                    </p>
                    <div className="space-y-2">
                      {createdFoods.map(food => (
                        <div key={food.id} className={`flex items-center justify-between p-3 rounded-lg border ${food.added_to_menu ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div>
                            <span className="font-medium">{food.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({food.type_name})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${food.added_to_menu ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {food.added_to_menu ? 'В меню' : 'Не добавлено'}
                            </span>
                            <div className="flex items-center gap-2">
                                                          <button
                              onClick={() => document.getElementById(`image-upload-${food.id}`)?.click()}
                              disabled={uploadingImages[food.id]}
                              className={`text-xs px-2 py-1 rounded border ${
                                uploadingImages[food.id]
                                  ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                                  : 'text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300'
                              }`}
                            >
                              {uploadingImages[food.id] ? '⏳ Загрузка...' : '📷 Загрузить фото'}
                            </button>
                              
                              {/* Image preview */}
                              {foodImages[food.id] ? (
                                <div className="relative group">
                                  <img 
                                    src={foodImages[food.id]} 
                                    alt={food.name}
                                    className="w-8 h-8 rounded border object-cover"
                                  />
                                  <button
                                    onClick={() => handleRemoveImage(food.id)}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                                    title="Удалить изображение"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                                  <span className="text-xs text-gray-500">IMG</span>
                                </div>
                              )}
                              
                              <input
                                id={`image-upload-${food.id}`}
                                type="file"
                                accept="image/*"
                                                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      // Validate file size (max 5MB)
                                      if (file.size > 5 * 1024 * 1024) {
                                        showToast({ 
                                          title: 'Ошибка валидации', 
                                          description: `Файл слишком большой: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Максимум: 5MB`, 
                                          type: 'error' 
                                        });
                                        return;
                                      }
                                      
                                      // Validate file type
                                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                                      if (!allowedTypes.includes(file.type)) {
                                        showToast({ 
                                          title: 'Ошибка валидации', 
                                          description: `Неподдерживаемый формат: ${file.type}. Используйте JPG, PNG или GIF`, 
                                          type: 'error' 
                                        });
                                        return;
                                      }
                                      
                                      setSelectedImage(file);
                                      handleImageUpload(food.id);
                                    }
                                  }}
                                className="hidden"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}
          </div>

          {/* Right: Live preview */}
          <div className="lg:pl-4">
            <div className="sticky top-24">
              <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400">Изображение</div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{foodName || 'Новое блюдо'}</h3>
                    <span className="text-red-600 font-semibold">
                      {sizes.length ? `${Math.min(...sizes.map(s=>Number(s.price)||0))}₸` : '0₸'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{foodDesc || 'Описание блюда появится здесь'}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sizes.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-700">{s.name || 'Размер'} • {s.price || 0}₸</span>
                    ))}
                    {!sizes.length && <span className="text-xs text-gray-400">Добавьте размеры</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminPanel;


