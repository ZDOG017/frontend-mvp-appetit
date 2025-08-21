import React from 'react'
import Header from './components/Header'
import NavigationMenu from './components/NavigationMenu'
import PromoBanners from './components/PromoBanners'
import PopularItems from './components/PopularItems'
import ProductCatalog from './components/ProductCatalog'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <NavigationMenu />
      <PromoBanners />
      <PopularItems />
      <ProductCatalog />
    </div>
  )
}

export default App
