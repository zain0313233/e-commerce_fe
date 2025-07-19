'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import SearchProducts from './searchProduct/page';
import Navbar from '@/components/Navbar';
import EcommerceFooter from '@/components/EcommerceFooter';
import axios from 'axios';

const ProductsPage = () => {
  const { user,token } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('my-products'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    
     if (user && user.id) {
      fetchProducts();
    } else if (user === null) {
     
      setLoading(false);
      setError('Please log in to view your products');
    }
    
  }, [user]);

  const fetchProducts = async () => {
  setLoading(true);
  setError('');
  
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/product/user-products`;
    const response = await axios.get(`${url}/${user.id}`,
       {
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token || ''}`
        },
       }
    );
    
    if (response.status === 200) {
      setProducts(response.data.data.map((product) => ({
         ...product,
         tags: Array.isArray(product.tags)
           ? product.tags
           : typeof product.tags === "string"
           ? product.tags.split(",").map((t) => t.trim())
           : [],
       }))); 
      setTotalPages(Math.ceil((response.data.total || 0) / productsPerPage));
    } else {
      setError(response.data.message || 'Failed to fetch products');
    }
  } catch (err) {
    setError('An error occurred while fetching products');
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
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

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/delete/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== productId));
        alert('Product deleted successfully!');
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('An error occurred while deleting the product');
      console.error('Error:', err);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  if (view === 'search') {
    return <SearchProducts />;
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            {view === 'my-products' ? 'My Products' : 'All Products'}
          </h1>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex bg-white rounded-lg shadow border">
             <button
                onClick={() => setView('search')}
                className={`px-4 py-2 text-sm font-medium ${
                  view === 'search' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Search Your Products
              </button>
              {user && (
                <button
                  onClick={() => setView('my-products')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    view === 'my-products' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  My Products
                </button>
              )}
            </div>

            {user && (
              <Link
                href="/Products/Addproduct"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
              >
                Add Product
              </Link>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl text-gray-600">Loading products...</div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
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
                        
                        {view === 'my-products' && user && product.user_id === user.id && (
                          <>
                            <Link
                              href={`/Products/Edit/${product.id}`}
                              className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 text-lg">
                    {view === 'my-products' 
                      ? "You haven't added any products yet" 
                      : 'No products available'
                    }
                  </div>
                  {view === 'my-products' && user && (
                    <Link
                      href="/Products/Add"
                      className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add Your First Product
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
    <EcommerceFooter/>
    </>
  );
};

export default ProductsPage;