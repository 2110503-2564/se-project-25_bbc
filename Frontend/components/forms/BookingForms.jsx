'use client';

import { useState } from 'react';

export const BookingForms = ({
  account_id,
  hotel_id,
  room_id,
  total_price = 0,
  status = "pending",
}) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numPeople, setNumPeople] = useState(1);

  return (
    <div className="w-full h-[95vh] p-8 hdcard_white max-w-[500px] mt-20">
      <h2 className="text-2xl font-bold main_text mb-4">Book This Room</h2>

      <p className="text-sm text-gray-500 mb-4">
        Booking cannot exceed <span className="font-semibold text-red-500">4 days</span>
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full main_bg text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Book Now
        </button>
      </form>

      {/* Debugging Info */}
      <div className="mt-6 text-sm sub_text space-y-1">
        <p><strong>account_id:</strong> {account_id}</p>
        <p><strong>hotel_id:</strong> {hotel_id}</p>
        <p><strong>room_id:</strong> {room_id}</p>
        <p><strong>status:</strong> {status}</p>
        <p><strong>total_price:</strong> ${total_price}</p>
      </div>
    </div>
  );
};
