import React from 'react'
import Header from './components/Header'
import NavigationMenu from './components/NavigationMenu'
import PromoBanners from './components/PromoBanners'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <NavigationMenu />
      <PromoBanners />
    </div>
  )
}

export default App
