"use client";

import { createBooking, uploadReceiptImage } from "@api/booking";
import { use, useEffect, useState } from "react";
import { SuccessDialog } from "@components/cards/SuccessDialog";
import { checkPromocode } from "@api/promoCode";
import PromptPayQR from "@components/payment/PromptPayQR";

export const BookingForms = ({
  hotel_id,
  room_id,
  total_price,
  status = "pending",
  roomCapacity,
  hotelName,
  tel,
  room,
}) => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(room.rate_per_night);
  const [originalPrice, setOriginalPrice] = useState(room.rate_per_night);
  const [successfulMessage, setSuccessfulMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [promocode, setPromocode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);

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
    const dayDifference = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    const calculatedPrice = room.rate_per_night * (dayDifference ? dayDifference : 1);
    setOriginalPrice(calculatedPrice);
    setTotalPrice((calculatedPrice - discount).toFixed(2));
  }, [checkInDate, checkOutDate]);

  const handlePromocodeCheck = async () => {
    setErrorMessage("");
    setSuccessfulMessage("");
    if (!promocode) {
      setErrorMessage("Please enter a promocode.");
      return;
    }
    setLoading(true);

    try {
      const response = await checkPromocode(token, promocode);
      if (response && response.success) {
        const appliedDiscount = response.promoCode?.discountValue || 0;
        setDiscount(appliedDiscount);
        const newTotalPrice = (originalPrice - appliedDiscount).toFixed(2);
        setTotalPrice(newTotalPrice);
        setSuccessfulMessage(`Promocode applied! Discount: ${appliedDiscount}`);
      } else {
        setErrorMessage(response.message || "Invalid promocode");
        setTotalPrice(originalPrice);
        setDiscount(0);
      }
    } catch (error) {
      console.log("Error checking promocode:", error);
      setErrorMessage(error.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault(); // prevent form refresh
    setSuccessfulMessage("");
    setErrorMessage("");
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
      const formData = new FormData();
      formData.append("account_id", user.account.id);
      formData.append("hotel_id", hotel_id);
      formData.append("room_id", room_id);
      formData.append("status", "pending");
      formData.append("check_in_date", checkInDate);
      formData.append("check_out_date", checkOutDate);
      formData.append("num_people", numPeople);
      formData.append("total_price", total_price);
      formData.append("file", file);

      await createBooking(token, formData);

      setSuccessfulMessage("Booking Successful");
      setOpenSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ overflowY: "scroll" }}
      className="w-full hide_scrollbar h-screen p-6 hdcard_white max-w-[500px] mt-20"
    >
      <h2 className="text-2xl font-bold main_text mb-4">Book This Room</h2>

      <p className="text-sm sub_text mb-4">
        Booking cannot exceed{" "}
        <span className="font-semibold text-black">4 days</span>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Promotion Code
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              disabled={loading}
              className="w-3/4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handlePromocodeCheck}
              className="ml-2 bg-blue-500 text-white w-1/4 py-2 text-sm rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              Check Code
            </button>
          </div>
        </div>

        {successfulMessage && (
          <p className="text-green-600 font-medium text-sm mt-2">
            {successfulMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-600 font-medium text-sm mt-2">
            {errorMessage}
          </p>
        )}

        {/* Detail of Booking */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold main_text mb-2">
            Confirmation Detail of Booking
          </h2>
          <p className="text-sm sub_text mb-4">
            <span className="font-semibold text-red-500 underline">
              Make sure
            </span>{" "}
            before starting your booking.
          </p>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">Name:</td>
                <td className="sub_text font-light">
                  {user
                    ? `${user.account.first_name} ${user.account.last_name}`
                    : "-"}
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
                <td className="font-semibold main_text pr-4 py-1">
                  Total Guest:
                </td>
                <td className="sub_text font-light">{`${numPeople} person`}</td>
              </tr>
              <tr>
                <td className="font-semibold main_text pr-4 py-1">
                  Total Price*:
                </td>
                <td className="sub_text font-light">
                  {discount > 0 ? (
                    <>
                      <span className="line-through text-red-500">
                        ${originalPrice}
                      </span>
                      &nbsp;&nbsp;&nbsp;
                      <span className="font-semibold text-black">
                        ${totalPrice}{" "}
                      </span>
                    </>
                  ) : (
                    `${totalPrice} $`
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="card_bg2 p-2 flex justify-center  rounded-lg mt-3">
            <PromptPayQR phone={tel} size={120} amount={totalPrice} />
            <div className="ml-2">
              <div className=" main_text font-semibold">Upload receipt</div>
              <input
                type="file"
                name="photo"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 w-full py-2 hover:bg-blue-600 transition-all text-center  rounded-md"
        >
          <p>{loading ? "Processing..." : "Book Now"}</p>
        </button>
      </form>

      <SuccessDialog
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        textshow={successfulMessage}
      />
    </div>
  );
};
