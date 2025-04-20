import { useState } from 'react'
import Image from 'next/image'
import { DialogConfirm } from './DialogConfirm'
import { RoomInfoCard } from './RoomInfoCard'
import { RoomSelectionForm } from '@components/forms/RoomSelectionForm'
import { SuccessDialog } from './SuccessDialog'
import { updateBooking } from '@api/booking'

const UpdateBookingRoomCard = ({ room, token, booking_id, hotel_id }) => {
  const [isSelected, setIsSelected] = useState(false)
  const [numPeople, setNumPeople] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)

  const handleFinalConfirm = async () => {
    try {
      setOpenConfirm(false)
      await updateBooking({
        token,
        booking_id,
        hotel_id,
        room_number: room.room_number,
        num_people: numPeople,
        check_in_date: checkIn,
        check_out_date: checkOut
      })
      setOpenSuccess(true)
    } catch (error) {
      console.error(error)
      alert("Error updating booking")
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      <RoomInfoCard
        room={room}
        isSelected={isSelected}
        onToggle={() => setIsSelected(!isSelected)}
      />

      {isSelected && (
        <RoomSelectionForm
          capacity={room.capacity}
          numPeople={numPeople}
          setNumPeople={setNumPeople}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          onUpdateClick={() => setOpenConfirm(true)}
        />
      )}

      <DialogConfirm
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleFinalConfirm}
        roomNumber={room.room_number}
        numPeople={numPeople}
        checkIn={checkIn}
        checkOut={checkOut}
      />

      <SuccessDialog open={openSuccess} textshow="Update Booking Successful" />
    </div>
  )
}

export default UpdateBookingRoomCard
