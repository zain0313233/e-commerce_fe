import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductList = () => {
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: "Premium Athletic Runners",
      price: 129.99,
      description: "Lightweight breathable comfort for daily runs"
    },
    {
      id: 2,
      name: "Classic Street Sneakers", 
      price: 89.99,
      description: "Timeless style meets modern comfort design"
    },
    {
      id: 3,
      name: "Training Performance Shoes",
      price: 149.99,
      description: "Maximum support for intense workout sessions"
    },
    {
      id: 4,
      name: "Casual Lifestyle Kicks",
      price: 99.99,
      description: "Versatile everyday wear with premium materials"
    }
  ];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const buyNow = (product) => {
    addToCart(product);
    alert(`Redirecting to checkout for ${product.name}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-auto gap-16 mt-12 px-4 sm:px-8 md:px-16">
        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-full">
          <img
            src="/Images/collection2.jpg"
            alt="Collection Image"
            className="w-full h-full object-cover transition-all duration-300"
          />
          
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
          {products.map((product, index) => (
            <div key={product.id} className="w-full max-w-xs mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={`/Images/shoe${index + 1}.jpg`}
                    alt="Collection Image"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-all duration-300"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-gray-900 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-1 text-xs sm:text-sm font-medium"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm font-medium"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;