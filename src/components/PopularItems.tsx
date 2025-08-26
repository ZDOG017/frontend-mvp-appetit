import React from 'react';
import shaurmaImage from '../assets/shaurma_bolshaya.svg';
import { useCart } from '../context/CartContext';

const PopularItems: React.FC = () => {
  const { addItem } = useCart();
  
  const popularProducts = [
    {
      id: 'popular-classic-big',
      name: "Шаурма Классическая",
      description: "Большая сочная шаурма с курицей и фирменным соусом",
      price: 2490,
      originalPrice: 2890,
      image: shaurmaImage,
      badge: 'ХИТ ПРОДАЖ',
      badgeColor: 'bg-red-500',
      discount: 14
    },
    {
      id: 'popular-classic-medium',
      name: "Шаурма Классическая",
      description: "Средний размер, идеальный баланс вкуса и сытности", 
      price: 1990,
      originalPrice: 2290,
      image: shaurmaImage,
      badge: 'ПОПУЛЯРНО',
      badgeColor: 'bg-orange-500',
      discount: 13
    },
    {
      id: 'popular-mega',
      name: "Мега Шаурма",
      description: "Для тех, кто хочет максимум удовольствия", 
      price: 3490,
      image: shaurmaImage,
      badge: 'НОВИНКА',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'popular-vegan',
      name: "Вегетарианская",
      description: "Только свежие овощи и вкуснейшие соусы", 
      price: 1890,
      image: shaurmaImage,
      badge: 'ЭКО',
      badgeColor: 'bg-green-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Часто заказывают
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Самые популярные блюда, которые выбирают наши клиенты снова и снова
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {popularProducts.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              <div className="relative">
                <div className={`absolute top-6 left-6 ${product.badgeColor} text-white px-4 py-2 rounded-full text-xs font-bold z-10 shadow-lg`}>
                  {product.badge}
                </div>
                {product.discount && (
                  <div className="absolute top-6 right-6 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                    -{product.discount}%
                  </div>
                )}
              </div>

              <div className="p-8 flex items-center space-x-8">
                {/* Product Image */}
                <div className="flex-shrink-0 relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <img
                      src={product.image}
                      alt={`${product.name} ${product.description}`}
                      className="w-28 h-28 object-contain"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Floating effect */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-200 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.2s' }} />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Price Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-gray-900">
                        {product.price} ₸
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {product.originalPrice} ₸
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        image: product.image
                      })}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            Посмотреть всё меню
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularItems;
