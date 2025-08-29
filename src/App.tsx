import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CartModal from './components/CartModal'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import { ToastProvider } from './context/ToastContext'
import AdminPanel from './components/AdminPanel'
import Home from './components/Home'
import ProductMenu from './components/ProductMenu'
import OrderTracking from './components/OrderTracking'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white">
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/menu" element={<ProductMenu />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
              </Routes>
              <Footer />
              <CartModal />
              <AuthModal />
            </BrowserRouter>
          </div>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
