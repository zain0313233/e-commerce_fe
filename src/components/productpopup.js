"use client";
import React, { useEffect, useState } from "react";
import { Search, X, MessageCircleMore } from "lucide-react";
import { useUser } from '@/context/UserContext'
import axios from "axios";
import { useRouter } from "next/navigation";
import ChatWindow from './ChatWindow';

const ProductPopup = ({ selectedproductId, setShowProductPopup }) => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { user, token } = useUser()
  const router = useRouter();
   useEffect(() => {
      if (!user || !token) {
        router.push('/login');
      }
    }, [user, token, router]);
  
  const buyProduct = async () => {
    try {
      setLoading(true);
      
      if (!selectedproductId) {
        console.error("Product ID is not selected.");
        alert("Product ID is missing!");
        return;
      }

      if (!product || !product.id) {
        console.error("Product data is not loaded.");
        alert("Product data is not available!");
        return;
      }

      const orderData = {
        user_id: user.id, 
        customer_email: "aown02322@gmail.com",
        product_name: product.title,
        product_image: product.image_url,
        product_description: product.description,
        product_id: selectedproductId,
        total_price: parseFloat(product.price),
        status: "pending",
        quantity: 1,
        shipping_address: "123 Main St, City, Country",
        payment_method: "credit_card"
      };

      console.log("Sending order data:", orderData);

      const orderResponse = await axios.post(
        `http://localhost:3001/api/order/create-order`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 

          }
        }
      );

      console.log("Order response:", orderResponse);

      if (orderResponse.status === 201 && orderResponse.data.url) {
        console.log("Order created successfully:", orderResponse.data);
        
        
        window.location.href = orderResponse.data.url;
        
       
      } else {
        console.error("Unexpected response:", orderResponse);
        alert("Failed to create order. Please try again.");
      }
      
    } catch (error) {
      console.error("Error buying product:", error);
      
      if (error.response) {
        
        console.error("Server error:", error.response.data);
        alert(`Order failed: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
       
        console.error("Network error:", error.request);
        alert("Network error. Please check your connection.");
      } else {
       
        console.error("Error:", error.message);
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const addtoCart =async ()=>{
    try{
       setLoading(true);
      
      if (!selectedproductId) {
        console.error("Product ID is not selected.");
        alert("Product ID is missing!");
        return;
      }
        const cratData = {
        user_id: user.id, 
        product_id: selectedproductId,
        quantity: 1,      
      };
      const cartResponse=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add-to-cart`,cratData,{
        headers:{
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        }
      });
      if (cartResponse.status===200){
        console.log("Added To successfully:", cartResponse.data);
         setLoading(false);
         setShowProductPopup(false);
      }

    }catch(error){
      console.error('an error occure',error)
    }finally{
      setLoading(false);
    }
  }

  const fetchProducts = async () => {
    try {
      if (!selectedproductId) {
        console.error("Search value is empty, cannot fetch products.");
        return;
      }

      setLoading(true);

      const response = await axios.get(
        `http://localhost:3001/api/product/product-by-id?id=${selectedproductId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response || !response.data) {
        console.error("No products found in the response.");
        return;
      }
      

        const productData = response.data.data || {};
      
     
      if (productData.tags && typeof productData.tags === 'string') {
       
        try {
          productData.tags = JSON.parse(productData.tags);
        } catch (e) {
         
          productData.tags = productData.tags.split(',').map(tag => tag.trim());
        }
      } else if (!Array.isArray(productData.tags)) {
       
        productData.tags = [];
      }
      setProduct(productData);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedproductId) {
      fetchProducts();
    } else {
      setProduct({});
    }
  }, [selectedproductId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => setShowProductPopup(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>

          <div className="p-6 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Product Details
            </h2>
          </div>

          <div className="px-6 pb-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.brand || "Product"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  <div className="text-6xl text-gray-400">📦</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {product.brand || "Product Name"}
                  </h3>
                  <button 
                    onClick={() => setShowChat(true)}
                    className="flex gap-1 text-blue-400 text-lg hover:text-blue-600 transition-colors items-center"
                  > 
                    <span className="text-lg font-bold text-blue-900">Chat with us</span>
                    <MessageCircleMore />
                  </button>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    ${product.price || "0.00"}
                  </p>
                </div>

                {product.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Description
                    </p>
                    <p className="text-sm text-gray-700">
                      {product.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                  <span className="text-sm font-medium text-gray-600">
                    Stock Available
                  </span>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      (product.stock_quantity || 0) > 10
                        ? "bg-green-100 text-green-800"
                        : (product.stock_quantity || 0) > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock_quantity || 0} units
                  </span>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={buyProduct}
                    disabled={loading || (product.stock_quantity || 0) === 0}
                    className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      loading || (product.stock_quantity || 0) === 0
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    }`}
                  >
                    {loading ? "Processing..." : "Buy Now"}
                  </button>
                  <button
                  onClick={()=>{addtoCart()}} 
                    className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 border border-gray-300"
                    disabled={loading || (product.stock_quantity || 0) === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <ChatWindow 
          supportUserId={product.user_id || 1}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default ProductPopup;