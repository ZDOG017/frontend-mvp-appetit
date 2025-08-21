import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Основная секция футера */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Колонка с логотипом и описанием */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-red-500">APPETIT</h3>
              <p className="text-sm text-gray-400 mt-1">Настоящий вкус мяса</p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Мы готовим самую вкусную шаурму в Усть-Каменогорске из качественных продуктов. 
              Быстрая доставка и всегда свежие ингредиенты.
            </p>
            
            {/* Социальные сети */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.349-1.051-2.349-2.35 0-1.297 1.052-2.349 2.349-2.349 1.299 0 2.351 1.052 2.351 2.349-.001 1.299-1.052 2.35-2.351 2.35zm7.718 0c-1.299 0-2.351-1.051-2.351-2.35 0-1.297 1.052-2.349 2.351-2.349 1.297 0 2.349 1.052 2.349 2.349 0 1.299-1.052 2.35-2.349 2.35z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.087"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Колонка меню */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Меню</h4>
            <ul className="space-y-2">
              <li><a href="#dishes" className="text-gray-300 hover:text-red-400 transition-colors">Блюда</a></li>
              <li><a href="#snacks" className="text-gray-300 hover:text-red-400 transition-colors">Закуски</a></li>
              <li><a href="#sauces" className="text-gray-300 hover:text-red-400 transition-colors">Соусы</a></li>
              <li><a href="#drinks" className="text-gray-300 hover:text-red-400 transition-colors">Напитки</a></li>
              <li><a href="#promos" className="text-gray-300 hover:text-red-400 transition-colors">Акции</a></li>
            </ul>
          </div>

          {/* Колонка о компании */}
          <div>
            <h4 className="text-lg font-semibold mb-4">О компании</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-300 hover:text-red-400 transition-colors">О нас</a></li>
              <li><a href="#careers" className="text-gray-300 hover:text-red-400 transition-colors">Вакансии</a></li>
              <li><a href="#cashback" className="text-gray-300 hover:text-red-400 transition-colors">Кэшбэк</a></li>
              <li><a href="#delivery" className="text-gray-300 hover:text-red-400 transition-colors">Доставка</a></li>
              <li><a href="#contacts" className="text-gray-300 hover:text-red-400 transition-colors">Контакты</a></li>
            </ul>
          </div>

          {/* Колонка контактов */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm">г. Усть-Каменогорск</p>
                  <p className="text-gray-400 text-xs">Казахстан</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <a href="tel:+77771234567" className="text-gray-300 hover:text-red-400 transition-colors text-sm">
                    +7 (777) 123-45-67
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <a href="mailto:info@appetit.kz" className="text-gray-300 hover:text-red-400 transition-colors text-sm">
                    info@appetit.kz
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm">Ежедневно</p>
                  <p className="text-gray-400 text-xs">10:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя секция футера */}
      <div className="border-t border-gray-800">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 APPETIT. Все права защищены.
              </p>
              <div className="flex space-x-4">
                <a href="#privacy" className="text-gray-400 hover:text-red-400 text-sm transition-colors">
                  Политика конфиденциальности
                </a>
                <a href="#terms" className="text-gray-400 hover:text-red-400 text-sm transition-colors">
                  Условия использования
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Принимаем к оплате:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">КК</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
