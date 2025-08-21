import React from 'react';
import shaurmaImage from '../assets/shaurma_bolshaya.svg';

const PopularItems: React.FC = () => {
  const popularProducts = [
    {
      id: 1,
      name: "Классическая",
      description: "Большая шаурма",
      price: "От 2490 тг.",
      image: shaurmaImage
    },
    {
      id: 2,
      name: "Классическая",
      description: "Большая шаурма", 
      price: "От 2490 тг.",
      image: shaurmaImage
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Часто заказывают
      </h2>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {popularProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl shadow-lg p-6 flex items-center space-x-6 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={product.image}
                alt={`${product.name} ${product.description}`}
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                {product.description}
              </p>
              <p className="text-lg font-medium text-gray-900">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularItems;
