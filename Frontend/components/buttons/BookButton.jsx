'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const BookButton = ({ room }) => {
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setHasToken(!!token)
  }, [])

  if (!room.isAvailable) {
    return (
      <div className='un_bg align_item_center'
        style={{
          position: "absolute", borderRadius: "20px", color: "white",
          bottom: "10px", right: "10px", width: "90px", padding: "2px"
        }}>
        <span>&nbsp;Book&nbsp;&nbsp;</span>
        <img src='/icons/tickets.svg' alt='ticket' width="20px" />
      </div>
    )
  }

  return (
    <Link href={hasToken ? `/rooms-page/${room._id}` : `/auth/signin`}>
      <div className='main_bg align_item_center'
        style={{
          position: "absolute", borderRadius: "20px", color: "white",
          bottom: "10px", right: "10px", width: "90px", padding: "2px"
        }}>
        <span>&nbsp;Book&nbsp;&nbsp;</span>
        <img src='/icons/tickets.svg' alt='ticket' width="20px" />
      </div>
    </Link>
  )
}

export default BookButton
