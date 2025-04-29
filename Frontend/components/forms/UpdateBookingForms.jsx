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
        const bookingIdFromUrl = params.get("booking_id");
        const storedToken = localStorage.getItem("token");
    
        setBookingId(bookingIdFromUrl);
        setToken(storedToken);
    
        const fetchBooking = async () => {
            if (bookingIdFromUrl && storedToken) {
                try {
                    const bookingData = await getBooking({
                        token: storedToken,
                        query: `_id=${bookingIdFromUrl}`
                    });
    
                    const hotelIdFromBooking = bookingData.bookings[0]?.hotel_id;
                    setHotelId(hotelIdFromBooking);
                        if (hotelIdFromBooking && rooms && rooms.length > 0) {
                        const filtered = rooms.filter(room => room.hotel_id === hotelIdFromBooking);
                        setFilteredRooms(filtered);
                    } else {
                        setFilteredRooms(rooms); // fallback to all if no match
                    }
                } catch (err) {
                    console.error("Error fetching booking:", err);
                }
            }
        };
    
        fetchBooking();
    }, [rooms]);
    
    console.log(rooms)
    console.log(hotels)

    return (
        <div className="px-2 relative top-20 w-full h-screen lg:w-[60%] mx-2 hdcard_white overflow-hidden">
            <div className="p-6 h-full" style={{ fontSize: "14px" }}>
                <h2 className="text-2xl font-bold mb-10 capitalize text-blue-500 text-center">
                    Update Booking
                </h2>
                <div className="space-y-3 overflow-y-auto flex-1 max-h-[calc(100vh-200px)] pr-2 rounded-md">
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
                                    className="w-full"
                                    hotels={hotels}
                                    rooms={rooms}
                                />
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