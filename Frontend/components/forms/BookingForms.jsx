'use client';

import { createBooking } from '@api/booking';
import { useState } from 'react';

export const BookingForms = ({
  hotel_id,
  room_id,
  total_price,
  status = "pending",
  roomCapacity
}) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [successfulMessage, setSuccessfulMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault(); // prevent form refresh
    setSuccessfulMessage('');
    setErrorMessage('');
    setLoading(true);

    try {
      
      const storedToken = localStorage.getItem("token");
      const storedLogin = localStorage.getItem("res_login");
      const parsedLogin = JSON.parse(storedLogin); // json contain data when login

      if (!storedToken) {
        setErrorMessage("No token provided");
        return;
      }

      if(!checkInDate || !checkOutDate){
        setErrorMessage("Please select both check-in and check-out dates.")
        return;
      }

      if(!numPeople){
        setErrorMessage("Please define amount of people.")
        return;
      }

      if(numPeople > roomCapacity){
        setErrorMessage("Amount of people exceed capacity of this room.")
        return;
      }

      await createBooking({
        token:storedToken,
        account_id:parsedLogin.account.id,
        hotel_id:hotel_id,
        room_id:room_id,
        status:status,
        num_people: numPeople,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_price:total_price,
      });

      setSuccessfulMessage("Booking Successful");
    } catch (err) {
      console.log(err)
      console.error(err);
      setErrorMessage(err.message || "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[95vh] p-8 bg-white shadow-lg rounded-2xl max-w-[500px] mt-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Book This Room</h2>

      <p className="text-sm text-gray-500 mb-4">
        Booking cannot exceed <span className="font-semibold text-red-500">4 days</span>
      </p>

      <form className="space-y-4" onSubmit={handleBookingSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
          </label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of People
          </label>
          <input
            type="number"
            min="1"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Book Now"}
        </button>

        {successfulMessage && (
          <p className="text-green-600 font-medium text-sm mt-2">{successfulMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 font-medium text-sm mt-2">{errorMessage}</p>
        )}
      </form>
      {/* Debug */}
      <div>
        <p>{checkInDate}</p>
        <p>{checkOutDate}</p>
        <p>{numPeople}</p>
      </div>
    </div>
  );
};
