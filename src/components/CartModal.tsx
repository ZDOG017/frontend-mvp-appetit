import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const CartModal: React.FC = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem,
    clearCart 
  } = useCart();

  // Блокируем скролл страницы когда модалка открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const deliveryFee = totalPrice >= 2500 ? 0 : 300;
  const finalTotal = totalPrice + deliveryFee;
  const progressToFreeDelivery = Math.min((totalPrice / 2500) * 100, 100);
  const amountForFreeDelivery = Math.max(2500 - totalPrice, 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop с blur эффектом */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={closeCart}
      />
      
      {/* Модальное окно */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-scaleIn max-h-[90vh] flex flex-col">
        
        {/* Шапка корзины */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-6 pb-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Корзина</h2>
                <p className="text-sm text-gray-500">
                  {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Закрыть корзину"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Прогресс до бесплатной доставки */}
          {amountForFreeDelivery > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">До бесплатной доставки</span>
                <span className="font-medium text-gray-900">{amountForFreeDelivery} ₸</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressToFreeDelivery}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Добавьте еще на {amountForFreeDelivery} ₸ для бесплатной доставки
              </p>
            </div>
          )}

          {progressToFreeDelivery === 100 && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-green-800">Поздравляем! Доставка бесплатная 🎉</span>
              </div>
            </div>
          )}
        </div>

        {/* Содержимое корзины */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
              <p className="text-gray-500 text-center mb-6">
                Добавьте блюда из меню, чтобы сделать заказ
              </p>
              <button 
                onClick={closeCart}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Продолжить покупки
              </button>
            </div>
          ) : (
            <div className="p-6 pt-0 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  {/* Изображение товара */}
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Информация о товаре */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{item.description || item.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-gray-900">{item.price} ₸</span>
                      
                      {/* Количество */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Кнопка удаления */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                    aria-label="Удалить товар"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Кнопка очистки корзины */}
              {items.length > 1 && (
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  Очистить корзину
                </button>
              )}
            </div>
          )}
        </div>

        {/* Итоги и кнопка заказа */}
        {items.length > 0 && (
          <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 p-6 pt-4">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Сумма заказа</span>
                <span>{totalPrice} ₸</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                  {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₸`}
                </span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Итого</span>
                <span>{finalTotal} ₸</span>
              </div>
            </div>

            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center space-x-2">
                <span>Оформить заказ</span>
                <span className="bg-red-400 px-2 py-1 rounded-lg text-sm">{finalTotal} ₸</span>
              </div>
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Время доставки: 25-35 минут
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
