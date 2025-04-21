import { cookies } from 'next/headers'
import { searchBookings } from '@api/booking'
import { searchBookingsPopulateAccountId } from '@api/booking'
import { UserProfileTab } from '@components/cards/UserProfileTab'
import { BookingList } from '@components/lists/BookingList'

const Page = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const bookings = token ? await searchBookingsPopulateAccountId(token) : null
  // console.log(bookings);

  return (
    <div className="bg-gradient-to-b from-blue-500 to-white min-h-screen flex flex-col p-2 lg:flex-row gap-2 items-center lg:items-start lg:gap-0 mb-20">
      <UserProfileTab />
      <BookingList bookings={bookings} />
    </div>
  )
}

export default Page
