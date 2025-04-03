import React from 'react'
import HotelCards from '@components/cards/HotelCard'
import { getAllHotel } from '@api/hotel'

const HotelList = async () => {
  
  const Hotels = await getAllHotel();

  return (
    <div>
      {
        Hotels.map((hotel, index) => (
          <HotelCards/>
        ))
      }
    </div>
  )
}

export default HotelList