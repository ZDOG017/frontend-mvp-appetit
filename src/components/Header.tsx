import React, { useState } from 'react';
import logo from '../assets/logo.png';
import languageIcon from '../assets/icon_language.png';

const Header: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100">
      {/* Language Selector - Full width, positioned outside main container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2">
          <button 
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm"
            aria-label="Выбрать язык"
            tabIndex={0}
          >
            <img 
              src={languageIcon} 
              alt="Language" 
              className="w-4 h-4 mr-1"
            />
            Язык
          </button>
        </div>
      </div>

      {/* Main Header Content - Constrained width */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Section - Navigation */}
        <div className="flex items-center justify-end py-4 pr-8">
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#contacts" 
              className="text-gray-700 hover:text-red-500 transition-colors text-sm"
              tabIndex={0}
            >
              Контакты
            </a>
            <a 
              href="#about" 
              className="text-gray-700 hover:text-red-500 transition-colors text-sm"
              tabIndex={0}
            >
              О нас
            </a>
            <a 
              href="#cashback" 
              className="text-gray-700 hover:text-red-500 transition-colors text-sm"
              tabIndex={0}
            >
              Кэшбэк
            </a>
            <a 
              href="#careers" 
              className="text-gray-700 hover:text-red-500 transition-colors text-sm"
              tabIndex={0}
            >
              Вакансии
            </a>
            <a 
              href="#login" 
              className="text-gray-700 hover:text-red-500 transition-colors text-sm"
              tabIndex={0}
            >
              Войти
            </a>
          </nav>
        </div>

        {/* Logo - Positioned to span between sections */}
        <div className="absolute left-4 top-4 bottom-4 flex items-center z-10">
          <img 
            src={logo} 
            alt="APPETIT - Настоящий вкус мяса" 
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Bottom Section - Delivery Info */}
        <div className="py-3">
          <div className="flex items-center">
            {/* Position delivery info to align with "Контакты" */}
            <div className="flex-1"></div>
            <div 
              className="flex items-center space-x-6 relative cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="text-left">
                <div className="text-sm text-gray-600">Доставка шаурмы</div>
                <div className="text-red-500 font-medium">Усть Каменогорск</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">25 мин</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-sm font-medium ml-1">5.0</span>
                </div>
              </div>

              {/* Natural Tooltip with Semi-transparent Dark Background */}
              {showTooltip && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600/50 z-[9999] transform transition-all duration-200 ease-out">
                  {/* Arrow */}
                  <div className="absolute -top-1 right-8 w-2 h-2 bg-gray-800 border-l border-t border-gray-600/50 transform rotate-45"></div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Header */}
                    <div className="text-center pb-3 mb-3 border-b border-gray-600/30">
                      <p className="text-sm text-gray-200 font-medium">Время и стоимость доставки могут меняться</p>
                      <p className="text-xs text-gray-400 mt-1">зависят от вашего расположения и нагрузки</p>
                    </div>

                    {/* Rating Section */}
                    <div className="text-center mb-3">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-3xl font-bold text-white mr-3">5.0</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-yellow-400 text-lg">★</span>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-200 mb-1">
                        <span className="font-semibold">867 оценок</span>
                      </p>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        мы ценим что вы выбираете нас лучших в своем деле
                      </p>
                    </div>

                    {/* Update Info */}
                    <div className="text-center pt-2 border-t border-gray-600/30">
                      <p className="text-xs text-gray-400">
                        данные обновляются в течении последних 7 календарных дней
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
