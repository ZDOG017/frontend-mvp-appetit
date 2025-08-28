import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import languageIcon from '../assets/icon_language.png';
import ProfilePushdown from './ProfilePushdown';
import { useToast } from '../context/ToastContext';

const Header: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [navSticky, setNavSticky] = useState<boolean>(false);
  const { user, openAuth, logout } = useAuth();
  const { showToast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const userInitials = useMemo(() => {
    if (!user) return 'A';
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'A';
    return full.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }, [user]);

  // Open the profile pushdown right after successful login
  useEffect(() => {
    if (user) {
      setIsProfileOpen(true);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ isSticky?: boolean }>;
      setNavSticky(Boolean(ce.detail && ce.detail.isSticky));
    };
    window.addEventListener('nav:sticky', handler as EventListener);
    // Initialize from dataset if available
    if (document.documentElement.dataset.navSticky) {
      setNavSticky(document.documentElement.dataset.navSticky === 'true');
    }
    return () => window.removeEventListener('nav:sticky', handler as EventListener);
  }, []);

  return (
    <header className="w-full bg-white shadow-lg border-b border-gray-100 relative z-60">
      {/* Language Selector - Premium design */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center space-x-2 px-3 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
              aria-label="Выбрать язык"
              tabIndex={0}
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <img 
                  src={languageIcon} 
                  alt="Language" 
                  className="w-3 h-3"
                />
              </div>
              <span className="text-sm font-medium">Русский</span>
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Стать партнером
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Поддержка
              </button>
              {/* admin check temporarily disabled */}
              {/* {user?.isAdmin && ( */}
              <button
                onClick={() => showToast({ title: 'Админ панель', description: 'Скоро здесь будет переход в админку', type: 'info' })}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Админ панель
              </button>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Content - Premium layout */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Navigation Section */}
        <div className="flex items-center justify-end py-5 relative">
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#contacts" 
              className="text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium relative group"
              tabIndex={0}
            >
              Контакты
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="#about" 
              className="text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium relative group"
              tabIndex={0}
            >
              О нас
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="#cashback" 
              className="text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium relative group"
              tabIndex={0}
            >
              Кэшбэк
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="#careers" 
              className="text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium relative group"
              tabIndex={0}
            >
              Вакансии
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            {!navSticky && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-red-50 transition"
                    aria-label="Открыть профиль"
                    tabIndex={0}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white flex items-center justify-center text-xs font-semibold">{userInitials}</div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-800">
                      {(user.firstName || user.lastName) ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : (user.email || 'Аккаунт')}
                    </span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>

                  <ProfilePushdown
                    user={user}
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    actions={[
                      { key: 'profile', label: 'Профиль', onClick: () => { setIsProfileOpen(false); showToast({ title: 'Профиль', description: 'Скоро здесь будет страница профиля', type: 'info' }); } },
                      { key: 'orders', label: 'Мои заказы', onClick: () => { setIsProfileOpen(false); showToast({ title: 'Заказы', description: 'Скоро здесь будет история заказов', type: 'info' }); } },
                      { key: 'addresses', label: 'Адреса доставки', onClick: () => { setIsProfileOpen(false); showToast({ title: 'Адреса', description: 'Сохраненные адреса доставки', type: 'info' }); } },
                      { key: 'payments', label: 'Способы оплаты', onClick: () => { setIsProfileOpen(false); showToast({ title: 'Оплата', description: 'Привяжите карту для быстрой оплаты', type: 'info' }); } },
                      { key: 'support', label: 'Поддержка', onClick: () => { setIsProfileOpen(false); showToast({ title: 'Поддержка', description: 'Мы всегда рядом, чтобы помочь', type: 'success' }); } },
                      { key: 'logout', label: 'Выйти', onClick: () => { setIsProfileOpen(false); logout(); } },
                    ]}
                  />
                </div>
              ) : (
                <button 
                  onClick={openAuth}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  tabIndex={0}
                >
                  Войти
                </button>
              )
            )}
          </nav>
        </div>

        {/* Logo - Enhanced positioning with premium effects */}
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20">
          <div className="group">
            <img 
              src={logo} 
              alt="APPETIT - Настоящий вкус мяса" 
              className="h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Bottom Section - Premium Delivery Info */}
        <div className="py-4">
          <div className="flex items-center">
            {/* Position delivery info to align with "Контакты" */}
            <div className="flex-1"></div>
            <div 
              className="flex items-center space-x-6 relative cursor-pointer group"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="text-left transition-all duration-200 group-hover:scale-105">
                <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Доставка шаурмы</div>
                <div className="text-red-500 font-semibold text-base group-hover:text-red-600 transition-colors">Усть Каменогорск</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-full group-hover:bg-green-100 transition-colors">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">25 мин</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1.5 rounded-full group-hover:bg-yellow-100 transition-colors">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-sm font-semibold text-yellow-700">5.0</span>
                </div>
              </div>

              {/* Natural Tooltip with Semi-transparent Dark Background */}
              {showTooltip && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600/50 z-[100] transform transition-all duration-200 ease-out">
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
