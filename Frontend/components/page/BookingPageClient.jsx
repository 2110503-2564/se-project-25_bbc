'use client'

import { useState } from "react"
import { BookingDetailCard } from "@components/cards/BookingDetailCard"
import { UpdateBookingForms } from "@components/forms/UpdateBookingForms"

export default function BookingPageClient({ booking, hotels, rooms}){
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshBookingDetails = () => {
        setRefreshTrigger((prev) => (prev + 1))
    }

    return (
        <div className='bg-gradient-to-b from-blue-500 to-white min-h-screen flex p-4'>
          <BookingDetailCard booking={booking} key={refreshTrigger} />
          <UpdateBookingForms
            bookings={booking}
            hotels={hotels}
            rooms={rooms}
            onUpdateSuccess={refreshBookingDetails}
          />
        </div>
      );
}
