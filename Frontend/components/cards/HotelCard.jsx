import React from 'react'
import Image from '@node_modules/next/image'

const HotelCard = ({
  hotel=null
} = {}) => {
  if (hotel)
  return (
    <div
      className='hdcard_white'
      style={{ 
        width:"30vw",
        height:"100%",
        minWidth:"250px",
        position:"relative",
        flexShrink:0,
        scrollSnapAlign:"center",
        color:"black",
        borderRadius:"15px"
       }}
    >
       <div className="bigcard_image_container" style={{height: "60%"}}>
            <Image
              src={hotel.image_url} 
              alt={hotel.name}
              width={500} 
              height={500} 
              layout="responsive" 
              quality={75} 
              loading="lazy" 
            />
      </div>
      <div 
        className=''
        style={{fontWeight:"600", position:"absolute", top:"calc(60% + 20px)", left:"8px", right:"8px", textAlign:"left"}}>
        {hotel.name}

        <span 
          className='main_text' 
          style={{fontSize:"12px", fontWeight:"200", lineHeight:"0px"}}
        >
         <br/>
        <span 
          className='main_text' 
          style={{fontSize:"12px", fontWeight:"200", lineHeight:"0px"}}
        >
        <div style={{ display: "inline-block", marginRight: "3px", marginBottom: "-1px" }}>
          <img src='/icons/phone.svg' width="12px" />
        </div>
        {hotel.tel} <br/>
        <div style={{ display: "inline-block", marginRight: "3px", marginBottom: "-1px" }}>
          <img src='/icons/map-pin-3.svg' width="12px" />
        </div>
        {hotel.address.city}, &nbsp; 
        {hotel.address.street_name} 
        </span>
        </span>
      </div> 
    </div>
  )
}

export default HotelCard