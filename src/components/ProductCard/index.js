import React from 'react'
import Card from './Card'

const ProductCard = () => {
    const carddata=[
        {
        image: "/Images/E-Hero10.jpg",
        title: "Nike Air Max 270",
        subtittle: "The perfect blend of style and comfort"

        },
        {
        image: "/Images/E-Hero4.jpg",
        title: "Gucci Handbag",
        subtittle: "Luxury meets elegance"
        },
        {
        image: "/Images/E-Hero7.jpg",
        title: "Rado Watch",
        subtittle: "Timeless sophistication"
        },
    ]
        
    
  return (
    <>
    <div className="grid grid-cols-3 gap-1 mt-12 px-9" >
{carddata.map((item,index)=>{
   return <Card 
          key={index}
          image={item.image}
          title={item.title}
          subtittle={item.subtittle}
        />
})

}
</div>
    </>
  )
}

export default ProductCard
