import React from 'react';

const NavigationMenu: React.FC = () => {
  const menuItems = [
    'Блюда',
    'Закуски', 
    'Соусы',
    'Напитки',
    'Акции'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Navigation Links */}
        <nav className="flex items-center space-x-12">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase()}`}
              className="text-gray-800 hover:text-red-500 transition-colors font-medium text-lg"
              tabIndex={0}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Cart Button */}
        <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium text-lg transition-colors shadow-lg">
          Корзина
        </button>
      </div>
    </div>
  );
};

export default NavigationMenu;
