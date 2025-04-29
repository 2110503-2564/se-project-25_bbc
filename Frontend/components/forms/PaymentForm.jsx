'use client';

import { createBooking } from '@api/booking';
import { use, useEffect, useState } from 'react';
import { SuccessDialog } from '@components/cards/SuccessDialog';
import PromptPayQR from '@components/payment/PromptPayQR';
import { uploadReceiptImage } from '@api/booking';
import { useRouter } from "next/navigation";

export const PaymentForm = ({
  tel = "0",
  booking_id = "",
  totalPrice=0,
}={}) => {
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
      setToken(storedToken);
  }, []);
  // handle file

  const submit = async () => {
    const res = await uploadReceiptImage({
      booking_id,
      file,
      token
    });

    if(res && res.success && isClient)
      router.push(
        `/my-booking-page`
      );

  }



  return (  
    <div className="w-full h-screen p-6 hdcard_white max-w-[500px] mt-20">
      <h2 className="text-2xl font-bold main_text mb-4">Payment</h2>

      <p className="text-sm sub_text mb-4">
        Pay via mobile banking
      </p>

      <div style={{position:"relative", overflow:"hidden", height:"450px"}} className="rounded-lg card_bg2 p-6 mb-4 bg-white text-gray-600">
        <PromptPayQR phone={tel} size={500} amount={totalPrice} />
      </div>
      <div className='card_bg2 p-2 rounded-lg mt-3 mb-3'>
          <div className=' main_text font-semibold'>Upload receipt</div>
            <input type="file" name="photo" onChange={(e) => {setFile(e.target.files[0]);}} />
          </div>
      <button
          type="submit"
          onClick={submit}
          className="bg-blue-500 text-white px-4 w-full py-2 hover:bg-blue-600 transition-all text-center  rounded-md"
        >
          <p>Confirm</p>
        </button>
      
     
    </div>
  );
};
