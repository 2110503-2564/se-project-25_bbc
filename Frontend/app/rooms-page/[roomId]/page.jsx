import React from 'react'
import { searchRoom } from '@api/room';
import { RoomDetailCard } from '@components/cards/RoomDetailCard';
import { searchHotel } from '@api/hotel';
import { BookingForms } from '@components/forms/BookingForms';

const page = async({ params }) => {
  const { roomId } = params;
  
  const roomData = await searchRoom(`_id=${roomId}`);
  const hotelData = await searchHotel(`_id=${roomData.rooms[0].hotel_id}`)
  const hotelName = hotelData.hotels[0].name

  // console.log(hotelData.hotels[0].name);
  // console.log(roomData.rooms[0]);

  return (
    <div className='bg-gradient-to-b from-blue-500 to-white min-h-screen'>
      <div className='flex row justify-center'>
        <RoomDetailCard room={roomData.rooms[0]} hotelName={hotelName}/>
        <BookingForms 
        hotel_id={hotelData.hotels[0]._id}
        room_id={roomData.rooms[0]._id}
        total_price={roomData.rooms[0].rate_per_night}
        capacity={roomData.rooms[0].capacity}
        hotelName={hotelData.hotels[0].name}
        room={roomData.rooms[0]}
        />
      </div>
    </div>
  )
}

export default page
