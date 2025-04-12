import Image from 'next/image'
import { useState } from 'react'

const UpdateBookingRoomCard = ({ room = null } = {}) => {
  const [isSelected, setIsSelected] = useState(false)
  const [numPeople, setNumPeople] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const toggleSelection = () => setIsSelected(!isSelected)

  const handleConfirm = () => {
    console.log("Booking confirmed:", {
      room_id: room._id,
      numPeople,
      checkIn,
      checkOut
    })
    alert("Booking confirmed!") // You can replace this with an actual booking function or API call
  }

  return (
    <div className="flex flex-col w-full max-w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white text-center transition-all duration-300">
      {/* Top Section: Image + Info */}
      <div className="flex w-full">
        {/* Image */}
        <div className="relative w-1/3 min-w-[150px] h-[250px]">
          <Image
            src={room.image_url}
            alt={room.type}
            fill
            className="object-cover"
            quality={75}
            loading="lazy"
          />
        </div>

        {/* Room Info */}
        <div className="p-4 flex flex-col justify-between w-2/3 text-left">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{room.type}</h3>
            <p className="text-sm text-gray-500 mt-1">Room No. {room.room_number}</p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <img src="/icons/dollar-sign.svg" className="w-4 h-4 mr-1" />
                <span className="font-medium">{room.rate_per_night}</span>
                <span className="text-gray-400 ml-2">/ night</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <img src="/icons/bed-single.svg" className="w-4 h-4 mr-1" />
                <span className="font-medium">{room.capacity}</span>
                <span className="text-gray-400 ml-2">people</span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleSelection}
            className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold transition ${
              isSelected ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSelected ? 'Cancel' : 'Select This Room'}
          </button>
        </div>
      </div>

      {/* Expandable Section */}
      {isSelected && (
        <div className={`px-4 py-4 border-t border-gray-200 text-left transition-all duration-500 ${isSelected ? 'animate-fade-in' : 'animate-fade-out'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Column: People, Check-in, Check-out */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Number of People</label>
                <input
                  type="number"
                  value={numPeople}
                  onChange={(e) => setNumPeople(Number(e.target.value))}
                  min={1}
                  max={room.capacity}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="w-full">
                  <label className="text-sm font-medium text-gray-600">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                  />
                </div>
              </div>

              <div className='w-full'>
                  <button
                    onClick={handleConfirm}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition w-full"
                  >
                    Update Booking
                  </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdateBookingRoomCard