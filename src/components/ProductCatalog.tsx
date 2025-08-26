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

          {/* Сетка продуктов (4 в ряд) - равномерная высота */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {section.products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Изображение продукта */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 group-hover:from-red-50 group-hover:to-orange-50 transition-colors duration-300">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback если изображение не загрузилось
                        const target = e.currentTarget;
                        if (target.src !== '/placeholder-image.svg') {
                          target.src = '/placeholder-image.svg';
                        }
                      }}
                    />
                    
                    {/* Overlay gradient на hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-lg" />
                  </div>
                  
                  {/* Бейдж "НОВИНКА" для некоторых продуктов */}
                  {(product.name.includes('Мраморная') || product.name.includes('Комбо') || product.name.includes('Шекер')) && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        НОВИНКА
                      </span>
                    </div>
                  )}
                  
                  {/* Floating effect */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 bg-red-200 rounded-full animate-ping" />
                  </div>
                  

                </div>

                {/* Информация о продукте */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Название продукта */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Описание */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  {/* Цена и кнопка - закреплены внизу */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">
                        {product.price.is_range ? 'от ' : ''}{formatPrice(product.price.price)}
                      </span>
                      {product.price.is_range && (
                        <span className="text-xs text-gray-500">за порцию</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => addItem({
                        id: `${section.title}-${product.id || Math.random()}`,
                        name: product.name,
                        price: product.price.price,
                        description: product.description,
                        category: section.title,
                        image: getProductImage(product)
                      })}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      Выбрать
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
