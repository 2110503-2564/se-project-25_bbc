import React from 'react'

const page = ({ params }) => {
  const { roomId } = params;
  return (
    <div>{roomId}</div>
  )
}

export default page