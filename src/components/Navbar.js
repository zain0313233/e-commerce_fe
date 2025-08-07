"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  User,
  HelpCircle,
  ShoppingCart,
  X,
  Menu,
  MessageCircle
} from "lucide-react";
import SearchBar from "./searchBar";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import SellerChatDashboard from "@/components/SellerChatDashboard";

const Navbar = () => {
  const [showsearchbar, setShowSearchBar] = useState(false);
  const [cartlength, setcartlength] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, token } = useUser();

  useEffect(() => {
    const fetchCartLength = async () => {
      try {
        if (!user?.id || !token) {
          return;
        }

        const cartResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/get-all-cart/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (cartResponse.status === 200) {
          const cartData = cartResponse.data.cartitems || [];
          let cartlen = cartData.length;
          setcartlength(cartlen);
        }
      } catch (error) {
        console.error("error occure", error);
        setcartlength(0);
      }
    };

    fetchCartLength();
  }, [user, token]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="bg-blue-900 text-white text-center text-sm p-2 font-medium">
        Free Shipping On Orders Over $75. Easy Returns.
      </div>

      <header className="bg-white shadow-sm border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/Categories/men"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                MEN
              </a>
              <a
                href="/Categories/women"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                WOMEN
              </a>
              <a
                href="/Categories/shoes"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                SHOES & Watches
              </a>
              <a
                href="/allproducts/newarivals"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                NEW ARRIVALS
              </a>
            </div>

            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900 italic">
                ShopHub
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/allproducts"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                All Products
              </a>
              <a
                href="/Products"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                My Products
              </a>
              <a
                href="/"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                HOME
              </a>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setShowSearchBar(true)}
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => {
                  router.push("/Profile");
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              >
                <User size={20} />
              </button>

              <button
                onClick={() => {
                  router.push("/Profile/cart");
                }}
                className="text-gray-700 hover:text-gray-900 relative transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              >
                <ShoppingCart size={20} />
                {cartlength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartlength}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <a
                href="/Categories/men"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
              >
                MEN
              </a>
              <a
                href="/Categories/women"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
              >
                WOMEN
              </a>
              <a
                href="/Categories/shoes"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
              >
                SHOES & Watches
              </a>
              <a
                href="/allproducts/newarivals"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
              >
                NEW ARRIVALS
              </a>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <a
                  href="/allproducts"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
                >
                  All Products
                </a>
                <a
                  href="/Products"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
                >
                  My Products
                </a>
                <a
                  href="/"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
                >
                  HOME
                </a>
                <button
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-3 py-2 text-gray-900 font-medium text-base hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
                >
                  <HelpCircle size={20} className="mr-2" />
                  Help
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {showsearchbar && (
          <SearchBar
            showsearchbar={showsearchbar}
            setShowSearchBar={setShowSearchBar}
          />
        )}
      </header>

      {/* 
        IMPORTANT: Move SellerChatDashboard OUTSIDE the header 
        This prevents positioning issues and z-index conflicts
      */}
      <SellerChatDashboard />
    </>
  );
};

export default Navbar;