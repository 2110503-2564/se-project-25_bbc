'use client'

import React, { useEffect, useState } from 'react'
import Image from '@node_modules/next/image';

export const UserProfileTab = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedLogin = localStorage.getItem("res_login");
    // console.log(storedLogin);
    if (storedLogin) {
      const parsedUser = JSON.parse(storedLogin);
      setUser(parsedUser);
    }
  }, []);

  return (
    <div className='relative left-0 top-20 w-[30%] h-[95vh] md:w-[50%] mx-2 hdcard_white overflow-hidden p-5'>
      <h2 className='font-semibold main_text text-3xl mt-5'>Profile</h2>
      <div className='flex flex-col items-center justify-center text-center mt-5'>
        <Image
          src="/icons/profile-user-blue.png"
          alt="profile-icon"
          width={100}
          height={100}
        />
        <h2 className='font-semibold main_text text-[20px] mt-5'>Welcome</h2>
        <h2 className='font-semibold main_text text-[20px]'>
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
  
      <div className='mt-5 border-2 border-blue-500 rounded-lg p-6 break-words'>
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
          className="text-blue-500 font-semibold border-2 border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200"
        >
          Manage Account
        </button>
      </div>
    </div>
  );  
}
