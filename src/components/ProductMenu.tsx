import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://robocraft.site/api/v1';

type FoodProduct = {
  id: number;
  name: string;
  description: string;
  food_type_id: number;
  food_type_name: string;
  food_sizes: Array<{
    id: number;
    name: string;
    is_new: boolean;
    price: number;
  }>;
  food_modifiers: Array<{
    modifier_cat_id: number;
    modifier_cat_name: string;
    modifier_options: Array<{
      id: number;
      name: string;
      price: number;
    }>;
  }>;
};

type MenuCategory = {
  food_type_id: number;
  food_type_name: string;
  foods: FoodProduct[];
};

const ProductCard: React.FC<{ product: FoodProduct }> = ({ product }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { token } = useAuth();

  const loadImage = useCallback(async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE}/food/${product.id}/image`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const imageData = await res.json();
        setImageUrl(imageData);
      } else {
        setImageError(true);
      }
    } catch {
      setImageError(true);
    }
  }, [product.id, token]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const minPrice = Math.min(...(product.food_sizes?.map(s => s.price) || [0]));
  const maxPrice = Math.max(...(product.food_sizes?.map(s => s.price) || [0]));
  const priceDisplay = minPrice === maxPrice ? `${minPrice}₸` : `${minPrice}₸ - ${maxPrice}₸`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : imageError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="animate-pulse">Загрузка...</div>
          </div>
        )}
        
        {/* New badge */}
        {product.food_sizes?.some(s => s.is_new) && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Новинка
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <span className="text-lg font-bold text-red-600 ml-2">{priceDisplay}</span>
        </div>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Sizes */}
        {product.food_sizes && product.food_sizes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Размеры:</p>
            <div className="flex flex-wrap gap-1">
              {product.food_sizes.map((size) => (
                <span 
                  key={size.id}
                  className={`text-xs px-2 py-1 rounded-full border ${
                    size.is_new 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {size.name} • {size.price}₸
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Type */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.food_type_name || 'Без типа'}
          </span>
          
          {/* Modifiers count */}
          {product.food_modifiers && product.food_modifiers.length > 0 && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {product.food_modifiers.length} модификатор{product.food_modifiers.length !== 1 ? 'а' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductMenu: React.FC = () => {
  const { token, isLoading } = useAuth();
  const { showToast } = useToast();
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load menu categories
  const loadMenuCategories = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      // Load menu from endpoint
      const res = await fetch(`${API_BASE}/food/menu`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('Menu data received:', data); // Debug log
        setMenuCategories(Array.isArray(data) ? data : []);
      } else {
        showToast({ title: 'Ошибка загрузки', description: 'Не удалось загрузить меню', type: 'error' });
      }
    } catch {
      showToast({ title: 'Ошибка', description: 'Проблема с загрузкой меню', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    if (!isLoading && token) {
      loadMenuCategories();
    }
  }, [isLoading, token, loadMenuCategories]);

  // Filter and flatten products from categories
  const allProducts = menuCategories.flatMap(category => category.foods);
  
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || product.food_type_id?.toString() === selectedType;
    return matchesSearch && matchesType;
  });

  // Get unique types from categories
  const types = menuCategories.map(category => ({ 
    id: category.food_type_id, 
    name: category.food_type_name 
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Требуется авторизация</h2>
          <p className="text-gray-600">Войдите чтобы просматривать меню</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Меню ресторана</h1>
          <p className="text-gray-600">Выберите блюдо из нашего меню</p>
          <p className="text-sm text-gray-500 mt-2">
            Загружено из базы данных через API
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Все типы</option>
            {types.map(type => (
              <option key={type.id} value={type.id.toString()}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Загрузка продуктов...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Продукты не найдены</h3>
            <p className="text-gray-500">
              {searchQuery || selectedType 
                ? 'Попробуйте изменить фильтры поиска' 
                : 'В меню пока нет продуктов'
              }
            </p>
          </div>
        )}

        {/* Results count */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Показано {filteredProducts.length} из {allProducts.length} продуктов
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductMenu;
