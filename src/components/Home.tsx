import React from 'react';
import NavigationMenu from './NavigationMenu';
import PromoBanners from './PromoBanners';
import PopularItems from './PopularItems';
import ProductCatalog from './ProductCatalog';

const Home: React.FC = () => {
  return (
    <>
      <NavigationMenu />
      <PromoBanners />
      <PopularItems />
      <ProductCatalog />
    </>
  );
};

export default Home;


