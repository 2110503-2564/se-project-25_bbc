import Image from 'next/image'
import { useState } from 'react'
import { updateBooking } from '@api/booking'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'

const UpdateBookingRoomCard = ({ room = null, token, booking_id, hotel_id }) => {
  const [isSelected, setIsSelected] = useState(false)
  const [numPeople, setNumPeople] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [openConfirm, setOpenConfirm] = useState(false)

  const toggleSelection = () => setIsSelected(!isSelected)

  const handleOpenConfirm = () => setOpenConfirm(true)
  const handleCloseConfirm = () => setOpenConfirm(false)

  const handleFinalConfirm = async () => {
    try {
      setOpenConfirm(false)
      const result = await updateBooking({
        token,
        booking_id,
        hotel_id,
        room_number: room.room_number,
        num_people: numPeople,
        check_in_date: checkIn,
        check_out_date: checkOut
      })
    } catch (error) {
      console.log(error)
      alert("Error updating booking")
    }
  }

  return (
    <div className="flex flex-col w-full max-w-full rounded-2xl overflow-hidden  border border-gray-200 bg-white text-center transition-all duration-300">
      {/* Top Section */}
      <div className="flex w-full">
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
            className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold transition ${isSelected ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isSelected ? 'Cancel' : 'Select This Room'}
          </button>
        </div>
      </div>

      {/* Expandable Section */}
      {isSelected && (
        <div className="px-4 py-4 border-t border-gray-200 text-left transition-all duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="text-sm font-medium text-gray-600">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                />
              </div>

              <div className="w-full">
                <button
                  onClick={handleOpenConfirm}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition w-full"
                >
                  Update Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MUI Confirm Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 'none',
            px: 3,
            py: 2,
            maxWidth: 400,
            mx: 'auto',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            pb: 1,
          }}
        >
          Confirm Booking Update
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <DialogContentText
            sx={{
              fontSize: '0.875rem',
              color: '#4B5563',
              mb: 2,
            }}
          >
            You’re about to update your booking with the following details:
          </DialogContentText>

          <ul className="text-sm text-gray-700 space-y-1">
            <li><span className="font-medium">Room No:</span> {room.room_number}</li>
            <li><span className="font-medium">People:</span> {numPeople}</li>
            <li><span className="font-medium">Check-in:</span> {checkIn}</li>
            <li><span className="font-medium">Check-out:</span> {checkOut}</li>
          </ul>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            px: 3,
            pb: 2,
            pt: 1,
          }}
        >
          <Button
            onClick={handleCloseConfirm}
            variant="text"
            sx={{
              fontWeight: 500,
              color: '#6B7280',
              textTransform: 'none',
              fontSize: '0.875rem',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFinalConfirm}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              boxShadow: 'none',
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UpdateBookingRoomCard