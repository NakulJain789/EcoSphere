import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EcoAssistant from './components/EcoAssistant';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import Impact from './pages/Impact';
import HowEcoScoreWorks from './pages/HowEcoScoreWorks';
import Compare from './pages/Compare';
import Pitch from './pages/Pitch';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <ErrorBoundary>
                <div className="min-h-screen flex flex-col bg-[#F8F5EF] dark:bg-[#111312] text-[#1C1F1E] dark:text-[#E7E7E7] font-sans transition-colors duration-200">
                  {/* Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 3500,
                      style: {
                        background: '#142A24',
                        color: '#F8F5EF',
                        borderRadius: '16px',
                        fontSize: '12px',
                        border: '1px solid #28584B',
                      },
                    }}
                  />

                  {/* Navigation */}
                  <Navbar />

                  {/* Main Page Routes */}
                  <main className="flex-1">
                    <Routes>
                      {/* Compulsory Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute>
                            <OrderDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/account"
                        element={
                          <ProtectedRoute>
                            <Account />
                          </ProtectedRoute>
                        }
                      />

                      {/* Tier 2 & Tier 3 Bonus / Differentiator Routes */}
                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedRoute>
                            <Wishlist />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/impact" element={<Impact />} />
                      <Route path="/how-ecoscore-works" element={<HowEcoScoreWorks />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/pitch" element={<Pitch />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute adminOnly>
                            <Admin />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 Catch-All */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>

                  {/* Factual Eco Assistant Widget */}
                  <EcoAssistant />

                  {/* Footer */}
                  <Footer />
                </div>
              </ErrorBoundary>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
