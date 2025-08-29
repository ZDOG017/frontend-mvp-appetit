import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface OrderTrackingDemoProps {
  onStepChange: (step: number) => void;
  currentStep: number;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  onReset: () => void;
}

const OrderTrackingDemo: React.FC<OrderTrackingDemoProps> = ({
  onStepChange,
  currentStep,
  isAutoPlaying,
  onToggleAutoPlay,
  onReset
}) => {
  const steps = [
    { id: 0, name: 'Заказ принят', color: 'bg-red-500' },
    { id: 1, name: 'В обработке', color: 'bg-orange-500' },
    { id: 2, name: 'Готовится', color: 'bg-yellow-500' },
    { id: 3, name: 'Готов к выдаче', color: 'bg-purple-500' },
    { id: 4, name: 'Передан курьеру', color: 'bg-red-500' },
    { id: 5, name: 'Доставлен', color: 'bg-green-500' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-orange-500" />
          <span>Демо-режим</span>
        </h2>
        <div className="flex items-center space-x-2">
                      <button
              onClick={onToggleAutoPlay}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isAutoPlaying 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoPlaying ? 'Пауза' : 'Авто'}</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Сброс</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className={`relative p-3 rounded-2xl text-center transition-all duration-200 hover:scale-105 ${
              currentStep === step.id 
                ? 'ring-2 ring-offset-2 ring-red-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
          >
            <div className={`w-3 h-3 ${step.color} rounded-full mx-auto mb-2 ${
              currentStep >= step.id ? 'animate-pulse' : 'opacity-30'
            }`} />
            <p className={`text-xs font-medium ${
              currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.name}
            </p>
            {currentStep === step.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          💡 Нажмите на любой этап для быстрого переключения или используйте автоматический режим
        </p>
      </div>
    </motion.div>
  );
};

export default OrderTrackingDemo;
