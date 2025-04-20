'use client'

import React, { useEffect, useState } from 'react'
import { searchHotel } from '@api/hotel';
import { searchRoom } from '@api/room';
import Link from '@node_modules/next/link';
import TextButton from '@components/buttons/TextButton';
import Image from '@node_modules/next/image';

export const BookingCard = ({ booking }) => {

    const [hotel,setHotel] = useState(null);
    const [room, setRoom] = useState(null)

    useEffect(() => {
        const fetchDetails = async () => {
          try {
            const hotelData = await searchHotel(`_id=${booking.hotel_id}`);
            const roomData = await searchRoom(`_id=${booking.room_id}`);
            
            if (hotelData?.hotels?.length > 0) setHotel(hotelData.hotels[0]);
            if (roomData?.rooms?.length > 0) setRoom(roomData.rooms[0]);
          } catch (error) {
            console.error("Error fetching hotel or room:", error);
          }
        };
      
        fetchDetails();
      }, [booking.hotel_id, booking.room_id]);
      

      return (
        <div className="border border-gray-200 rounded-lg p-6  mb-4 bg-white text-gray-600">
          <table className="w-full table-auto text-sm">
            <tbody>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Name:</td>
                <td>{booking.account_id.first_name} {booking.account_id.last_name}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Hotel:</td>
                <td>{hotel ? hotel.name : 'Loading...'}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Room:</td>
                <td>{room ? room.room_number : 'Loading...'}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">People:</td>
                <td>{booking.num_people}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Check-in:</td>
                <td>{new Date(booking.check_in_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Check-out:</td>
                <td>{new Date(booking.check_out_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Status:</td>
                    <td>
                        <span
                        className={`font-semibold capitalize px-2 py-1 rounded 
                            ${
                            ["pending", "finished"].includes(booking.status)
                                ? "text-yellow-600 bg-yellow-100"
                                : ["accepted", "confirmed", "checked-in", "checked-out"].includes(booking.status)
                                ? "text-green-600 bg-green-100"
                                : "text-red-600 bg-red-100"
                            }`}
                        >
                        {booking.status}
                        </span>
                    </td>
                </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Booking ID:</td>
                <td>{booking._id}</td>
              </tr>
            </tbody>
          </table>
      
          <div className="mt-4 flex justify-end flex-row">
          <Link href={{
            pathname: '/my-booking-page/manage-booking-page',
            query: {
              booking_id: booking._id,
              name: `${booking.account_id.first_name} ${booking.account_id.last_name}`,
              hotel_id: hotel?._id,
              room_id: room?._id,
              num: booking.num_people
            }
          }}>
              <button className="bg-blue-500 text-white px-4 py-2  hover:bg-blue-600 transition-all flex items-center"
                style={{borderRadius:"20px"}}
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
