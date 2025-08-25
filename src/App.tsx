import React from 'react'
import Header from './components/Header'
import NavigationMenu from './components/NavigationMenu'
import PromoBanners from './components/PromoBanners'
import PopularItems from './components/PopularItems'
import ProductCatalog from './components/ProductCatalog'
import Footer from './components/Footer'
import CartModal from './components/CartModal'
import { CartProvider } from './context/CartContext'

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <NavigationMenu />
        <PromoBanners />
        <PopularItems />
        <ProductCatalog />
        <Footer />
        <CartModal />
      </div>
    </CartProvider>
  )
}

export default App
