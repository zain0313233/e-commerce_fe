"use client";
require("dotenv").config();
import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";

const productpopup = ({ selectedproductId, setShowProductPopup }) => {
  const [product, setProducts] = useState([]);
  const buyProduct = (userid) => {
    try {
      if (!selectedproductId) {
        console.error("Product ID is not selected.");
        return;
      }
      const orderData = {
        user_id: 1,
        product_id: selectedproductId,
        total_price: product.price,
        status: "pending",
        quantity: 1,
        shipping_address: "123 Main St, City, Country",
        payment_method: "credit_card"
      };
      const orderresponse = axios.post(
        `http://localhost:3001/api/order/create-order`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (orderresponse.status === 201) {
        console.log("Order placed successfully:", orderresponse.data);
        alert("Order placed successfully!");
      } 
    } catch (error) {
      console.error("Error buying product:", error);
    }finally {
      setShowProductPopup(false);
    }
  };
  const fetchProducts = async () => {
    try {
      if (!selectedproductId) {
        console.error("Search value is empty, cannot fetch products.");
        return;
      }
      const response = await axios.get(
        `http://localhost:3001/api/product/product-by-id?id=${selectedproductId}`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (!response || !response.data) {
        console.error("No products found in the response.");
        return;
      }
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    if (selectedproductId) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [selectedproductId]);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-1/2 w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
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
                  src={product.image_url || "/api/placeholder/300/300"}
                  alt={product.brand}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {product.brand}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </p>
                </div>

                <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                  <span className="text-sm font-medium text-gray-600">
                    Stock Available
                  </span>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      product.stock_quantity > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock_quantity > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock_quantity} units
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
                    onClick={() => {
                      setShowProductPopup(true);
                      buyProduct();
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Buy Now
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 border border-gray-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default productpopup;
