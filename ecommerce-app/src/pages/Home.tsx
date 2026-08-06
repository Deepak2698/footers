import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Sparkles, TrendingUp, Clock, Award, ChevronRight } from 'lucide-react';
import { getProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';

const Home: React.FC = () => {
  const [heroProducts, setHeroProducts] = useState<any[]>([]);
  const { addItem } = useCart();
  const [categories, setCategories] = useState<any[]>([]);

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      setLoadingFeatured(true);
      setFeaturedError(null);
      try {
        const res = await getProducts({ featured: true, limit: 16, facets: true });
        if (!isMounted) return;
        const fetched = res.data || [];
        if (res.facets?.categories) {
          setCategories(res.facets.categories.slice(0, 8).map((c: any, i: number) => ({
            name: c.name, productCount: c.count,
            image: ['/assets/VKS_8509.JPG','/assets/VKS_8551.JPG','/assets/VKS_8484.JPG','/assets/VKS_8488.JPG','/assets/VKS_8489.JPG','/assets/VKS_8494.JPG','/assets/VKS_8541.JPG','/assets/VKS_8557.JPG'][i % 8]
          })));
        }
        const mapped = fetched.map((p: any) => ({
          id: p._id,
          name: p.title,
          price: p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price,
          originalPrice: p.discountPrice && p.discountPrice < p.price ? p.price : undefined,
          discount: p.discountPrice && p.price ? Math.round((1 - p.discountPrice / p.price) * 100) : undefined,
          image: (p.images && p.images.length > 0) ? p.images[0] : '/assets/VKS_8509.JPG',
          rating: p.rating || 0,
          reviews: p.reviewsCount || 0,
          brand: p.brand, category: p.category, sizes: p.sizes || [],
          createdAt: p.createdAt
        }));

        // Distribute products across sections
        setHeroProducts(mapped.slice(0, 2));
        setFeaturedProducts(mapped.slice(2, 6));
        setNewArrivals(mapped.slice(6, 10));
        setBestSellers(mapped.slice(10, 13));
        setTrendingProducts(mapped.slice(13, 16));
      } catch (err: any) {
        setFeaturedError(err?.response?.data?.message || err.message || 'Failed to load featured products');
      } finally {
        setLoadingFeatured(false);
      }
    }

    loadFeatured();
    return () => { isMounted = false; };
  }, []);

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹999',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Authentic products only',
    },
  ];

  return (
    <div className="min-h-screen bg-black-900">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient overflow-hidden">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-luxury text-black-100 leading-tight">
                  Discover <span className="text-gradient">Luxury</span> Shopping
                </h1>
                <p className="text-xl text-black-400 leading-relaxed">
                  Experience premium products from top brands worldwide. 
                  Exclusive deals, fast delivery, and exceptional service.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn-primary text-center">
                  Shop Now
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Link>
                <Link to="/deals" className="btn-outline text-center">
                  Today's Deals
                </Link>
              </div>

              <div className="flex items-center space-x-8">
                <div>
                  <div className="text-3xl font-bold text-gold-500">500+</div>
                  <div className="text-black-400">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold-500">10K+</div>
                  <div className="text-black-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold-500">4.8★</div>
                  <div className="text-black-400">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {heroProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`relative group ${index === 1 ? 'lg:mt-8' : ''}`}
                  >
                    <div className="card overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-black-100 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-gold-500 fill-current" />
                            <span className="text-sm text-black-300 ml-1">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-black-600">•</span>
                          <span className="text-sm text-black-400">
                            {product.reviews.toLocaleString()} reviews
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xl font-bold text-gold-500">
                              ₹{product.price.toLocaleString()}
                            </div>
                            {product.originalPrice && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-black-500 line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-red-500 font-semibold">
                                  {product.discount}% off
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-luxury text-black-100 mb-4">
              Shop by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-xl text-black-400">
              Explore our wide range of premium footwear
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="card overflow-hidden text-center">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-black-100 mb-1 text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-black-400">
                      {category.productCount.toLocaleString()} products
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-black-950">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-luxury text-black-100 mb-4">
                Featured <span className="text-gradient">Products</span>
              </h2>
              <p className="text-xl text-black-400">
                Handpicked premium items just for you
              </p>
            </div>
            <Link to="/products" className="btn-outline">
              View All
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="py-12 text-center text-black-400">Loading featured products...</div>
          ) : featuredError ? (
            <div className="py-12 text-center text-red-500">{featuredError}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-black-100 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-gold-500 fill-current" />
                        <span className="text-sm text-black-300 ml-1">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-black-600">•</span>
                      <span className="text-sm text-black-400">
                        {product.reviews.toLocaleString()} reviews
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xl font-bold text-gold-500">
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-black-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-red-500 font-semibold">
                              {product.discount}% off
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => addItem({
                      productId: product.id, title: product.name, price: product.price,
                      originalPrice: product.originalPrice, image: product.image,
                      brand: product.brand, category: product.category,
                      size: product.sizes?.[0]?.size, maxStock: product.sizes?.[0]?.stock || 1, quantity: 1
                    })} className="w-full btn-primary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-gold-500" />
              <div>
                <h2 className="text-4xl font-luxury text-black-100 mb-2">
                  New <span className="text-gradient">Arrivals</span>
                </h2>
                <p className="text-xl text-black-400">
                  Fresh styles just landed
                </p>
              </div>
            </div>
            <Link to="/products?sort=newest" className="btn-outline">
              View All
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="product-card">
                <div className="aspect-square overflow-hidden relative">
                  <div className="absolute top-2 left-2 bg-gold-500 text-black-900 px-2 py-1 rounded text-xs font-semibold">
                    NEW
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-black-100 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-gold-500">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>
                  <button onClick={() => addItem({
                    productId: product.id, title: product.name, price: product.price,
                    originalPrice: product.originalPrice, image: product.image,
                    brand: product.brand, category: product.category,
                    size: product.sizes?.[0]?.size, maxStock: product.sizes?.[0]?.stock || 1, quantity: 1
                  })} className="w-full btn-primary">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-black-950">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-gold-500" />
              <div>
                <h2 className="text-4xl font-luxury text-black-100 mb-2">
                  Best <span className="text-gradient">Sellers</span>
                </h2>
                <p className="text-xl text-black-400">
                  Most loved by our customers
                </p>
              </div>
            </div>
            <Link to="/products?sort=bestsellers" className="btn-outline">
              View All
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="product-card">
                <div className="aspect-square overflow-hidden relative">
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    TOP SELLER
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-black-100 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-gold-500 fill-current" />
                      <span className="text-sm text-black-300 ml-1">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-black-600">•</span>
                    <span className="text-sm text-black-400">
                      {product.reviews.toLocaleString()} reviews
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-gold-500">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>
                  <button onClick={() => addItem({
                    productId: product.id, title: product.name, price: product.price,
                    originalPrice: product.originalPrice, image: product.image,
                    brand: product.brand, category: product.category,
                    size: product.sizes?.[0]?.size, maxStock: product.sizes?.[0]?.stock || 1, quantity: 1
                  })} className="w-full btn-primary">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-gold-500" />
              <div>
                <h2 className="text-4xl font-luxury text-black-100 mb-2">
                  Trending <span className="text-gradient">Now</span>
                </h2>
                <p className="text-xl text-black-400">
                  Hot styles everyone's talking about
                </p>
              </div>
            </div>
            <Link to="/products?sort=trending" className="btn-outline">
              View All
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="aspect-square overflow-hidden relative">
                  <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    TRENDING
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-black-100 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-gold-500">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>
                  <button onClick={() => addItem({
                    productId: product.id, title: product.name, price: product.price,
                    originalPrice: product.originalPrice, image: product.image,
                    brand: product.brand, category: product.category,
                    size: product.sizes?.[0]?.size, maxStock: product.sizes?.[0]?.stock || 1, quantity: 1
                  })} className="w-full btn-primary">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-luxury text-black-100 mb-4">
              Why Choose <span className="text-gradient">Footers</span>
            </h2>
            <p className="text-xl text-black-400">
              We provide the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-xl font-semibold text-black-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-black-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gold-500 to-gold-600 py-16">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-luxury text-black-900 mb-4">
            Get Exclusive Deals & Offers
          </h2>
          <p className="text-xl text-black-800 mb-8">
            Subscribe to our newsletter and never miss a deal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-black-900/20 border border-black-700/50 text-black-900 placeholder-black-700 focus:outline-none focus:border-black-900 focus:bg-black-900/30 transition-all duration-200"
            />
            <button className="btn-primary bg-black-900 text-gold-500 hover:bg-black-800">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
