'use client';

import { createBooking } from '@api/booking';
import { use, useEffect, useState } from 'react';
import { SuccessDialog } from '@components/cards/SuccessDialog';

export const PaymentFrom = ({
  hotel_id,
  room_id,
  total_price,
  status = "pending",
  roomCapacity,
  hotelName,
  room
}) => {
  

  return (  
    <div className="w-full h-screen p-6 hdcard_white max-w-[500px] mt-20">
      <h2 className="text-2xl font-bold main_text mb-4">Payment</h2>

      <p className="text-sm sub_text mb-4">
        Booking cannot exceed <span className="font-semibold text-black">4 days</span>
      </p>

      <div style={{position:"relative", overflow:"hidden", height:"450px"}} className="rounded-lg card_bg2 p-6 mb-4 bg-white text-gray-600"></div>
      
     
    </div>
  );
};
