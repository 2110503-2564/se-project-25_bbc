import React from 'react'
import HotelCards from '@components/cards/HotelCard'

const HotelList = async ({
  Hotels=[]
} = {}) => {

  return (
    <div 
      className='card_bg1'
      style={{
      display: 'flex',
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      height: '330px',
      overflowX: 'auto',
      overflowY: 'auto',
      scrollSnapType: 'x mandatory',
      gap: '20px',
      paddingTop: '10px',
      animationDelay: '0s',
      padding:"10px",
      margin:"0",
      marginTop:"-30px",
      paddingBottom:"30px",
      paddingTop:"20px",
    }}>
      <div style={{width:"10px"}}></div>
      {
        Hotels.map((hotel, index) => (
          <div
            key={hotel._id}
          >
          <HotelCards hotel={hotel}/>
          </div>
        ))
      }
      <div style={{width:"10px"}}></div>
    </div>
  )
}

export default HotelList