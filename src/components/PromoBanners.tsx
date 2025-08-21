import React from 'react';
import slider1 from '../assets/1_slider.png';
import slider2 from '../assets/2_slider.png';
import slider3 from '../assets/3_slider.png';

const PromoBanners: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Banner */}
        <div className="rounded-3xl overflow-hidden min-h-[400px]">
          <img 
            src={slider1} 
            alt="Slider 1" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Second Banner */}
        <div className="rounded-3xl overflow-hidden min-h-[400px]">
          <img 
            src={slider2} 
            alt="Slider 2" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Third Banner */}
        <div className="rounded-3xl overflow-hidden min-h-[400px]">
          <img 
            src={slider3} 
            alt="Slider 3" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;
