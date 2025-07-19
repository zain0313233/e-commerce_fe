"use client";
require("dotenv").config();
import React, { useEffect ,useState} from "react";
import { Search, X } from "lucide-react";
import axios from "axios";
import { useUser } from '@/context/UserContext'
import ProductPopup from "./productpopup";

const searchBar = ({
  showsearchbar,
  setShowSearchBar,
}) => {
   const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const { user, token } = useUser()

  const fetchProducts = async () => {
    try{
      if(!searchValue){
        console.error("Search value is empty, cannot fetch products.");
        return;
      }
      const response = await axios.get(`http://localhost:3001/api/product/product-by-tag?tag=${searchValue}`, {
         headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token || ''}`
        }
    });
      if (!response || !response.data) {
        console.error("No products found in the response.");
        return;
      }
      setProducts(response.data.data.map((product) => ({
         ...product,
         tags: Array.isArray(product.tags)
           ? product.tags
           : typeof product.tags === "string"
           ? product.tags.split(",").map((t) => t.trim())
           : [],
       })));
    }catch (error) {

      console.error("Error fetching products:", error);

    }
  }
 
  useEffect(() => {
    if(searchValue) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  },[searchValue])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowSearchBar(false);
      }
    };
    if (showsearchbar) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showsearchbar]);
   const addtoCart =async (selectedproductId)=>{
      try{
        
        
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
             "Content-Type": "application/json"
          }
        });
        if (cartResponse.status===200){
          console.log("Added To successfully:", cartResponse.data);
        }
  
      }catch(error){
        console.error('an error occure',error)
      }
    }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={() => setShowSearchBar(false)}
      />

      <div className="absolute top-full right-16 mt-2 z-50 w-[90%] animate-in slide-in-from-top-2 duration-300">
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Search Products
              </h3>
              <button
                onClick={() => setShowSearchBar(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
              >
                <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            <div
              className={`relative transition-all duration-300 ${
                isFocused ? "transform scale-[1.02]" : ""
              }`}
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Search
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              </div>

              <input
                type="text"
                placeholder="Search for shoes, clothes, accessories..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 rounded-xl 
                        focus:outline-none focus:bg-white transition-all duration-300
                        placeholder-gray-400 text-gray-700 font-medium
                        ${
                          isFocused
                            ? "border-blue-500 shadow-lg shadow-blue-500/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                autoFocus
              />

              {searchValue && (
                <button
                  onClick={() => setSearchValue("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}

              <div
                className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  isFocused ? "w-full" : "w-0"
                }`}
              />
            </div>

            {!searchValue && (
              <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                <div className="text-sm font-medium text-gray-600 mb-3">
                  Popular Searches
                </div>
                <div className="space-y-2">
                  {[
                    "beauty",
                    "mascara",
                    "skincare",
                    "makeup"
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchValue(item)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                        <span className="text-gray-600 group-hover:text-gray-800">
                          {item}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchValue && (
              <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                <div className="text-sm font-medium text-gray-600 mb-4">
                  Search Results ({products.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto px-4">
                  {products.map((product, i) => (
                    <div
                      key={product.id || i}
                      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={product.image_url || "/api/placeholder/150/150"} 
                          alt={product.brand}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center" style={{display: 'none'}}>
                          <div className="text-4xl text-gray-400">📦</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 text-sm">
                          {product.brand}
                        </h4>
                        <p className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </p>
                        <div className="text-xs text-gray-500">
                          Stock: {product.stock_quantity}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.tags && product.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <button onClick={()=>{setShowProductPopup(true),setSelectedProductId(product.id)}} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                            Buy Now
                          </button>
                          <button 
                          onClick={()=>{addtoCart(product.id)}}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && searchValue && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm">No products found for "{searchValue}"</div>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View All Results →
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Press Enter to search</span>
                <span className="text-xs">ESC to close</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500/20 rounded-full blur-sm animate-pulse"></div>
        <div
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500/20 rounded-full blur-sm animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      {showProductPopup && (
        <ProductPopup
          selectedproductId={selectedProductId}
          setShowProductPopup={setShowProductPopup}
        />
      )}
    </>
  );
};

export default searchBar;