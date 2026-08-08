import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { getProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/format';

const Featured: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const res = await getProducts({ featured: true, limit: 12, facets: true });
        setProducts((res.data || []).map((p: any) => ({
          id: p._id, name: p.title,
          price: p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price,
          originalPrice: p.discountPrice && p.discountPrice < p.price ? p.price : undefined,
          discount: p.discountPrice && p.price ? Math.round((1 - p.discountPrice / p.price) * 100) : undefined,
          image: p.images?.[0] || '/assets/VKS_8509.JPG',
          rating: p.rating || 0, reviews: p.reviewsCount || 0,
          brand: p.brand, category: p.category, sizes: p.sizes || []
        })));
        setCategories(res.facets?.categories || []);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const handleAdd = (p: any) => {
    const size = p.sizes?.[0]?.size;
    addItem({
      productId: p.id, title: p.name, price: p.price, originalPrice: p.originalPrice,
      image: p.image, brand: p.brand, category: p.category,
      size, maxStock: p.sizes?.[0]?.stock || 1, quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding">
        <h1 className="text-4xl font-luxury text-black-100 mb-2">Featured Collection</h1>
        <p className="text-black-400 mb-8">Handpicked footwear from our catalog</p>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(c => (
              <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`} className="px-4 py-2 bg-black-800 text-black-300 rounded-lg hover:text-gold-500">
                {c.name} ({c.count})
              </Link>
            ))}
          </div>
        )}

        {loading ? <p className="text-black-400">Loading...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="product-card">
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${p.id}`}><h3 className="font-semibold text-black-100 mb-2">{p.name}</h3></Link>
                  <div className="flex items-center gap-1 mb-2"><Star className="w-4 h-4 text-gold-500 fill-current" /><span className="text-sm text-black-300">{p.rating}</span></div>
                  <div className="text-xl font-bold text-gold-500 mb-3">{formatCurrency(p.price)}</div>
                  <button onClick={() => handleAdd(p)} className="w-full btn-primary flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Featured;
