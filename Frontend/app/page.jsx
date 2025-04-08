import React from 'react'
import Hero from '@components/Hero'
import { searchHotel } from '@api/hotel'
import HotelList from '@components/lists/HotelList'
import Link from '@node_modules/next/link'

const page = async () => {
  const hotels = await searchHotel("limit=3");
  return (
    <div>
      <Hero/>
      <div className='m-10' style={{textAlign:"center", marginBottom:"100px"}}>
        <h1 className='home_header'>Discover HIDDEN</h1>
        <h2 className='home_subheader'>Your Gateway to Extraordinary Stays</h2>
        <p className='home_text mt-5'>Hidden is a secure, user-friendly hotel booking system that goes beyond the ordinary. Our platform brings you access to rare, unique, and even unknown hotels that the competition simply cannot match. Every property is handpicked to ensure not only a safe and seamless booking experience, but also a stay that is truly unforgettable.</p>
      </div>
      
      <div className='m-10' style={{}}>
        <h2 className='home_subheader'>Handpicked Hotels</h2>
      </div>
      <HotelList Hotels={hotels.hotels}/>
      <div className='flex justify-center'>
        <Link href={"/hotels-page"}>
          <button className='bg-blue-500 text-white font-bold text-[20px] px-5 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition duration-200'>
            More Hotels
          </button>
        </Link>
      </div>
      <div className='m-10' style={{}}>
        <p className='home_text mt-5'>Hidden prides itself on offering a curated selection of hotels that you won't find on other booking platforms. From secluded boutique inns to one-of-a-kind historical retreats, our unique properties promise a stay that is as rare as it is memorable. Let us guide you to destinations where charm meets exclusivity.</p>
      </div>
      
      
    </div>
  )
}

export default page