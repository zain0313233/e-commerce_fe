"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

const Card = ({ image, title, subtittle }) => {
   const router = useRouter();
  return (
    <div className="w-[400px] h-[600px] relative  rounded-xs overflow-hidden shadow-lg">
     
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
     
      <div className="absolute inset-0 flex flex-col justify-between p-6">
       
        <div className="text-center text-gray-100">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-lg opacity-90">{subtittle}</p>
        </div>
        
       
        <div className="flex gap-3 justify-center">
          <button
           onClick={()=>{router.push('/Categories/men')}}
           className="bg-white text-black text-sm italic px-6 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
            SHOP MEN
          </button>
          <button 
           onClick={()=>{router.push('/Categories/women')}}
          className="bg-white text-black text-sm italic px-6 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
            SHOP WOMEN
          </button>
        </div>
      </div>
    </div>
  )
}
export default Card