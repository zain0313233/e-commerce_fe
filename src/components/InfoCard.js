import React from 'react'

const InfoCard = () => {
  return (
   <>
    <div className="w-full h-[400px] relative rounded-xs overflow-hidden shadow-lg mt-10">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-80"></div>
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Discover Our Collection</h2>
          <p className="text-lg opacity-90">Explore the latest trends in fashion</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button className="bg-white text-black text-sm italic px-6 py-2 rounded font-medium hover:bg-gray-100 transition-colors
"> 
            Shop Now
          </button>
          <button className="bg-transparent border-2 border-white text-white text-sm italic px-6 py-2 rounded font-medium hover:bg-white hover:text-black transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
    
   </>
  )
}

export default InfoCard
