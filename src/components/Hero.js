"use client"
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const images = [
    '/Images/E_Hero1.jpg',
    '/Images/E-Hero2.jpg',
    '/Images/E-Hero3.jpg',
    '/Images/E-Hero4.jpg',
    '/Images/E-Hero5.jpg',
    '/Images/E-Hero6.jpg',
    '/Images/E-Hero7.jpg',
    '/Images/E-Hero8.jpg',
    '/Images/E-Hero9.jpg',
    '/Images/E-Hero10.jpg',
    '/Images/E-Hero11.jpg'
  ]


  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length)
        setIsAnimating(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

  const goToNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
      setIsAnimating(false)
    }, 300)
  }

  const goToPrev = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
      setIsAnimating(false)
    }, 300)
  }

  const goToSlide = (index) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentImage(index)
      setIsAnimating(false)
    }, 300)
  }
  return (
   <>
    <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-8 py-3">
              <a
                href="/"
                className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors duration-200"
              >
                Men's Shoes
              </a>
              <a
                href="/"
                className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors duration-200"
              >
                Women's Shoes
              </a>
              <a
                href="/"
                className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors duration-200"
              >
                New Arrivals
              </a>
            </div>
          </div>
        </div>
         <div className="relative bg-white w-full h-[500px] overflow-hidden">
        
        <div className="relative w-full h-full">
          <img
            src={images[currentImage]}
            alt={`Hero ${currentImage + 1}`}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          
         
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>

       
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>

        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImage
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

       
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              New Colors.<br />Iconic Comfort.
            </h1>
            <p className="text-xl mb-8 drop-shadow-md">
              Our limited-edition collection pairs breathability with versatility.
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Shop Now
            </button>
          </div>
        </div>

       
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {images.length}
        </div>
      </div>
       
   </>
  )
}

export default Hero
