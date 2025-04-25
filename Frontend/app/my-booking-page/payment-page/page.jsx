import React from 'react'
import { PaymentForm } from '@components/forms/PaymentForm'

const page = ({ searchParams }) => {

  // params
  const { booking_id, tel, total_price } = searchParams
  return (
    <div style={{ marginBottom: "200px" }} className="bg-gradient-to-b from-blue-500 to-white min-h-screen flex items-center justify-center p-4">
      <PaymentForm tel={tel} booking_id={booking_id} totalPrice={total_price} />
    </div>
  )
}

export default page