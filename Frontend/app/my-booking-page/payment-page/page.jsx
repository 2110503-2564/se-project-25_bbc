import React from 'react'
import { PaymentFrom } from '@components/forms/PaymentForm'
const page = () => {
  return (
    <div style={{marginBottom:"200px"}} className='bg-gradient-to-b from-blue-500 to-white min-h-screen flex p-4'>
      <PaymentFrom />
    </div>
  )
}

export default page