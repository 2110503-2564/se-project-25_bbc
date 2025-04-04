import React from 'react'
import HotelSelectCard from '@components/cards/HotelSelectCard';
import { searchHotel } from '@api/hotel'

const page = async () => {
  const hotelsData = await searchHotel();
  const Hotels = hotelsData.hotels;
  return (
    <div>
      <div
         className='main_bg align_item_center'
        style={{
          width:"100%",
          paddingLeft:"20px",
          paddingRight:"20px",
          height:"100px",
          zIndex:"-300",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)"
        }}
      >

      </div>
      <div style={containerStyle}>
      {
        Hotels.map((hotel, index) => (
          <div
            key={hotel._id}
          >
          <HotelSelectCard hotel={hotel}/>
          </div>
        ))
      }
      </div>
    </div>
  )
}

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px", // Space between cards
  justifyContent: "center", // Align items to the start,
  marginTop: "10px",
};

export default page

