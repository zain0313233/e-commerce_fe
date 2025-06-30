'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import EcommerceFooter from '@/components/EcommerceFooter';

const SearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'title' // title, price, rating, created_at
  });

  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    filterProducts();
  }, [searchQuery, filters, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      if (response.ok) {
        setProducts(result.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

   
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(query)
        ))
      );
    }

   
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    
    if (filters.brand) {
      filtered = filtered.filter(product => 
        product.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        parseFloat(product.price) >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        parseFloat(product.price) <= parseFloat(filters.maxPrice)
      );
    }

    
    if (filters.minRating) {
      filtered = filtered.filter(product => 
        product.rating && parseFloat(product.rating) >= parseFloat(filters.minRating)
      );
    }

 
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sortBy: 'title'
    });
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    if (!discountPercentage) return null;
    return (parseFloat(price) * (1 - parseFloat(discountPercentage) / 100)).toFixed(2);
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return stars;
  };

  return (
  <>
  <Navbar/>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Products</h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, description, category, brand, or tags..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  placeholder="Enter category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  placeholder="Enter brand"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="1">1+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="title">Name (A-Z)</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="created_at">Newest First</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl text-gray-600">Loading products...</div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            ${product.discount_percentage ? 
                              calculateDiscountedPrice(product.price, product.discount_percentage) : 
                              parseFloat(product.price).toFixed(2)
                            }
                          </span>
                          {product.discount_percentage && (
                            <span className="text-sm text-gray-500 line-through">
                              ${parseFloat(product.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.discount_percentage && (
                          <span className="text-xs text-red-600 font-medium">
                            {product.discount_percentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {product.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {renderStars(product.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      {product.category && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {product.category}
                        </span>
                      )}
                      {product.brand && (
                        <span className="font-medium">{product.brand}</span>
                      )}
                    </div>

                    {product.stock_quantity !== undefined && (
                      <div className="mb-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.stock_quantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock_quantity > 0 
                            ? `${product.stock_quantity} in stock` 
                            : 'Out of stock'
                          }
                        </span>
                      </div>
                    )}

                    {product.tags && product.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{product.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        href={`/Products/${product.id}`}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/Products/Edit/${product.id}`}
                        className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">
                  {searchQuery || Object.values(filters).some(f => f) 
                    ? 'No products found matching your criteria' 
                    : 'No products available'
                  }
                </div>
                {(searchQuery || Object.values(filters).some(f => f)) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Clear Search & Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    <EcommerceFooter/>
  </>
  );
}
export default SearchProducts; 
