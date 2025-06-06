import { BookingDetailCard } from "@components/cards/BookingDetailCard";
import { UpdateBookingForms } from "@components/forms/UpdateBookingForms";
import { cookies } from "@node_modules/next/headers";
import BookingPageClient from "@components/page/BookingPageClient";

import { searchHotel } from "@api/hotel";
import { searchRoom } from "@api/room";
import { getBooking } from "@api/booking";

const page = async ({ searchParams }) => {

    // from params
    const booking_id = searchParams?.booking_id;
    const name = searchParams?.name;
    const hotel_id = searchParams?.hotel_id;
    const room_id = searchParams?.room_id;
    const num = searchParams?.num;

    //take token
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    //fecth data object
    const bookingData = await getBooking({ token, query: `_id=${booking_id}` });
    const hotelData = await searchHotel();
    const roomData = await searchRoom();

    console.log(bookingData.bookings[0]);
    console.log(hotelData.hotels);
    console.log(roomData.rooms);

    return (
        <div style={{marginBottom:"200px"}} className='bg-gradient-to-b from-blue-500 to-white min-h-screen flex p-4'>
            <BookingPageClient
                booking={bookingData.bookings[0]}
                hotels={hotelData.hotels}
                rooms={roomData.rooms}
            />
        </div>
    );
}

export default page;