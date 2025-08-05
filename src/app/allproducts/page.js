"use client"
import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import EcommerceFooter from '@/components/EcommerceFooter'
import axios from "axios";
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import ProductPopup from "../../components/productpopup";
import { productCache } from "../utils/cache";

const hiddenStyle = { display: 'none' };

const ProductCard = memo(({ 
  product, 
  onBuyNow, 
  onAddToCart,
  index 
}) => {
  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  }, []);

  const handleBuyClick = useCallback(() => {
    onBuyNow(product.id);
  }, [product.id, onBuyNow]);

  const handleAddToCartClick = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);

  const tagsDisplay = useMemo(() => {
    if (!product.tags || product.tags.length === 0) return null;
    
    return (
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
    );
  }, [product.tags]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
        <img
          src={product.image_url || "/api/placeholder/200/200"}
          alt={product.brand || 'Product'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center" style={hiddenStyle}>
          <div className="text-4xl text-gray-400">📦</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 text-base line-clamp-2">
          {product.brand || 'Product Name'}
        </h4>
        
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">
            ${product.price}
          </p>
          <div className="text-sm text-gray-500">
            Stock: {product.stock_quantity || 0}
          </div>
        </div>

        {tagsDisplay}

        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleBuyClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCartClick}
            disabled={product.stock_quantity === 0}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

const AllProducts = memo(() => {
  const [isdata, setisdata] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, token } = useUser()
  const router = useRouter();
  
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const cacheKey = 'all_products';
      const cacheddata = productCache.get(cacheKey);
      
      if (cacheddata) {
        console.log('Using cached data for all_products');
        setProducts(cacheddata)
        setisdata(true)
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/get-products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ''}`
        }
      });
      
      if (!response || !response.data) {
        console.error("No products found in the response.");
        return;
      }
      
      const allProducts = response.data.data.map((product) => ({
        ...product,
        tags: Array.isArray(product.tags)
          ? product.tags
          : typeof product.tags === "string"
          ? product.tags.split(",").map((t) => t.trim())
          : [],
      }))
      
      productCache.set(cacheKey, allProducts);
      setProducts(allProducts);
      setisdata(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addtoCart = useCallback(async (selectedproductId) => {
    try {
      if (!selectedproductId) {
        console.error("Product ID is not selected.");
        alert("Product ID is missing!");
        return;
      }
      
      if (!user?.id) {
        alert("Please log in to add items to cart");
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
        }
      });
      
      if (cartResponse.status === 200) {
        console.log("Added to cart successfully:", cartResponse.data);
        alert("Product added to cart successfully!");
      }
    } catch (error) {
      console.error('An error occurred:', error)
      alert("Failed to add product to cart!");
    }
  }, [user?.id]);

  const handleBuyNow = useCallback((productId) => {
    setShowProductPopup(true);
    setSelectedProductId(productId);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowProductPopup(false);
  }, []);

  const productsCountText = useMemo(() => {
    return `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
  }, [products.length]);

  const productsGrid = useMemo(() => {
    return products.map((product, i) => (
      <ProductCard
        key={product.id || i}
        product={product}
        onBuyNow={handleBuyNow}
        onAddToCart={addtoCart}
        index={i}
      />
    ));
  }, [products, handleBuyNow, addtoCart]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">Discover our complete collection of products</p>
          </div>

          {isdata && products.length > 0 ? (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="text-sm font-medium text-gray-600 mb-6">
                {productsCountText}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsGrid}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-300 mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any products at the moment.</p>
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
          setShowProductPopup={handleClosePopup}
        />
      )}
      
      <EcommerceFooter />
    </>
  )
})

AllProducts.displayName = "AllProducts";

export default AllProducts