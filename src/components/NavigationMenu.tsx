import React, { useState, useEffect, useRef, useMemo } from 'react';
import miniLogo from '../assets/mini_logo.svg';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NavigationMenu: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const originalOffsetTop = useRef<number>(0);
  const animationRef = useRef<number | undefined>(undefined);
  const { totalItems, totalPrice, openCart } = useCart();
  const { user, openAuth, logout } = useAuth();

  const menuItems = useMemo(() => [
    { name: 'Акции', id: 'promos' },
    { name: 'Блюда', id: 'dishes' },
    { name: 'Закуски', id: 'snacks' },
    { name: 'Соусы', id: 'sauces' },
    { name: 'Напитки', id: 'drinks' }
  ], []);

  useEffect(() => {
    // Сохраняем изначальную позицию навигации
    if (navRef.current && originalOffsetTop.current === 0) {
      originalOffsetTop.current = navRef.current.offsetTop;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Более точная логика для sticky
      if (originalOffsetTop.current > 0) {
        setIsSticky(currentScrollY >= originalOffsetTop.current);
      }

      // Расчет прогресса скролла до последней секции
      const lastSection = document.getElementById('drinks');
      if (lastSection) {
        const lastSectionBottom = lastSection.offsetTop + lastSection.offsetHeight;
        const currentScroll = currentScrollY + window.innerHeight / 2;
        const progress = Math.min(100, Math.max(0, (currentScroll / lastSectionBottom) * 100));
        setTargetProgress(progress);
      }

      // Улучшенный scroll spy
      const sections = menuItems.map(item => {
        const element = document.getElementById(item.id);
        return { element, id: item.id };
      }).filter(item => item.element !== null);

      if (sections.length === 0) return; // Если секции еще не загружены

      const scrollPosition = currentScrollY + 120; // Оптимизированный offset
      let currentActiveSection = '';

      // Определяем активную секцию более точно
      for (let i = 0; i < sections.length; i++) {
        const { element, id } = sections[i];
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          // Проверяем, находится ли секция в видимой области
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentActiveSection = id;
            break;
          }
          
          // Если прокрутили ниже последней секции
          if (i === sections.length - 1 && scrollPosition >= elementTop) {
            currentActiveSection = id;
          }
        }
      }

      // Если все еще не нашли активную секцию, используем первую видимую
      if (!currentActiveSection) {
        for (let i = 0; i < sections.length; i++) {
          const { element, id } = sections[i];
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              currentActiveSection = id;
              break;
            }
          }
        }
      }

      // Устанавливаем активную секцию только если она изменилась
      if (currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };

    // Throttle scroll event для лучшей производительности
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Вызываем сразу для корректной инициализации
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [activeSection, menuItems]);

  // Плавная анимация progress bar
  useEffect(() => {
    const animateProgress = () => {
      setScrollProgress(current => {
        const difference = targetProgress - current;
        const step = difference * 0.1; // Скорость анимации (чем меньше, тем плавнее)
        
        if (Math.abs(difference) < 0.1) {
          return targetProgress; // Достигли целевого значения
        }
        
        return current + step;
      });
      
      animationRef.current = requestAnimationFrame(animateProgress);
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animateProgress();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetProgress]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Уменьшенный offset
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div 
        ref={navRef}
        id="navigation-menu"
        className={`w-full transition-all duration-500 ease-in-out z-40 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-md shadow-lg border-b border-white/20' 
            : 'relative bg-transparent'
        }`}
      >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Animated Mini Logo */}
          <div className={`transition-all duration-700 ease-out ${
            isSticky 
              ? 'opacity-100 translate-x-0 scale-100' 
              : 'opacity-0 -translate-x-8 scale-95 pointer-events-none'
          }`}>
            {isSticky && (
              <img 
                src={miniLogo} 
                alt="APPETIT Mini Logo" 
                className="h-8 w-auto transition-all duration-300 hover:scale-105"
              />
            )}
          </div>

          {/* Navigation Links */}
          <nav className={`flex items-center space-x-8 transition-all duration-500 ${
            isSticky ? 'ml-6' : ''
          }`}>
            {menuItems.map((item) => (
                               <button
                   key={item.id}
                   onClick={() => scrollToSection(item.id)}
                   className={`relative px-4 py-2 font-medium text-base transition-all duration-300 hover:scale-105 group ${
                     activeSection === item.id 
                       ? 'text-red-500' 
                       : isSticky 
                         ? 'text-gray-800 hover:text-red-500' 
                         : 'text-gray-800 hover:text-red-500'
                   }`}
                 >
                   {item.name}

                   {/* Эффект свечения для активного элемента */}
                   {activeSection === item.id && (
                     <span className="absolute inset-0 bg-red-500/10 rounded-lg -z-10 animate-pulse"></span>
                   )}
                 </button>
            ))}
          </nav>

          {/* Auth / User and Cart */}
          <div className="flex items-center space-x-3">
            {isSticky && (
              user ? (
                <div className="flex items-center space-x-3">
                  <span className="hidden sm:inline text-sm text-gray-700">{(user.firstName || user.lastName) ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Аккаунт'}</span>
                  <button onClick={logout} className="px-3 py-2 rounded-full text-sm bg-gray-100 hover:bg-gray-200">Выйти</button>
                </div>
              ) : (
                <button onClick={openAuth} className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200">Войти</button>
              )
            )}
          
          {/* Enhanced Cart Button */}
          <button 
            onClick={openCart}
            className={`relative bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group overflow-hidden ${
              isSticky ? 'text-sm px-4 py-2' : 'text-base px-6 py-3'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
              </svg>
              <span>Корзина</span>
              
              {/* Счетчик товаров */}
              {totalItems > 0 && (
                <span className="bg-white text-red-500 px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
              
              {/* Показать сумму если есть товары */}
              {totalPrice > 0 && !isSticky && (
                <span className="bg-red-400 px-2 py-1 rounded-lg text-sm">
                  {totalPrice} ₸
                </span>
              )}
            </div>
            
            {/* Анимированный фон */}
            <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            {/* Эффект пульсации */}
            <span className="absolute inset-0 bg-red-400 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 opacity-30"></span>
            
            {/* Пульсация при наличии товаров */}
            {totalItems > 0 && (
              <span className="absolute inset-0 bg-red-300 rounded-full animate-ping opacity-20"></span>
            )}
          </button>
          </div>
        </div>

        {/* Индикатор прогресса скролла */}
        {isSticky && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/70">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-400 shadow-sm"
              style={{
                width: `${scrollProgress}%`
              }}
            ></div>
          </div>
        )}
      </div>

      </div>
      
      {/* Spacer для предотвращения скачков контента */}
      {isSticky && <div className="h-16 w-full"></div>}
    </>
  );
};

export default NavigationMenu;
