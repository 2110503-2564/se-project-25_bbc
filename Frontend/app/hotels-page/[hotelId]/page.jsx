import React from 'react'

const page = ({ params }) => {
  const { hotelId } = params;
  return (
    <div>{hotelId}</div>
  )
}

export default page