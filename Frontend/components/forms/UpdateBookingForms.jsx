'use client'

import { useEffect, useState } from "react";
import { getBooking } from "@api/booking";
import UpdateBookingRoomCard from "@components/cards/UpdateBookingRoomCard";

export const UpdateBookingForms = ({
    bookings,
    hotels,
    rooms
}) => {
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [bookingId, setBookingId] = useState(null);
    const [hotelId, setHotelId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const hotelIdFromUrl = params.get("hotel_id");
        const bookingIdFromUrl = params.get("booking_id")
        const storedToken = localStorage.getItem("token");

        setHotelId(hotelIdFromUrl);
        setBookingId(bookingIdFromUrl);
        setToken(storedToken);

        if (hotelIdFromUrl && rooms && rooms.length > 0) {
            const filtered = rooms.filter(room => room.hotel_id === hotelIdFromUrl);
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms(rooms); // fallback to all if no hotel_id
        }
    }, [rooms]);
    console.log(rooms)
    console.log(hotels)

    return (
        <div className="px-2 relative top-20 w-full h-screen lg:w-[60%] mx-2 hdcard_white overflow-hidden">
            <div className="p-6" style={{ fontSize: "14px" }}>
                <h2 className="text-2xl font-bold mb-10 capitalize text-blue-500 text-center">
                    Update Booking
                </h2>
                <div className="space-y-3">
                    {filteredRooms && filteredRooms.length > 0 ? (
                        filteredRooms.map((room) => (
                            <div
                                key={room._id}
                                className="text-center w-full animate-fade-in"
                            >
                                <UpdateBookingRoomCard 
                                    room={room} 
                                    token={token} 
                                    booking_id={bookingId} 
                                    hotel_id={hotelId} 
                                    className="w-full">
                                </UpdateBookingRoomCard>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No rooms available for this hotel.</p>
                    )}
                </div>
            </div>
        </div>
    )
}