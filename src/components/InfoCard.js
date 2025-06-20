"use client"
import React, { useState, useEffect } from 'react'

const InfoCard = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const images = [
    '/Images/collection1.jpg',
    '/Images/collection2.jpg',
    '/Images/collection3.jpg',
    '/Images/collection4.jpg',
    '/Images/collection5.jpg',
    '/Images/collection6.jpg',
    '/Images/collection7.jpg',
    '/Images/collection8.jpg',
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

  return (
    <div className="w-full h-[400px] relative rounded overflow-hidden shadow-lg mt-10">
  
      <img
        src={images[currentImage]}
        alt={`Hero ${currentImage + 1}`}
        className={`absolute w-full h-full object-cover transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        }`}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-2 italic">Discover Our Collection</h2>
          <p className="text-lg opacity-90">Explore the latest trends in fashion</p>
        </div>
        <div className="flex gap-3 justify-center mb-5">
          <button className="bg-white text-black text-sm italic px-6 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
          <button className="bg-transparent border-2 border-white text-white text-sm italic px-6 py-2 rounded font-medium hover:bg-white hover:text-black transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfoCard
