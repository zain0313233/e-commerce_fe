import React from 'react'

const Productlist = () => {
  return (
    <>
    <div className="grid grid-cols-2 w-auto h-auto gap-1 mt-12 px-16">
        <div className="w-auto h-full border border-gray-800 "></div>
        <div className="grid grid-cols-2 gap-1 ">
            <div className="w-[300px] h-[300px] border border-gray-800 m-2"></div>
            <div className="w-[300px] h-[300px] border border-gray-800 m-2"></div>
             <div className="w-[300px] h-[300px] border border-gray-800 m-2"></div>
            <div className="w-[300px] h-[300px] border border-gray-800 m-2"></div>
           
        </div>

    </div>
    </>
  )
}

export default Productlist
