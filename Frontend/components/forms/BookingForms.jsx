'use client';

import { createBooking } from '@api/booking';
import { useEffect, useState } from 'react';

export const BookingForms = ({
  hotel_id,
  room_id,
  total_price,
  status = "pending",
  roomCapacity,
  hotelName,
  room
}) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(room.rate_per_night);
  const [successfulMessage, setSuccessfulMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedLogin = localStorage.getItem("res_login");
    try {
      const parsedLogin = JSON.parse(storedLogin);
      setToken(storedToken);
      setUser(parsedLogin);
    } catch (err) {
      console.error("Failed to parse login info:", err);
    }
  }, []);

  useEffect(() => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const dayDifference = (checkOut - checkIn)/(1000 * 60 * 60 * 24);
    setTotalPrice((room.rate_per_night*(dayDifference?dayDifference:1)).toFixed(2)); 
  },[checkInDate, checkOutDate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault(); // prevent form refresh
    setSuccessfulMessage('');
    setErrorMessage('');
    setLoading(true);

    if (!token || !user?.account?.id) {
      setErrorMessage("Authentication error. Please log in again.");
      setLoading(false);
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select both check-in and check-out dates.");
      setLoading(false);
      return;
    }

    if (!numPeople) {
      setErrorMessage("Please fill amount of people.");
      setLoading(false);
      return;
    }

    if (checkInDate >= checkOutDate) {
      setErrorMessage("Check In date must be before Check Out date.");
      setLoading(false);
      return;
    }

    if (Number(numPeople) > Number(roomCapacity)) {
      setErrorMessage("Amount of people exceed capacity of this room.");
      setLoading(false);
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const dayDifference = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

    if (dayDifference > 3) {
      setErrorMessage("Booking cannot exceed 4 days");
      setLoading(false);
      return;
    }

    try {
      await createBooking({
        token: token,
        account_id: user.account.id,
        hotel_id: hotel_id,
        room_id: room_id,
        status: status,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numPeople: numPeople,
        total_price: total_price,
      });

      setSuccessfulMessage("Booking Successful");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[95vh] p-8 hdcard_white max-w-[500px] mt-20">
      <h2 className="text-2xl font-bold main_text mb-4">Book This Room</h2>

      <p className="text-sm sub_text mb-4">
        Booking cannot exceed <span className="font-semibold text-black">4 days</span>
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

        {successfulMessage && (
          <p className="text-green-600 font-medium text-sm mt-2">{successfulMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 font-medium text-sm mt-2">{errorMessage}</p>
        )}

        {/* Detail of Booking */}
        <div className='mt-20 mb-10'>
          <h2 className="text-2xl font-bold main_text mb-2">Confirmation Detail of Booking</h2>
          <p className="text-sm sub_text mb-4">
            <span className="font-semibold text-red-500 underline">Make sure</span> before starting your booking.
          </p>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Name:</td>
                <td className="sub_text font-light">
                  {user ? `${user.account.first_name} ${user.account.last_name}` : "-"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Hotel:</td>
                <td className="sub_text font-light">{hotelName}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Room:</td>
                <td className="sub_text font-light">{`${room.room_number} ${room.type}`}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Total Guest:</td>
                <td className="sub_text font-light">{`${numPeople} person`}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Total Price*:</td>
                <td className="sub_text font-light">{`${totalPrice} $`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="w-full main_bg text-white py-2 rounded hover:main_bg transition duration-200"
          style={{borderRadius:"20px"}}
        >
          {loading ? "Processing..." : "Book Now"}
        </button>
      </form>
    </div>
  );
};
