import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, X, Star, Camera, MessageCircle, UserCircle, Phone, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Products', href: '/products' },
    { name: 'Featured', href: '/featured' },
  ];

  return (
    <header className="bg-black-900 border-b border-black-700 sticky top-0 z-50 backdrop-blur-black">
      <div className="container-custom">
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-black-800 bg-black-950 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap py-2 text-sm">
            <div className="inline-flex items-center space-x-8 text-black-400">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-gold-500" />
                <span>footers_01</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <a href="https://wa.me/918087963035" target="_blank" rel="noopener noreferrer" className="text-black-400 hover:text-gold-500 transition-colors">
                  +91 80879 63035
                </a>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <UserCircle className="w-4 h-4 text-gold-500" />
                <Link to="/about" className="text-black-400 hover:text-gold-500 transition-colors">
                  Swapnil Katake
                </Link>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <a href="tel:+919579403248" className="text-black-400 hover:text-gold-500 transition-colors">
                  +91 95794 03248
                </a>
              </div>
              <span>•</span>
              <span>Free shipping on orders above ₹999</span>
              <span>•</span>
              <span>24/7 Customer Support</span>
              <span>•</span>
              <span>Best Quality Products</span>
              <span>•</span>
              <Link to="/track-order" className="text-black-400 hover:text-gold-500 transition-colors">
                Track Order
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/assets/logo.png" 
              alt="Footers" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-2 sm:mx-4 lg:mx-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and more..."
                className="w-full bg-black-800 border border-black-600 text-black-100 px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 rounded-l-lg text-sm sm:text-base focus:border-gold-500 focus:ring-2 focus:ring-gold-500 focus:ring-opacity-20 transition-all duration-200"
              />
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-black-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-black-900 px-4 sm:px-6 py-2 sm:py-3 rounded-r-lg font-semibold text-sm sm:text-base hover:shadow-gold transition-all duration-200"
            >
              Search
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-black-300 hover:text-gold-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <Link to="/wishlist" className="relative p-2 text-black-300 hover:text-gold-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 rounded" aria-label="Wishlist">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-gold-500 text-black-900 text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold" aria-hidden="true">
                0
              </span>
            </Link>
            
            <Link to="/cart" className="relative p-2 text-black-300 hover:text-gold-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 rounded" aria-label={`Shopping cart with ${itemCount} items`}>
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-gold-500 text-black-900 text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold" aria-hidden="true">
                {itemCount}
              </span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to="/admin/dashboard" className="flex items-center space-x-2 p-2 text-black-300 hover:text-gold-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 rounded" aria-label={`Dashboard - ${user.name || 'User'}`}>
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden md:block text-sm sm:text-base">{user.name || 'Dashboard'}</span>
                </Link>
                <button onClick={logout} className="btn-outline p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" aria-label="Logout">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 p-2 text-black-300 hover:text-gold-500 transition-colors">
                <User className="w-6 h-6" />
                <span className="hidden md:block">Sign in</span>
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-black-300 hover:text-gold-500 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="hidden lg:block border-t border-black-800">
          <div className="hidden lg:flex items-center space-x-8 py-4 border-b border-black-800">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="navbar-link"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-1 ml-auto">
            <Star className="w-4 h-4 text-gold-500" />
            <span className="text-gold-500 font-semibold">Today's Deals</span>
          </div>
        </nav>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden py-3 border-t border-black-800">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-black-800 border border-black-600 text-black-100 px-4 py-2 pl-10 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-500 focus:ring-opacity-20 transition-all duration-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 w-4 h-4" />
          </div>
        </form>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black-800 border-t border-black-700">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-2 text-black-300 hover:text-gold-500 hover:bg-black-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
