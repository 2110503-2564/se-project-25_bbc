"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchRoom } from "@api/room";
import { getBooking } from "@api/booking";
import { searchHotel } from "@api/hotel";
import DeletedBookButton from "@components/buttons/DeletedBookButton";
import UpdateStatusButton from "@components/buttons/UpdateStatusButton";
import CancelBookButton from "@components/buttons/CancelBookButton";
import Image from "@node_modules/next/image";
import { borderRadius } from "@node_modules/@mui/system";

export const BookingDetailCard = () => {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("booking_id") || "";

  const [booking, setBooking] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [name, setName] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("token");

      const storedLogin = localStorage.getItem("res_login");
      if (storedLogin) {
        const parsedUser = JSON.parse(storedLogin);
        setUser(parsedUser);
        // console.log("User from Booking Detail Card",user,parsedUser);
      }
  
      const bookingRes = await getBooking({ token, query: `_id=${bookingId}` });
      const bookingWithPopulate = await getBooking({token,query:`_id=${bookingId}&&populate=account_id`});
      const booking = bookingRes.bookings[0];
      // console.log("Book:",bookingWithPopulate)
      const hotelRes = await searchHotel(`_id=${booking.hotel_id}`);
      const roomRes = await searchRoom(`_id=${booking.room_id}`);
  
      setBooking(booking);
      setHotel(hotelRes.hotels[0]);
      setRoom(roomRes.rooms[0]);
      setName(bookingWithPopulate.bookings[0].account_id.first_name + ' '  + bookingWithPopulate.bookings[0].account_id.last_name )
      
      // console.log("Hotel",hotelRes.hotels[0])
    };
  
    fetchDetails();
  }, [bookingId]);


  return (
    <div className="px-2 relative top-20 lg:w-[40%] lg:h-screen hdcard_white overflow-hidden">
      <div className="p-6" style={{ fontSize: "14px" }}>
        <h2 className="text-2xl font-bold mb-10 relative capitalize text-center">
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
              <td>{booking?.num_people} guests</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Rate:</td>
              <td>${room ? room.rate_per_night : "Loading..."} / night</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Check-in Date:</td>
              <td>
                {booking?.check_in_date
                  ? new Date(booking.check_in_date).toLocaleDateString()
                  : "Loading..."}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Check-out Date:</td>
              <td>
                {booking?.check_out_date
                  ? new Date(booking.check_out_date).toLocaleDateString()
                  : "Loading..."}
              </td>
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


        {
          console.log(booking?.receiptUrl?.replace('http:/', 'http://'))
        }
        <img alt="receipt" style={{borderRadius:"10px", marginTop:"10px"}} className="border border-gray-300 card_bg2 " width={150} height={200} src={booking?.receiptUrl?.replace(/\\/g, '/').replace('http:/', 'http://')}/>
        <p className="mt-6 bg-yellow-100 p-5 rounded-xl text-gray-700 text-center">
          Please review the booking details before proceeding to manage it.
        </p>
        
        {(user?.account.role === 'hotel_admin' || user?.account.role === 'super_admin') && (<div className="mt-2">
          <UpdateStatusButton booking_id={bookingId}/>
        </div>)}
        {
          (user?.account.role === 'user') && (
            <div className="mt-2">
              <CancelBookButton booking_id={bookingId}/>
            </div>
          )
        } 

        {/* Deleted Booking Button */}
        {
          (user?.account.role === 'hotel_admin' || user?.account.role === 'super_admin') && (
            <div className="mt-2">
            <DeletedBookButton booking_id={bookingId}/>
          </div>
          )
        }
        
        </div>

    
    </div>
  );
};
