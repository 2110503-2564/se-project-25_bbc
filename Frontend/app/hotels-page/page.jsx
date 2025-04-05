import React from 'react';
import HotelSearchList from '@components/lists/HotelSearchList';
import { searchHotel } from '@api/hotel';

const page = async () => {
  const hotelsData = await searchHotel();
  const hotels = hotelsData.hotels;
  return (
    <div>
      <div
        className="main_bg align_item_center"
        style={{
          width: "100%",
          paddingLeft: "20px",
          paddingRight: "20px",
          height: "100px",
          zIndex: "-300",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)"
        }}
      ></div>
      <HotelSearchList hotels={hotels} />
    </div>
  );
};

export default page;
