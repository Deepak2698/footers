import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, Star, ShoppingCart, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { getProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';

const Products: React.FC = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 5000] as [number, number],
    ratings: [] as number[],
    availability: [] as string[],
    sortBy: 'relevance'
  });

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));
  const [limit, setLimit] = useState<number>(parseInt(searchParams.get('limit') || '12', 10));
  const [total, setTotal] = useState<number>(0);

  // products will be fetched from backend

  const [facetCategories, setFacetCategories] = useState<{ name: string; count: number }[]>([]);
  const [facetBrands, setFacetBrands] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    getProducts({ limit: 1, facets: true }).then(res => {
      if (res.facets) {
        setFacetCategories(res.facets.categories || []);
        setFacetBrands(res.facets.brands || []);
      }
    }).catch(() => {});
  }, []);

  // Get current search query
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  // Fetch products from backend when filters/search/page change
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params: any = { page, limit, facets: true };

        if (searchQuery) params.search = searchQuery;
        if (selectedFilters.categories.length > 0) params.category = selectedFilters.categories[0];
        else if (categoryFilter) params.category = categoryFilter.replace(/-/g, ' ');
        if (selectedFilters.brands.length > 0) params.brand = selectedFilters.brands[0];
        if (selectedFilters.priceRange) {
          params.minPrice = selectedFilters.priceRange[0];
          params.maxPrice = selectedFilters.priceRange[1];
        }
        if (selectedFilters.sortBy) {
          switch (selectedFilters.sortBy) {
            case 'price-low':
              params.sort = 'priceAsc';
              break;
            case 'price-high':
              params.sort = 'priceDesc';
              break;
            case 'rating':
              params.sort = 'rating';
              break;
            case 'relevance':
            default:
              params.sort = 'newest';
          }
        }

        const res = await getProducts(params);
        if (!isMounted) return;
        // res.data contains products array, res.pagination contains pagination
        const fetched = res.data || [];
        // Map backend products to frontend shape
        const mapped = fetched.map((p: any) => ({
          id: p._id,
          name: p.title,
          price: p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price,
          originalPrice: p.discountPrice && p.discountPrice < p.price ? p.price : undefined,
          discount: p.discountPrice && p.price ? Math.round((1 - p.discountPrice / p.price) * 100) : undefined,
          image: (p.images && p.images.length > 0) ? p.images[0] : '/assets/VKS_8509.JPG',
          rating: p.rating || 0,
          reviews: p.reviewsCount || 0,
          category: p.category,
          brand: p.brand,
          sizes: p.sizes || [],
          inStock: (typeof p.totalStock === 'number') ? p.totalStock > 0 : true,
        }));

        setProducts(mapped);
        setTotal(res.pagination?.total ?? mapped.length);
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [searchQuery, categoryFilter, selectedFilters, page, limit]);

  // Sort/filtered results now come from backend
  const sortedProducts = products;

  const handleFilterChange = (filterType: string, value: string | number) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType as keyof typeof prev])
        ? (prev[filterType as keyof typeof prev] as string[]).includes(value as string)
          ? (prev[filterType as keyof typeof prev] as string[]).filter(item => item !== value)
          : [...(prev[filterType as keyof typeof prev] as string[]), value as string]
        : value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      priceRange: [0, 5000],
      ratings: [],
      availability: [],
      sortBy: 'relevance'
    });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / limit);

  const productsToDisplay = sortedProducts;

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-black-400 mb-6">
          <Link to="/" className="flex items-center hover:text-gold-500 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <span>/</span>
          <span className="text-black-300">Products</span>
          {categoryFilter && (
            <>
              <span>/</span>
              <span className="text-black-300 capitalize">{categoryFilter.replace(/-/g, ' ')}</span>
            </>
          )}
          {searchQuery && (
            <>
              <span>/</span>
              <span className="text-black-300">Search: "{searchQuery}"</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-luxury text-black-100 mb-2">
              {categoryFilter ? categoryFilter.replace(/-/g, ' ') : 'Products'}
            </h1>
            <p className="text-black-400">
              {total} products found
            </p>
          </div>
          
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <select
              value={selectedFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="reviews">Reviews</option>
              <option value="discount">Discount</option>
            </select>
            
            <div className="flex border border-black-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gold-500 text-black-900' : 'text-black-300'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gold-500 text-black-900' : 'text-black-300'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-outline flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-black-100">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-gold-500 hover:text-gold-400 text-sm"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-black-100 mb-3">Categories</h3>
                <div className="space-y-2">
                  {facetCategories.map((category) => (
                    <label key={category.name} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.categories.includes(category.name)}
                        onChange={() => handleFilterChange('categories', category.name)}
                        className="w-4 h-4 text-gold-500 bg-black-800 border-black-600 rounded focus:ring-gold-500"
                      />
                      <span className="text-black-300 text-sm">{category.name}</span>
                      <span className="text-black-500 text-sm">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium text-black-100 mb-3">Brands</h3>
                <div className="space-y-2">
                  {facetBrands.map((brand) => (
                    <label key={brand.name} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.brands.includes(brand.name)}
                        onChange={() => handleFilterChange('brands', brand.name)}
                        className="w-4 h-4 text-gold-500 bg-black-800 border-black-600 rounded focus:ring-gold-500"
                      />
                      <span className="text-black-300 text-sm">{brand.name}</span>
                      <span className="text-black-500 text-sm">({brand.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-black-100 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-black-400">
                    <span>₹{selectedFilters.priceRange[0]}</span>
                    <span>₹{selectedFilters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={selectedFilters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [selectedFilters.priceRange[0], parseInt(e.target.value)] as any)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="font-medium text-black-100 mb-3">Ratings</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.ratings.includes(rating)}
                        onChange={() => handleFilterChange('ratings', rating)}
                        className="w-4 h-4 text-gold-500 bg-black-800 border-black-600 rounded focus:ring-gold-500"
                      />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-gold-500 fill-current' : 'text-black-600'
                            }`}
                          />
                        ))}
                        <span className="text-black-300 text-sm ml-2">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-medium text-black-100 mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.availability.includes('in-stock')}
                      onChange={() => handleFilterChange('availability', 'in-stock')}
                      className="w-4 h-4 text-gold-500 bg-black-800 border-black-600 rounded focus:ring-gold-500"
                    />
                    <span className="text-black-300 text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.availability.includes('out-of-stock')}
                      onChange={() => handleFilterChange('availability', 'out-of-stock')}
                      className="w-4 h-4 text-gold-500 bg-black-800 border-black-600 rounded focus:ring-gold-500"
                    />
                    <span className="text-black-300 text-sm">Out of Stock</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {productsToDisplay.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-12 h-12 text-gold-500" />
                </div>
                <h3 className="text-xl font-semibold text-black-100 mb-2">
                  No products found
                </h3>
                <p className="text-black-400 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
                {productsToDisplay.map((product) => (
                  <div key={product.id} className={`product-card ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square overflow-hidden'}>
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
                          ({product.reviews.toLocaleString()} reviews)
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
                      <div className="flex space-x-2">
                        <Link 
                          to={`/product/${product.id}`}
                          className="flex-1 btn-primary text-center"
                        >
                          View Details
                        </Link>
                        <button onClick={() => addItem({
                          productId: product.id, title: product.name, price: product.price,
                          originalPrice: product.originalPrice, image: product.image,
                          brand: product.brand, category: product.category,
                          size: product.sizes?.[0]?.size, maxStock: product.sizes?.[0]?.stock || 1, quantity: 1
                        })} className="btn-outline">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 border border-black-600 rounded-lg hover:border-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const showPage = pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1);
                if (!showPage) return null;
                
                return (
                  <React.Fragment key={pageNum}>
                    {pageNum > 1 && pageNum < page - 1 && (
                      <span className="text-black-400">...</span>
                    )}
                    {pageNum > page + 1 && pageNum < totalPages && (
                      <span className="text-black-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-gold-500 text-black-900 font-semibold'
                          : 'border border-black-600 text-black-300 hover:border-gold-500'
                      }`}
                      aria-label={`Page ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                );
              })}
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-black-600 rounded-lg hover:border-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
