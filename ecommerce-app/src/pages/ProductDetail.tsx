import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Truck, Shield, RefreshCw,
  Plus, Minus, Award, CheckCircle, Share
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../services/productService';
import ImageZoom from '../components/ImageZoom';
import { formatCurrency } from '../utils/format';
import { useToast } from '../components/Toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [addedMsg, setAddedMsg] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { getProductById } = await import('../services/productService');
        const res = await getProductById(id);
        if (!mounted) return;
        if (!res || !res.data) {
          setError('Product not found');
          setProduct(null);
        } else {
          const p = res.data;
          // Map backend product to frontend product shape
          const mapped = {
            id: p._id,
            name: p.title,
            description: p.description,
            images: p.images && p.images.length > 0 ? p.images : ['/assets/VKS_8509.JPG'],
            price: p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price,
            originalPrice: p.discountPrice && p.discountPrice < p.price ? p.price : undefined,
            discount: p.discountPrice && p.price ? Math.round((1 - (p.discountPrice / p.price)) * 100) : undefined,
            category: p.category,
            subcategory: p.subcategory || '',
            brand: p.brand,
            rating: p.rating || 0,
            reviews: p.reviewsCount || 0,
            specifications: p.specifications || [],
            faqs: p.faqs || [],
            sizes: p.sizes || [],
            stock: typeof p.totalStock === 'number' ? p.totalStock : (p.sizes ? p.sizes.reduce((s:any, x:any) => s + (x.stock||0),0) : 0),
            availability: (typeof p.totalStock === 'number' ? p.totalStock > 0 : true) ? 'in-stock' : 'out-of-stock',
            deliveryEstimate: p.deliveryEstimate || '3-5 business days',
            tags: p.tags || [],
            seller: p.seller || { id: '', name: 'Footers', logo: '/assets/logo.png', rating: 4.8, totalSales: 1000, responseTime: '2 hours' },
            productCode: p._id?.slice(-8).toUpperCase() || 'N/A'
          };
          setProduct(mapped);
          
          // Add to recently viewed
          const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const updated = [mapped, ...recentlyViewed.filter((item: any) => item.id !== mapped.id)].slice(0, 6);
          localStorage.setItem('recentlyViewed', JSON.stringify(updated));
          setRecentlyViewed(updated);
          
          if (p.category) {
            getProducts({ category: p.category, limit: 4 }).then(r => {
              if (!mounted) return;
              setRelatedProducts((r.data || []).filter((x: any) => x._id !== p._id).slice(0, 4).map((x: any) => ({
                id: x._id, name: x.title,
                price: x.discountPrice && x.discountPrice < x.price ? x.discountPrice : x.price,
                originalPrice: x.discountPrice && x.discountPrice < x.price ? x.price : undefined,
                discount: x.discountPrice && x.price ? Math.round((1 - x.discountPrice / x.price) * 100) : undefined,
                image: x.images?.[0] || '/assets/VKS_8509.JPG', rating: x.rating || 0, reviews: x.reviewsCount || 0,
                sizes: x.sizes || [], brand: x.brand, category: x.category
              })));
            });
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleAddToCart = (goToCart = false) => {
    if (!product) return;
    if (product.sizes?.length && !selectedSize) { showToast('Please select a size', 'error'); return; }
    const sizeObj = product.sizes?.find((s: any) => s.size === selectedSize);
    const maxStock = sizeObj ? sizeObj.stock : product.stock;
    if (maxStock < 1) { showToast('Out of stock', 'error'); return; }
    if (quantity > maxStock) { showToast(`Only ${maxStock} items available`, 'error'); return; }
    addItem({
      productId: product.id, title: product.name, price: product.price,
      originalPrice: product.originalPrice, image: product.images[0],
      brand: product.brand, category: product.category,
      size: selectedSize || undefined, maxStock, quantity
    });
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2000);
    if (goToCart) navigate('/cart');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Footers!`,
          url: window.location.href
        });
      } catch (err) {
        // User dismissed the native share sheet — not an error worth surfacing.
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement actual wishlist functionality
    setAddedMsg(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    setTimeout(() => setAddedMsg(''), 2000);
  };

  const handleRelatedAdd = (rp: any) => {
    const size = rp.sizes?.[0]?.size;
    const maxStock = rp.sizes?.[0]?.stock || 1;
    addItem({
      productId: rp.id, title: rp.name, price: rp.price,
      originalPrice: rp.originalPrice, image: rp.image,
      brand: rp.brand, category: rp.category,
      size, maxStock, quantity: 1
    });
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2000);
  };

  const reviews = [
    {
      id: '1',
      userId: '1',
      userName: 'Rajesh Kumar',
      rating: 5,
      title: 'Excellent craftsmanship!',
      content: 'The leather quality is outstanding and the fit is perfect. These chappals are exactly what I expected from traditional Kolhapuri footwear.',
      images: ['/assets/VKS_8509.JPG'],
      helpful: 234,
      verified: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      userId: '2',
      userName: 'Priya Sharma',
      rating: 4,
      title: 'Great quality, minor sizing issue',
      content: 'Beautiful craftsmanship and genuine leather. Had to go one size up from my usual size, but otherwise very happy with the purchase.',
      helpful: 89,
      verified: true,
      createdAt: '2024-01-10',
    },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
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
      icon: Award,
      title: 'Warranty',
      description: '2-year manufacturer warranty',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black-900">
        <div className="container-custom section-padding text-center py-20">
          <div className="text-lg text-black-300">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black-900">
        <div className="container-custom section-padding text-center py-20">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-black-400 mb-8">
          <Link to="/" className="hover:text-gold-500">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gold-500">Products</Link>
          <span>/</span>
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-gold-500">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-black-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-black-800 group">
              <ImageZoom
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? 'border-gold-500 ring-2 ring-gold-500/20'
                      : 'border-black-600 hover:border-gold-400'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl lg:text-4xl font-luxury text-black-100">
                  {product.name}
                </h1>
                <button
                  onClick={handleWishlist}
                  className="p-2 rounded-lg border border-black-600 hover:border-gold-500 hover:text-gold-500 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-gold-500 text-gold-500' : ''}`} />
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <span className="text-black-400">Brand: <span className="text-black-200 font-medium">{product.brand}</span></span>
                <span className="text-black-600">•</span>
                <span className="text-black-400">Category: <span className="text-black-200 font-medium">{product.category}</span></span>
                <span className="text-black-600">•</span>
                <span className="text-black-400">Code: <span className="text-black-200 font-medium">{product.productCode}</span></span>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-gold-500 fill-current" />
                  <span className="text-lg font-semibold text-black-100 ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-black-400 ml-2">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.availability === 'in-stock' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {product.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                </div>
                {product.stock > 0 && product.stock <= 10 && (
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-500">
                    Only {product.stock} left!
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-3xl font-bold text-gold-500">
                  {formatCurrency(product.price)}
                </div>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-black-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="text-lg text-red-500 font-semibold">
                      {product.discount}% off
                    </span>
                  </>
                )}
              </div>

              <p className="text-black-400 leading-relaxed mb-4">
                {product.description}
              </p>
              
              {/* Delivery Info */}
              <div className="flex items-center space-x-2 text-sm text-black-400 mb-4">
                <Truck className="w-4 h-4 text-gold-500" />
                <span>Estimated delivery: <span className="text-black-200 font-medium">{product.deliveryEstimate}</span></span>
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-black-300 mb-2">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s: any) => {
                      const isAvailable = s.stock > 0;
                      return (
                        <button
                          key={s.size}
                          onClick={() => isAvailable && setSelectedSize(s.size)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            selectedSize === s.size
                              ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                              : isAvailable
                              ? 'border-black-600 text-black-300 hover:border-gold-400'
                              : 'border-black-700 text-black-600 cursor-not-allowed opacity-50'
                          }`}
                          aria-label={`Select size ${s.size}${!isAvailable ? ' (out of stock)' : ''}`}
                        >
                          {s.size}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSize && (
                    <p className="text-xs text-black-400 mt-2">
                      Selected: {selectedSize} ({product.sizes.find((s: any) => s.size === selectedSize)?.stock} available)
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-black-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-black-600 rounded-lg hover:border-gold-500 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-black-300" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                    className="w-20 text-center bg-black-800 border border-black-600 text-black-100 px-3 py-2 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-500 focus:ring-opacity-20"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 border border-black-600 rounded-lg hover:border-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-black-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => handleAddToCart(false)} 
                disabled={product.availability !== 'in-stock'}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Add to Cart
              </button>
              <button 
                onClick={() => handleAddToCart(true)} 
                disabled={product.availability !== 'in-stock'}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={handleShare}
                className="btn-outline"
                aria-label="Share product"
              >
                <Share className="w-5 h-5" />
              </button>
            </div>
            {addedMsg && (
              <div className="text-center text-green-500 text-sm font-medium animate-pulse">
                {addedMsg}
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black-300">
                      {feature.title}
                    </div>
                    <div className="text-xs text-black-500">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller Info */}
            <div className="border border-black-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.seller.logo}
                    alt={product.seller.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <div className="font-semibold text-black-100">
                      {product.seller.name}
                    </div>
                    <div className="text-sm text-black-400">
                      {product.seller.totalSales.toLocaleString()} sales
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-gold-500 fill-current" />
                    <span className="text-sm text-black-300 ml-1">
                      {product.seller.rating}
                    </span>
                  </div>
                  <div className="text-xs text-black-500">
                    Response: {product.seller.responseTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b border-black-700">
            <div className="flex space-x-8">
              {['Description', 'Specifications', 'Reviews', 'FAQs'].map((tab) => (
                <button
                  key={tab}
                  className="py-4 px-2 border-b-2 font-medium text-sm transition-colors border-gold-500 text-gold-500"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.specifications.map((spec: any, index: number) => (
                <div key={index} className="flex justify-between py-3 border-b border-black-800">
                  <span className="text-black-400">{spec.name}</span>
                  <span className="text-black-200 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-luxury text-black-100 mb-8">
            Customer Reviews
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="card p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold-500 mb-2">
                  {product.rating}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-gold-500 fill-current'
                          : 'text-black-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-black-400">
                  {product.reviews.toLocaleString()} reviews
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm text-black-400 w-3">{rating}</span>
                    <Star className="w-4 h-4 text-gold-500 fill-current" />
                    <div className="flex-1 bg-black-800 rounded-full h-2">
                      <div
                        className="bg-gold-500 h-2 rounded-full"
                        style={{
                          width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-black-400 w-8">
                      {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                          <span className="text-gold-500 font-semibold">
                            {review.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-black-100">
                            {review.userName}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-gold-500 fill-current'
                                      : 'text-black-600'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.verified && (
                              <div className="flex items-center text-green-500 text-sm">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-black-500 mt-1">
                        {review.createdAt}
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-black-100 mb-2">
                    {review.title}
                  </h4>
                  <p className="text-black-400 mb-4">
                    {review.content}
                  </p>
                  
                  {review.images && (
                    <div className="flex space-x-2 mb-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review ${index + 1} by ${review.userName}`}
                          loading="lazy"
                          decoding="async"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-black-400 hover:text-gold-500 transition-colors">
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="text-black-400 hover:text-gold-500 transition-colors">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-16">
          <h2 className="text-2xl font-luxury text-black-100 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="product-card">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-black-100 mb-2 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-gold-500 fill-current" />
                      <span className="text-sm text-black-300 ml-1">
                        {relatedProduct.rating}
                      </span>
                    </div>
                    <span className="text-black-600">•</span>
                    <span className="text-sm text-black-400">
                      {relatedProduct.reviews.toLocaleString()} reviews
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xl font-bold text-gold-500">
                        {formatCurrency(relatedProduct.price)}
                      </div>
                      {relatedProduct.originalPrice && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-black-500 line-through">
                            {formatCurrency(relatedProduct.originalPrice)}
                          </span>
                          <span className="text-sm text-red-500 font-semibold">
                            {relatedProduct.discount}% off
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleRelatedAdd(relatedProduct)} className="w-full btn-primary">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 1 && (
          <div>
            <h2 className="text-2xl font-luxury text-black-100 mb-8">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed.slice(1, 7).map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group"
                >
                  <div className="product-card">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-black-100 mb-1 line-clamp-1 text-sm">
                        {item.name}
                      </h3>
                      <div className="text-gold-500 font-bold text-sm">
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
