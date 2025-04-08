import { cookies } from 'next/headers'
import { searchBookings } from '@api/booking'
import { UserProfileTab } from '@components/cards/UserProfileTab'
import { BookingList } from '@components/lists/BookingList'

const Page = async () => {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  const bookings = token ? await searchBookings(token) : null
  console.log(bookings);

  return (
    <div className='bg-gradient-to-b from-blue-500 to-white min-h-screen flex gap-4 p-4'>
      <UserProfileTab />
      <BookingList bookings={bookings} />
    </div>
  )
}

export default Page
