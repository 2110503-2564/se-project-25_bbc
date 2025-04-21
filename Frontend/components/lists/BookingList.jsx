'use client'

import React, { useEffect, useState } from 'react'
import { BookingCard } from '@components/cards/BookingCard'
import Image from 'next/image'

export const BookingList = ({ bookings }) => {
  const [user, setUser] = useState(null)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  const [sortField, setSortField] = useState(null) // default sort field
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const storedLogin = localStorage.getItem("res_login")
    if (storedLogin) {
      const parsedUser = JSON.parse(storedLogin)
      setUser(parsedUser)
    }
  }, [])

  useEffect(() => {
    if (user && bookings?.bookings) {
      const role = user.account.role
      const userId = user.account.id
      const hotelId = user.account.hotel_id

      const matched = bookings.bookings.filter(booking => {
        if (role === 'super_admin') return true
        if (role === 'hotel_admin') return booking.hotel_id === hotelId
        return booking.account_id.id === userId
      })

      const sorted = matched.sort((a, b) => {
        const dateA = new Date(a[sortField])
        const dateB = new Date(b[sortField])
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })

      setFilteredBookings(sorted)
    }
  }, [user, bookings, sortOrder, sortField])

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const handleSortFieldChange = (field) => {
    setSortField(field)
    setDropdownOpen(false)
  }

  const resetSorting = () => {
    setSortField(null) // reset to default sort field
    setSortOrder('asc') // reset to ascending order
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg relative top-20 mb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold main_text text-3xl mt-5">
          {user?.account.role === 'user' ? 'Your Booking' : 'All Booking'}
        </h2>

        {/* Filter UI */}
        <div className="relative flex items-center space-x-2" style={{ width:'60px'}}>
          <Image
            src={sortField || dropdownOpen ? '/icons/filter-blue.png' : '/icons/filter-outline-blue.png'} // Change image based on conditions
            alt="Filter Icon"
            width={28}
            height={28}
            className={`cursor-pointer transition-transform duration-200`} 
            onClick={() => setDropdownOpen(prev => !prev)}
          />
          <Image
            src="/icons/up-arrow.png"
            alt="Sort Arrow"
            width={18}
            height={18}
            className={`cursor-pointer transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
            onClick={toggleSortOrder}
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-10 bg-white border border-gray-300 rounded-xl shadow-md z-10 w-52 transition-all duration-300 transform opacity-100">
              <button
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 w-full text-left"
                onClick={() => handleSortFieldChange('check_in_date')}
              >
                Check-in Date
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 w-full text-left"
                onClick={() => handleSortFieldChange('check_out_date')}
              >
                Check-out Date
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sort field display with reset option */}
      {
        sortField && (
        <div className="mb-4">
            <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-600">
                Sorting by: <span className="font-semibold text-blue-500">{sortField === 'check_in_date' ? 'Check-in Date' : 'Check-out Date'}</span>
            </p>
            <button
                onClick={resetSorting}
                className="text-sm font-bold text-red-500 cursor-pointer"
            >
                X
            </button>
            </div>
        </div>
        )
      }
      

      {filteredBookings.length > 0 ? (
        filteredBookings.map(booking => (
          <BookingCard key={booking._id} booking={{
            ...booking,
          }} />
        ))
      ) : (
        <p className="text-gray-600">No bookings found.</p>
      )}
    </div>
  )
}
