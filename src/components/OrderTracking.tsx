import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Star,
  Zap,
  Shield,
  Gift,
  Timer,
  TrendingUp
} from 'lucide-react';
import OrderTrackingDemo from './OrderTrackingDemo';

// Types
interface OrderStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  isCompleted: boolean;
  isActive: boolean;
  timestamp?: string;
  estimatedTime?: string;
}

interface OrderDetails {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  specialInstructions?: string;
  createdAt: string;
  estimatedDeliveryTime: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
}

interface CourierInfo {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  plateNumber: string;
  estimatedArrival: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
}

const OrderTracking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderDetails] = useState<OrderDetails>({
    id: "ORD-2025-001",
    customerName: "Ерасыл Сансызбай",
    phone: "+7 (777) 123-45-67",
    address: "ул. Сатпаева, д. 15, кв. 42, Усть-Каменогорск",
    items: [
      { id: "1", name: "Шаурма Большая", quantity: 2, price: 450, modifiers: ["Острый соус", "Двойной сыр"] },
      { id: "2", name: "Картошка Фри", quantity: 1, price: 180 },
      { id: "3", name: "Кока-Кола", quantity: 2, price: 120 }
    ],
    totalAmount: 1380,
    paymentMethod: "Карта онлайн",
    specialInstructions: "Не звонить в дверь, оставить у консьержа",
    createdAt: "2024-01-15T14:30:00Z",
    estimatedDeliveryTime: "2024-01-15T15:45:00Z"
  });

  const [courierInfo] = useState<CourierInfo>({
    name: "Баке Маке",
    phone: "+7 (777) 987-65-43",
    rating: 4.8,
    vehicle: "Мотоцикл Yamaha",
    plateNumber: "А123БВ77",
    estimatedArrival: "15:35",
    currentLocation: { lat: 55.7558, lng: 37.6176 }
  });

  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([
    {
      id: "accepted",
      name: "Заказ принят",
      description: "Ваш заказ успешно оформлен и принят в обработку",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      isCompleted: true,
      isActive: false,
      timestamp: "14:30"
    },
    {
      id: "processing",
      name: "В обработке",
      description: "Повара готовят ваш заказ с любовью",
      icon: <ChefHat className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      isCompleted: false,
      isActive: true,
      timestamp: "14:35",
      estimatedTime: "5-7 мин"
    },
    {
      id: "cooking",
      name: "Готовится",
      description: "Ваш заказ готовится на кухне",
      icon: <ChefHat className="w-6 h-6" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      isCompleted: false,
      isActive: false,
      estimatedTime: "8-12 мин"
    },
    {
      id: "ready",
      name: "Готов к выдаче",
      description: "Заказ готов и ожидает курьера",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      isCompleted: false,
      isActive: false,
      estimatedTime: "2-3 мин"
    },
    {
      id: "courier",
      name: "Передан курьеру",
      description: "Курьер забрал заказ и везет к вам",
      icon: <Bike className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      isCompleted: false,
      isActive: false,
      estimatedTime: "15-20 мин"
    },
    {
      id: "delivered",
      name: "Доставлен",
      description: "Заказ успешно доставлен! Приятного аппетита!",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      isCompleted: false,
      isActive: false
    }
  ]);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCourierMap, setShowCourierMap] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Simulate order progress
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < orderStatuses.length - 1) {
          const newStep = prev + 1;
          
          // Update statuses
          setOrderStatuses(prevStatuses => 
            prevStatuses.map((status, index) => ({
              ...status,
              isCompleted: index < newStep,
              isActive: index === newStep,
              timestamp: index <= newStep ? new Date().toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : undefined
            }))
          );

          return newStep;
        }
        return prev;
      });
    }, 8000); // Change step every 8 seconds for demo

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deliveryTime = new Date(orderDetails.estimatedDeliveryTime).getTime();
      const remaining = Math.max(0, deliveryTime - now);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [orderDetails.estimatedDeliveryTime]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCallCourier = useCallback(() => {
    window.open(`tel:${courierInfo.phone}`, '_self');
  }, [courierInfo.phone]);

  const handleTrackCourier = useCallback(() => {
    setShowCourierMap(!showCourierMap);
  }, [showCourierMap]);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    setOrderStatuses(prevStatuses => 
      prevStatuses.map((status, index) => ({
        ...status,
        isCompleted: index < step,
        isActive: index === step,
        timestamp: index <= step ? new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : undefined
      }))
    );
  }, []);

  const handleToggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setOrderStatuses(prevStatuses => 
      prevStatuses.map((status, index) => ({
        ...status,
        isCompleted: index === 0,
        isActive: index === 0,
        timestamp: index === 0 ? new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : undefined
      }))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-gray-900">Отслеживание заказа</h1>
          <p className="text-gray-600">Заказ #{orderDetails.id}</p>
        </motion.div>

        {/* Demo Mode */}
        <OrderTrackingDemo
          onStepChange={handleStepChange}
          currentStep={currentStep}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={handleToggleAutoPlay}
          onReset={handleReset}
        />

        {/* Order Progress */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Статус заказа</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Осталось: {formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {orderStatuses.map((status, index) => (
              <motion.div
                key={status.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  status.isCompleted 
                    ? 'border-red-200 bg-red-50' 
                    : status.isActive 
                    ? 'border-orange-300 bg-orange-50 shadow-lg scale-105' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  status.isCompleted 
                    ? 'bg-red-500 text-white' 
                    : status.isActive 
                    ? 'bg-orange-500 text-white animate-pulse' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {status.icon}
                </div>

                {/* Status Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${
                      status.isCompleted 
                        ? 'text-red-800' 
                        : status.isActive 
                        ? 'text-orange-800' 
                        : 'text-gray-600'
                    }`}>
                      {status.name}
                    </h3>
                    {status.timestamp && (
                      <span className="text-sm text-gray-500">{status.timestamp}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                  {status.estimatedTime && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Timer className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600 font-medium">
                        Примерное время: {status.estimatedTime}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Line */}
                {index < orderStatuses.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-300">
                    {status.isCompleted && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        className="w-full bg-red-500 transition-all duration-500"
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Детали заказа</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {orderDetails.customerName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{orderDetails.customerName}</h3>
                  <p className="text-sm text-gray-500">{orderDetails.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 font-medium">Адрес доставки</p>
                  <p className="text-sm text-gray-600">{orderDetails.address}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Состав заказа</h4>
                <div className="space-y-2">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.quantity}x {item.name}
                        </p>
                        {item.modifiers && (
                          <p className="text-xs text-gray-500">
                            {item.modifiers.join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.price * item.quantity} ₸
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Итого:</span>
                    <span className="text-xl font-bold text-red-600">{orderDetails.totalAmount} ₸</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {orderDetails.specialInstructions && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
              <div className="flex items-start space-x-3">
                <Gift className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Особые пожелания</p>
                  <p className="text-sm text-yellow-700">{orderDetails.specialInstructions}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Courier Information */}
        {currentStep >= 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Информация о курьере</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Courier Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {courierInfo.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{courierInfo.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(courierInfo.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({courierInfo.rating})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                                     <div className="flex items-center space-x-3">
                     <Bike className="w-5 h-5 text-red-500" />
                     <div>
                       <p className="text-sm text-gray-900 font-medium">{courierInfo.vehicle}</p>
                       <p className="text-sm text-gray-500">№{courierInfo.plateNumber}</p>
                     </div>
                   </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-900 font-medium">Ожидаемое время прибытия</p>
                      <p className="text-sm text-green-600 font-semibold">{courierInfo.estimatedArrival}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Actions */}
              <div className="space-y-4">
                                 <button
                   onClick={handleCallCourier}
                   className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center space-x-2"
                 >
                   <Phone className="w-5 h-5" />
                   <span>Позвонить курьеру</span>
                 </button>

                 <button
                   onClick={handleTrackCourier}
                   className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center space-x-2"
                 >
                   <MapPin className="w-5 h-5" />
                   <span>{showCourierMap ? 'Скрыть карту' : 'Отследить на карте'}</span>
                 </button>

                {showCourierMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-100 rounded-2xl p-4 text-center"
                  >
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Карта отслеживания курьера</p>
                        <p className="text-xs text-gray-500 mt-1">Курьер в пути к вам</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl shadow-xl p-6 text-white"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <span>Премиум функции</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-medium">Безопасность</h3>
              <p className="text-sm text-purple-100">Курьер прошел верификацию</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-medium">Аналитика</h3>
              <p className="text-sm text-purple-100">Детальная статистика доставки</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-medium">Бонусы</h3>
              <p className="text-sm text-purple-100">Получите кэшбэк за заказ</p>
            </div>
          </div>
        </motion.div>

        {/* Delivery Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Прогресс доставки</h3>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / orderStatuses.length) * 100)}% завершено
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / orderStatuses.length) * 100}%` }}
              className="h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000"
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Заказ принят</span>
            <span>Доставлен</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;
