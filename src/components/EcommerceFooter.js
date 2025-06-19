"use client"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, RotateCcw, Heart, Star } from 'lucide-react'

export default function EcommerceFooter() {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
         
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">ShopHub</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted online marketplace for quality products at unbeatable prices. We bring you the best shopping experience with fast delivery and excellent customer service.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Wishlist
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Reviews
                </a>
              </li>
            </ul>
          </div>

         
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">123 Commerce Street, Business District, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-300 hover:text-white transition-colors duration-200">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <a href="mailto:support@shophub.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                  support@shophub.com
                </a>
            </div>
            
            
            <div className="pt-4">
              <h5 className="text-sm font-semibold mb-3">Newsletter</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-gray-600"
                />
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="Subscribe to newsletter"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

       
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">Free Shipping Over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">30-Day Returns</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">We Accept:</span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-8 h-6 text-gray-300" />
                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center" title="Visa">
                  <span className="text-xs font-bold text-white">V</span>
                </div>
                <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center" title="Mastercard">
                  <span className="text-xs font-bold text-white">MC</span>
                </div>
                <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center" title="PayPal">
                  <span className="text-xs font-bold text-white">PP</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              © 2025 ShopHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}