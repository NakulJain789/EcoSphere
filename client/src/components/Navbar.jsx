import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Compass,
  Award,
  Layers,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F5EF]/90 dark:bg-[#111312]/90 border-b border-sage-200/80 dark:border-charcoal-800 glass-nav transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-forest-900 text-cream-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3">
        <span>🌱 Free plastic-free carbon-neutral delivery on all orders over ₹999</span>
        <Link
          to="/how-ecoscore-works"
          className="underline hover:text-amber-accent hidden sm:inline"
        >
          See Our Eco Methodology
        </Link>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="font-serif text-2xl font-bold tracking-tighter">E</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-forest-950 dark:text-cream-50">
                  EcoSphere
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-sage-600 dark:text-sage-400">
                  Shop Better
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/products"
                className="text-charcoal-700 dark:text-charcoal-200 hover:text-forest-700 dark:hover:text-cream-50 transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/products?minEcoScore=80"
                className="inline-flex items-center gap-1 text-forest-700 dark:text-sage-300 hover:text-forest-900 dark:hover:text-cream-50 transition-colors font-semibold"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-forest-600"></span>
                EcoScore 80+
              </Link>
              <Link
                to="/compare"
                className="text-charcoal-700 dark:text-charcoal-200 hover:text-forest-700 dark:hover:text-cream-50 transition-colors"
              >
                Compare
              </Link>
              <Link
                to="/impact"
                className="text-charcoal-700 dark:text-charcoal-200 hover:text-forest-700 dark:hover:text-cream-50 transition-colors"
              >
                My Impact
              </Link>
              <Link
                to="/pitch"
                className="text-amber-accent hover:text-amber-accentDark font-semibold transition-colors hidden lg:inline"
              >
                Pitch & Deck
              </Link>
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search zero-waste products..."
                className="w-full text-xs py-2 pl-9 pr-4 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white/70 dark:bg-charcoal-900/70 text-charcoal-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
              />
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-sage-200/50 dark:hover:bg-charcoal-800 transition"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-accent" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2.5 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-sage-200/50 dark:hover:bg-charcoal-800 transition"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-forest-700 text-cream-50 text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative p-2.5 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-sage-200/50 dark:hover:bg-charcoal-800 transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-sage-200 dark:border-charcoal-700 hover:bg-sage-100 dark:hover:bg-charcoal-800 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-800 text-cream-50 text-xs font-semibold flex items-center justify-center">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-medium max-w-[90px] truncate hidden sm:inline text-charcoal-800 dark:text-cream-100">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xl border border-sage-200 dark:border-charcoal-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-sage-100 dark:border-charcoal-800">
                      <p className="text-xs font-semibold text-charcoal-900 dark:text-cream-50 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-forest-700 dark:text-sage-400">
                        <span>🌱 Tier: {user.ecoJourneyStage || 'Seed'}</span>
                        <span>•</span>
                        <span>{user.ecoPoints || 0} pts</span>
                      </div>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-charcoal-700 dark:text-charcoal-200 hover:bg-sage-100 dark:hover:bg-charcoal-800"
                    >
                      <ShoppingBag className="w-4 h-4 text-forest-700" />
                      My Orders
                    </Link>

                    <Link
                      to="/impact"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-charcoal-700 dark:text-charcoal-200 hover:bg-sage-100 dark:hover:bg-charcoal-800"
                    >
                      <Award className="w-4 h-4 text-forest-700" />
                      My Impact & Challenges
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-accent hover:bg-sage-100 dark:hover:bg-charcoal-800 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-accent" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-sage-100 dark:border-charcoal-800 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-forest-800 hover:bg-forest-900 text-cream-50 transition shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-charcoal-700 dark:text-charcoal-300 hover:bg-sage-200/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full text-xs py-2 pl-9 pr-4 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 focus:outline-none"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sage-200 dark:border-charcoal-800 bg-[#F8F5EF] dark:bg-[#111312] px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-charcoal-800 dark:text-cream-100"
          >
            All Products
          </Link>
          <Link
            to="/products?minEcoScore=80"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-forest-700 dark:text-sage-300 font-semibold"
          >
            EcoScore 80+ Catalog
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-charcoal-800 dark:text-cream-100"
          >
            Product Comparison
          </Link>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-charcoal-800 dark:text-cream-100"
          >
            My Impact & Challenges
          </Link>
          <Link
            to="/how-ecoscore-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-charcoal-800 dark:text-cream-100"
          >
            How EcoScore Works
          </Link>
          <Link
            to="/pitch"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold py-2 text-amber-accent"
          >
            Judge Presentation Pitch
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold py-2 text-amber-accent"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
