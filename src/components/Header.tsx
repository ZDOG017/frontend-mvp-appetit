import React from 'react';
import logo from '../assets/logo.png';
import languageIcon from '../assets/icon_language.png';

const Header: React.FC = () => {
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
            <div className="flex items-center space-x-6">
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
