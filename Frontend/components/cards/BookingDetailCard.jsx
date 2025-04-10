"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchRoom } from "@api/room";
import { getBooking } from "@api/booking";
import { searchHotel } from "@api/hotel";

export const BookingDetailCard = () => {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("booking_id") || "";
  const name = searchParams.get("name") || "";
  const hotelId = searchParams.get("hotel_id") || "";
  const roomId = searchParams.get("room_id") || "";
  const numPeople = searchParams.get("num") || "";

  const [booking,setBooking] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
        const token = localStorage.getItem('token');
        if (!roomId || !token || !bookingId) return;
        const roomData = await searchRoom(`_id=${roomId}`);
        const hotelData = await searchHotel(`_id=${hotelId}`);
        const bookingData = await getBooking({token,query:`_id=${bookingId}`})
        setHotel(hotelData.hotels[0]);
        setRoom(roomData.rooms[0]);
        setBooking(bookingData.bookings[0]);
    };
    fetchRoom();
  }, [roomId,bookingId]);

  return (
    <div className="px-2 relative top-20 w-[40%] hdcard_white overflow-hidden">
      <div className="p-6" style={{ fontSize: "14px" }}>
        <h2 className="text-2xl font-bold mb-10 capitalize text-gray-500 text-center">
          Current Booking Details
        </h2>

        <table className="w-full table-fixed text-left">
          <tbody className="text-sm text-gray-700">
            <tr>
              <td className="font-semibold w-1/3 py-1">Name:</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Hotel Name:</td>
              <td>{hotel ? hotel.name : "Loading..."}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Room Number:</td>
              <td>{room ? room.room_number : "Loading..."}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Room Type:</td>
              <td>{room ? room.type : "Loading..."}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Capacity:</td>
              <td>{room ? room.capacity : "Loading..."} guests</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Current People:</td>
              <td>{numPeople} guests</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Rate:</td>
              <td>${room ? room.rate_per_night : "Loading..."} / night</td>
            </tr>
            <tr>
                <td className="font-semibold py-1">Status:</td>
                <td
                    className={`font-semibold ${
                    booking?.status === "accepted" || booking?.status === "confirmed" || booking?.status === "finished"
                        ? "text-green-500"
                        : booking?.status === "rejected" || booking?.status === "canceled"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                >
                    {booking?.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Unknown"}
                </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-6 bg-yellow-100 p-5 rounded-xl text-gray-700 text-center">
          Please review the booking details before proceeding to manage it.
        </p>
      </div>
    </div>
  );
};
