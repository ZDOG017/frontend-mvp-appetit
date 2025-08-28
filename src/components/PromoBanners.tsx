import React from 'react';
import slider1 from '../assets/1_slider.svg';
import slider2 from '../assets/2_slider.svg';
import slider3 from '../assets/3_slider.svg';

const PromoBanners: React.FC = () => {
  return (
    <section className="py-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Banner 1 */}
          <div className="rounded-3xl overflow-hidden min-h-[400px]">
            <img 
              src={slider1} 
              alt="Промо баннер 1" 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
          </div>

          {/* Banner 2 */}
          <div className="rounded-3xl overflow-hidden min-h-[400px]">
            <img 
              src={slider2} 
              alt="Промо баннер 2" 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
          </div>

          {/* Banner 3 */}
          <div className="rounded-3xl overflow-hidden min-h-[400px]">
            <img 
              src={slider3} 
              alt="Промо баннер 3" 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
