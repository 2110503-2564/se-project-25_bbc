'use client';

import { createBooking } from '@api/booking';
import { use, useEffect, useState } from 'react';
import { SuccessDialog } from '@components/cards/SuccessDialog';

export const PaymentFrom = ({

}={}) => {
  const [file, setFile] = useState(null);

  return (  
    <div className="w-full h-screen p-6 hdcard_white max-w-[500px] mt-20">
      <h2 className="text-2xl font-bold main_text mb-4">Payment</h2>

      <p className="text-sm sub_text mb-4">
        Pay via mobile banking
      </p>

      <div style={{position:"relative", overflow:"hidden", height:"450px"}} className="rounded-lg card_bg2 p-6 mb-4 bg-white text-gray-600">
        Qr Code Here
      </div>
      <div className='card_bg2 p-2 rounded-lg mt-3 mb-3'>
          <div className=' main_text font-semibold'>Upload receipt</div>
            <input type="file" name="photo" onChange={(e) => {setFile(e.target.files[0]);}} />
          </div>
      <button
          type="submit"
          className="bg-blue-500 text-white px-4 w-full py-2 hover:bg-blue-600 transition-all text-center  rounded-md"
        >
          <p>Confirm</p>
        </button>
      
     
    </div>
  );
};
