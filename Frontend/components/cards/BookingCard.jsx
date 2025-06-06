"use client";

import React, { useEffect, useState } from "react";
import { changeBookingStatus } from "@api/booking";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const BookingCard = ({ booking }) => {
  const [hotel, setHotel] = useState(booking.hotel_id);
  const [room, setRoom] = useState(booking.room_id);
  const [status, setStatus] = useState(booking.status);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [ownerBooking, setOwnerBookingName] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    console.log("Booking:", booking);
    if (booking.account_id && booking.account_id.first_name && booking.account_id.last_name) {
      const fullName = `${booking.account_id.first_name} ${booking.account_id.last_name}`;
      setOwnerBookingName(fullName);
      console.log("Owner booking name set to:", fullName);
    }
    const storedLogin = localStorage.getItem("res_login");
    if (storedLogin) {
      const parsedUser = JSON.parse(storedLogin);
      setUser(parsedUser);
    }
  }, []);

  // Function to update booking status
  const handleUpdateStatus = async (newStatus) => {
    const booking_id = booking._id;
    console.log(booking_id);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token is missing or expired");
      if (!booking_id) throw new Error("Booking ID is invalid or missing");

      const response = await changeBookingStatus({
        booking_id,
        new_status: newStatus,
        token,
        role: user?.account?.role,
      });

      if (!response || !response.success) {
        throw new Error("Booking not found or status update failed");
      }

      setStatus(newStatus); // Update the status on UI
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.message || "Error updating booking status.");
    }
  };

  const handleManageBooking = () => {
    if (isClient) {
      router.push(
        `/my-booking-page/manage-booking-page?booking_id=${booking._id}`
      );
    }
  };

  const handlePayment = () => {
    if (isClient) {
      router.push(
        `/my-booking-page/payment-page?tel=${hotel.tel}&booking_id=${booking._id}&total_price=${booking.total_price}&status=${booking.status}`
      );
    }
  };

  if (!isClient) return null;

  const userRole = user?.account?.role;

  return (
    <div
      style={{ position: "relative", overflow: "hidden", height: "450px" }}
      className="rounded-lg card_bg2 p-6 mb-4 bg-white text-gray-600"
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          bottom: "20px",
        }}
      >
        <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm text-gray-600">
          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Name
          </div>
          <div className="ml-[150px]  bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {ownerBooking}
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Hotel
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {hotel?.name}
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Room
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {room?.room_number}
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            People
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {booking.num_people}
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Check-in
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {new Date(booking.check_in_date).toLocaleDateString()}
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Check-out
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {new Date(booking.check_out_date).toLocaleDateString()}
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Status
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[6px] pt-[6px]">
            <span
              className={`font-semibold capitalize px-2 py-1 rounded ${
                status === "pending"
                  ? "text-yellow-600 bg-yellow-100"
                  : status === "accepted"
                  ? "text-green-600 bg-green-100"
                  : status === "rejected"
                  ? "text-red-600 bg-red-100"
                  : status === "canceled"
                  ? "text-gray-600 bg-gray-200"
                  : status === "finished"
                  ? "text-blue-600 bg-blue-100"
                  : ""
              }`}
            >
              {status}
            </span>
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Created at
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>

          <div className="font-semibold m-[1px] bg-white rounded-[5px] p-[5px] text-blue-500">
            Booking ID
          </div>
          <div className="ml-[150px] bg-white rounded-[5px] pl-[10px] pt-[5px]">
            {booking._id}
          </div>
        </div>

        <div className="mt-4 flex justify-end flex-row space-x-2">
          {["hotel_admin", "super_admin"].includes(userRole) &&
            status === "pending" && (
              <>
                <button
                  onClick={() => handleUpdateStatus("accepted")}
                  className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-all flex items-center rounded-md"
                >
                  <p>Accept</p>
                </button>

                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-all flex items-center rounded-md"
                >
                  <p>Reject</p>
                </button>
              </>
            )}
            {["user", "super_admin"].includes(userRole) &&
            status === "accepted" && (
              <>
                <button
                  onClick={() => handleUpdateStatus("canceled")}
                  className="bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition-all flex items-center rounded-md"
                >
                  <p>Canceled</p>
                </button>
              </>
          )}

          {["hotel_admin", "super_admin"].includes(userRole) &&
            status === "accepted" && (
              <>
                <button
                  onClick={() => handleUpdateStatus("finished")}
                  className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-all flex items-center rounded-md"
                >
                  <p>Finished</p>
                </button>
                </>
          )}

          {booking.receiptUrl === "" ? (
            <button
              onClick={handlePayment}
              className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-all flex items-center rounded-md"
            >
              <p>Payment</p>
              <img
                src="/icons/wallet-cards.svg"
                alt="wallet"
                width={15}
                height={15}
                className="ml-2"
              />
            </button>
          ) : (
          <button
            onClick={() => setShowReceipt(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 transition-all flex items-center rounded-md"
          >
            <p>Attached</p>
            <img
              src="/icons/wallet-cards.svg"
              alt="wallet"
              width={15}
              height={15}
              className="ml-2"
            />
          </button>
          )}

          {showReceipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="bg-white p-6 rounded-xl shadow-xl w-[400px] max-w-[90%] relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-500 pb-2">
                  📄 Receipt Preview
                </h2>
                <img
                  src={booking.receiptUrl}
                  alt="Receipt"
                  className="w-full h-auto rounded-lg border"
                />
                <button
                  onClick={() => setShowReceipt(false)}
                  className="absolute top-2 right-2 text-blue-500 hover:text-red-500 text-2xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            </div>
          )}


          <button
            onClick={handleManageBooking}
            className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-all flex items-center rounded-md"
          >
            <p>Manage Booking</p>
            <img
              src="/icons/pencil.svg"
              alt="pencil-white"
              width={15}
              height={15}
              className="ml-2"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
