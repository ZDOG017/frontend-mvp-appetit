import React from 'react';
import appfoodData from '../data/appfood_data.json';
import { useCart } from '../context/CartContext';

const ProductCatalog: React.FC = () => {
  const { addItem } = useCart();

  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return `${price} ₸`;
  };

  // Функция для получения изображения продукта
  const getProductImage = (product: { images?: Array<{ src: string; high?: string }> }) => {
    if (product.images && product.images.length > 0) {
      // Используем высококачественное изображение если доступно
      return product.images[0].high || product.images[0].src;
    }
    return '/placeholder-image.svg';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Перебираем все секции (категории) */}
      {appfoodData.sections.map((section) => {
        // Соответствие названий секций из JSON к ID для навигации
        const getSectionId = (title: string) => {
          const mapping: { [key: string]: string } = {
            'Комбо': 'promos',
            'Блюда': 'dishes', 
            'Закуски': 'snacks',
            'Соусы': 'sauces',
            'Напитки': 'drinks'
          };
          return mapping[title] || title.toLowerCase();
        };

        return (
        <div key={section.id} id={getSectionId(section.title)} className="mb-12 scroll-mt-24">
          {/* Заголовок категории */}
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {section.title}
            </h2>
            <div className="ml-4 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">✓</span>
              </div>
              <span className="ml-2 text-sm text-gray-600">
                Без свинины
              </span>
              <span className="ml-1 text-sm text-gray-600">
                Мы готовим из говядины и курицы
              </span>
            </div>
          </div>

          {/* Сетка продуктов (4 в ряд) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                {/* Изображение продукта */}
                <div className="relative">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-2">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback если изображение не загрузилось
                        const target = e.currentTarget;
                        if (target.src !== '/placeholder-image.svg') {
                          target.src = '/placeholder-image.svg';
                        }
                      }}
                    />
                  </div>
                  {/* Бейдж "НОВИНКА" для некоторых продуктов */}
                  {(product.name.includes('Мраморная') || product.name.includes('Комбо') || product.name.includes('Шекер')) && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        НОВИНКА
                      </span>
                    </div>
                  )}
                </div>

                {/* Информация о продукте */}
                <div className="p-4">
                  {/* Название продукта */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Описание */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Цена и кнопка */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price.is_range ? 'от ' : ''}{formatPrice(product.price.price)}
                    </span>
                    <button 
                      onClick={() => addItem({
                        id: `${section.title}-${product.id || Math.random()}`,
                        name: product.name,
                        price: product.price.price,
                        description: product.description,
                        category: section.title,
                        image: getProductImage(product)
                      })}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
                    >
                      <span className="group-hover:hidden">Выбрать</span>
                      <span className="hidden group-hover:inline-flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>В корзину</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default ProductCatalog;
