import React from 'react'

const Productlisttwo = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[800px] px-5 mt-20">
        <div className="w-full h-[400px] md:h-full bg-gray-200  flex items-center justify-center relative group overflow-hidden rounded-lg">
          <img
            src="/Images/image4.jpg"
            alt="Collection Image"
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0  transition-all duration-300 flex items-end justify-start p-6">
            <div className="text-white mb-5 hover:mb-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-2">Premium Collection</h3>
              <p className="text-sm opacity-90 mb-4">Discover our finest selection</p>
              <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full h-[400px] md:h-full bg-gray-200  flex items-center justify-center relative group overflow-hidden rounded-lg">
          <img
            src="/Images/image2.jpg"
            alt="Collection Image"
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0  transition-all duration-300 flex items-end justify-start p-6">
            <div className="text-white mb-5 hover:mb-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-2 ">Featured Items</h3>
              <p className="text-sm opacity-90 mb-4">Trending styles this season</p>
              <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Productlisttwo