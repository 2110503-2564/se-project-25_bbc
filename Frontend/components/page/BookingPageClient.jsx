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
      <div className=" min-h-screen p-4 flex flex-col gap-2 items-center lg:flex-row lg:gap-0 lg:items-start">
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
