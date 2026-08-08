import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="min-h-[70vh] bg-black-900 flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center">
      <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 text-gold-500" />
      </div>
      <h1 className="text-6xl font-luxury text-gold-500 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-black-100 mb-3">Page not found</h2>
      <p className="text-black-400 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <Link to="/products" className="btn-outline inline-flex items-center justify-center gap-2">
          <Search className="w-4 h-4" /> Browse Products
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
