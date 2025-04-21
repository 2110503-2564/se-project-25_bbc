'use client'

import React from 'react'
import Link from '@node_modules/next/link';
import TextButton from '@components/buttons/TextButton';
import Image from '@node_modules/next/image';

export const BookingCard = ({ booking }) => {
  // No need for useEffect or state since data is already populated
  const hotel = booking.hotel_id;
  const room = booking.room_id;
  const account = booking.account_id;

  return (
    <div className="card_bg2 rounded-lg p-6 mb-4 bg-white text-gray-600">
      <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm text-gray-600">
        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Name:</div>
        <div className="ml-[150px]">{account.first_name} {account.last_name}</div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Hotel:</div>
        <div className="ml-[150px]">{hotel?.name}</div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Room:</div>
        <div className="ml-[150px]">{room?.room_number}</div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">People:</div>
        <div className="ml-[150px]">{booking.num_people}</div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Check-in:</div>
        <div className="ml-[150px]">{new Date(booking.check_in_date).toLocaleDateString()}</div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Check-out:</div>
        <div className="ml-[150px]">{new Date(booking.check_out_date).toLocaleDateString()}</div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Status:</div>
        <div className="ml-[150px]">
          <span className={`font-semibold capitalize px-2 py-1 rounded 
            ${["pending", "finished"].includes(booking.status)
                ? "text-yellow-600 bg-yellow-100"
                : ["accepted", "confirmed", "checked-in", "checked-out"].includes(booking.status)
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
              }`}>
            {booking.status}
          </span>
        </div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Created at:</div>
        <div className="ml-[150px]">{new Date(booking.createdAt).toLocaleDateString()}</div>

        <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">Booking ID:</div>
        <div className="ml-[150px]">{booking._id}</div>
      </div>

      <div className="mt-4 flex justify-end flex-row">
        <Link href={{
          pathname: '/my-booking-page/manage-booking-page',
          query: {
            booking_id: booking._id,
            name: `${account.first_name} ${account.last_name}`,
            hotel_id: hotel?._id,
            room_id: room?._id,
            num: booking.num_people
          }
        }}>
          <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-all rounded-md flex items-center"
          >
            <p>Manage Booking</p>
            <Image
              src="/icons/pen-white.png"
              alt="pen-white"
              width={15}
              height={15}
              className="ml-2"
            />
          </button>
        </Link>
      </div>
    </div>
  );
}