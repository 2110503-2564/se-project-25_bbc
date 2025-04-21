'use client'

import React, { useEffect, useState } from 'react'
import Image from '@node_modules/next/image';
import Link from '@node_modules/next/link';

export const UserProfileTab = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl mb-3">Sign-In for Booking Hotel</h2>
          <Link href="/auth/signin">
            <span className="main_bg" style={{color:"white", padding:"5px", paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px"}}>Sign-In</span>
          </Link>
        </div>
      </div>
    )
  } 
  
  return (
    <div className='relative left-0 top-22 mb-2 lg:mb-0 lg:w-[30%] lg:h-screen md:w-[50%] lg:mr-2 lg:sticky hdcard_white overflow-hidden p-5'>
      <h2 className='font-semibold text-3xl mt-5'>Profile</h2>
      <div className='flex flex-col items-center justify-center text-center mt-5'>
        <Image
          src="/icons/profile-user-blue.png"
          alt="profile-icon"
          width={100}
          height={100}
        />
        <h2 className='font-semibold sub_text text-[20px] mt-5'>Welcome</h2>
        <h2 className='font-semibold sub_text  text-[20px]'>
          {user && (
            <>
              <span className="text-red-500 capitalize">
                {['hotel_admin', 'super_admin'].includes(user.account.role) ? user.account.role.replace('_', ' ') : ''}
              </span>{' '}
              {user.account.first_name} {user.account.last_name}
            </>
          )}
        </h2>
      </div>
  
      <div className='mt-5 rounded-lg p-6 break-words'>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-xs sm:text-sm md:text-sm">
            <tbody>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Name:</td>
                <td className="sub_text font-light">
                  {user && user.account.first_name} {user && user.account.last_name}
                </td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Tel:</td>
                <td className="sub_text font-light">{user && user.account.tel}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Email:</td>
                <td className="sub_text font-light">{user && user.account.email}</td>
              </tr>

              {user && ['hotel_admin', 'super_admin'].includes(user.account.role) && (
                <tr>
                  <td className="font-semibold main_text pr-4 py-1">Role:</td>
                  <td className="sub_text font-light text-red-500 capitalize">
                    {user.account.role.replace('_', ' ')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

  
      <div className="mt-4 flex justify-center">
        <button
          className="text-blue-500 font-semibold border-2 border-blue-500 px-4 py-2 rounded-4xl hover:bg-blue-500 hover:text-white transition-all duration-200"
        >
          Manage Account
        </button>
      </div>
    </div>
  );  
}
