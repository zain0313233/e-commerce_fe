"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import EcommerceFooter from '@/components/EcommerceFooter'
import axios from "axios";
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import ProductPopup from "@/components/productpopup";

const MenProducts = () => {
  const [isdata, setisdata] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useUser()
  const router = useRouter();
  const categoryName = "men";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products for category:', categoryName);
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/get-by-category/${categoryName}`, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Response received:', response);
      
      if (!response || !response.data) {
        throw new Error("No data received from server");
      }
      
      if (!response.data.success) {
        throw new Error(response.data.message || "API request failed");
      }
      
      const fetchedProducts = response.data.data.map((product)=>({
        ...product,
        tags:Array.isArray(product.tags) ? product.tags : typeof product.tags === 'string' ? product.tags.split(",").map((t) => t.trim()) : [],
      }));
      console.log('Products fetched:', fetchedProducts.length);
      
      setProducts(fetchedProducts);
      setisdata(true);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      
      let errorMessage = "Failed to fetch products";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout - please check your connection";
      } else if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        errorMessage = "Cannot connect to server - please check if the server is running";
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setisdata(false);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Only fetch if we have the necessary environment variable
    if (process.env.NEXT_PUBLIC_API_URL) {
      fetchProducts();
    } else {
      setError("API URL not configured");
      setLoading(false);
    }
  }, [user, token])

  const addtoCart = async (selectedproductId) => {
    try {
      if (!user || !user.id) {
        alert("Please log in to add items to cart");
        return;
      }
      
      if (!selectedproductId) {
        console.error("Product ID is not selected.");
        alert("Product ID is missing!");
        return;
      }
      
      const cartData = {
        user_id: user.id,
        product_id: selectedproductId,
        quantity: 1,
      };
      
      const cartResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add-to-cart`, cartData, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 5000
      });
      
      if (cartResponse.status === 200) {
        console.log("Added to cart successfully:", cartResponse.data);
        alert("Product added to cart successfully!");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      let errorMessage = "Failed to add product to cart!";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
        <EcommerceFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl text-red-300 mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Products</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
        <EcommerceFooter />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
      
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Men's Products</h1>
            <p className="text-gray-600">Discover our collection of men's products</p>
          </div>

          {isdata && products.length > 0 ? (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="text-sm font-medium text-gray-600 mb-6">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <div
                    key={product.id || i}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group"
                  >
                   
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image_url || "/api/placeholder/200/200"}
                        alt={product.brand || product.title || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <div className="text-4xl text-gray-400">📦</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 text-base line-clamp-2">
                        {product.title || product.brand || 'Product Name'}
                      </h4>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-gray-900">
                          ${product.price}
                        </p>
                        <div className="text-sm text-gray-500">
                          Stock: {product.stock_quantity || 0}
                        </div>
                      </div>

                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{product.tags.length - 3} more</span>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => {
                            setShowProductPopup(true);
                            setSelectedProductId(product.id);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => { addtoCart(product.id) }}
                          disabled={product.stock_quantity === 0}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-300 mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any men's products at the moment.</p>
              <button
                onClick={fetchProducts}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Refresh Products
              </button>
            </div>
          )}
        </div>
      </div>

      {showProductPopup && (
        <ProductPopup
          selectedproductId={selectedProductId}
          setShowProductPopup={setShowProductPopup}
        />
      )}
      
      <EcommerceFooter />
    </>
  )
}

export default MenProducts