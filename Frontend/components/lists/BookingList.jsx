'use client'

import React, { useEffect, useState } from 'react'
import { BookingCard } from '@components/cards/BookingCard'
import Image from 'next/image'

export const BookingList = ({ bookings }) => {
  const [user, setUser] = useState(null)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'
  const [sortField, setSortField] = useState('createdAt') // default sort field
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
      const storedLogin = localStorage.getItem("res_login");
      // Simulating a delay to show the loading state
      setTimeout(() => {
        if (storedLogin) {
          const parsedUser = JSON.parse(storedLogin);
          setUser(parsedUser);
        }
        setLoading(false);
      }, 1000);
  }, []);

  useEffect(() => {
    if (user && bookings) { // Removed ?.bookings since the data is now direct array
      const role = user.account.role
      const userId = user.account.id
      const hotelId = user.account.hotel_id

      let matched = bookings.bookings.filter(booking => {
        if (role === 'super_admin') return true
        if (role === 'hotel_admin') return booking.hotel_id._id === hotelId
        return booking.account_id._id === userId
      })

      if(searchTerm){
        matched = matched.filter(booking => {
          return(
            booking.hotel_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.account_id.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.account_id.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.room_id.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.createdAt.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })
      }

      const sorted = matched.sort((a, b) => {
        const dateA = new Date(a[sortField])
        const dateB = new Date(b[sortField])
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })

      setFilteredBookings(sorted)
    }
  }, [user, bookings, sortOrder, sortField ,searchTerm])

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const handleSortFieldChange = (field) => {
    setSortField(field)
    setDropdownOpen(false)
  }

  const resetSorting = () => {
    setSortField('createdAt') // reset to default sort field
    setSortOrder('desc') // reset to ascending order
  }

  if(loading) return null ;

  if(!user) return null;

  return (
    <div className="w-full p-6 hdcard_white shadow-lg relative top-20 mb-20">
      <div className="flex justify-between items-center mb-4">
        <div className='space-y-2'>
          <h2 className="font-semibold main_text text-2xl mt-5">
            {user?.account.role === 'user' ? 'Your Booking' : 'All Booking'}
          </h2>
          <div className='relative flex items-center space-x-2'>
            <input type="text" 
            className='card_bg2'
            placeholder='Search Bookings'
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            style={{
              padding:'8px',
              paddingLeft:'20px',
              paddingRight:'20px',
              width:'100%',
              maxWidth:'400px',
              borderRadius:'6px'
            }}
            />
         </div>
        </div>
        

        

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
              <button
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 w-full text-left"
                onClick={() => handleSortFieldChange('createdAt')}
              >
                Created At
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sort field display with reset option */}
      {
        sortField && sortField !== 'createdAt' && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-600">
                Sorting by: 
                <span className="font-semibold text-blue-500">
                  {
                    sortField === 'check_in_date' ? 'Check-in Date' :
                    sortField === 'check_out_date' ? 'Check-out Date' :
                    ''
                  }
                </span>
              </p>
              <button
                onClick={resetSorting}
                className="text-sm font-bold text-red-500 cursor-pointer"
            >
                <img src='/icons/x-3.svg' style={{width:"18px"}}/>
            </button>
            </div>
          </div>
        )
      }
      

      {filteredBookings.length > 0 ? (
        filteredBookings.map(booking => (
          <BookingCard key={booking._id} booking={booking} />
        ))
      ) : (
        <p className="text-gray-600">No bookings found.</p>
      )}
    </div>
  )
}
