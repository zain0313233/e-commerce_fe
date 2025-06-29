"use client"
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import { Search, User, HelpCircle, ShoppingCart, X } from 'lucide-react'
import SearchBar from './searchBar'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [showsearchbar, setShowSearchBar] = useState(false);
  const [cartlength,setcartlength]=useState(0);
  const router = useRouter();
  const { user, token } = useUser();
  
  useEffect(()=>{
    const fetchCartLength = async () => {
      try{
        if (!user?.id || !token) {
          return
        }

        const cartResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/get-all-cart/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (cartResponse.status === 200) {
          const cartData = cartResponse.data.cartitems || []
          let cartlen=cartData.length;
          setcartlength(cartlen)
        }
      }catch(error){
        console.error('error occure',error)
        setcartlength(0)
      }
    }
    
    fetchCartLength()
  },[user, token])

 return (
    <>
      <div className="bg-blue-900 text-white text-center text-sm p-2 font-medium">
        Free Shipping On Orders Over $75. Easy Returns.
      </div>
      
      <header className="bg-white shadow-sm border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center space-x-8">
              <a
                href="/men"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                MEN
              </a>
              <a
                href="/women"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                WOMEN
              </a>
              <a
                href="/allproducts/shoes"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                SHOES & Watches
              </a>
              <a
                href="/"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                NEW ARRIVALS
              </a>
            </div>

            <div className="flex items-center">
              <a
                href="/"
                className="text-2xl font-bold text-gray-900 italic"
              >
               ShopHub
              </a>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="/allproducts"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                All Products
              </a>
              <a
                href="/"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                RERUN
              </a>
              <a
                href="/"
                className="text-gray-900 font-medium text-sm uppercase tracking-wide hover:underline hover:text-gray-700 transition-colors duration-200"
              >
                STORES
              </a>
              
              <div className="flex items-center space-x-4 ml-4">
                <button 
                  onClick={() => setShowSearchBar(true)} 
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                >
                  <Search size={20} />
                </button>
                <button 
                onClick={()=>{router.push('/Profile')}}
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full">
                  <User size={20} />
                </button>
                <button className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full">
                  <HelpCircle size={20} />
                </button>
                <button
                  onClick={()=>{router.push('/cart')}}
                 className="text-gray-700 hover:text-gray-900 relative transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full">
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
        </div>

        {showsearchbar && (
         <>
         <SearchBar
          showsearchbar={showsearchbar}
          setShowSearchBar={setShowSearchBar}
         />
         </>
        )}
      </header>
    </>
  )
}

export default Navbar