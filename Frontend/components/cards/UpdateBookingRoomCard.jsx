"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DialogConfirm } from "./DialogConfirm";
import { RoomInfoCard } from "./RoomInfoCard";
import { RoomSelectionForm } from "@components/forms/RoomSelectionForm";
import { SuccessDialog } from "./SuccessDialog";
import HotelInfoCard from "@components/cards/HotelInfoCard";
import { updateBooking, updateHotelName } from "@api/booking";

const UpdateBookingRoomCard = ({
  token,
  booking_id,
  room,
  hotel_id,
  hotel,
  hotels = [],
  rooms = [],
}) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isSelected, setIsSelected] = useState(false);
  const [numPeople, setNumPeople] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [hotelName, setHotelName] = useState("");

  // super-admin
  const [expandedHotelId, setExpandedHotelId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("res_login");
    if (stored) {
      const { account } = JSON.parse(stored);
      setUserRole(account?.role || null);
    }
    setIsLoading(false);
  }, []);

  const handleFinalConfirm = async () => {
    const targetHotelId =
      userRole === "super-admin" ? expandedHotelId : hotel_id;
    const targetRoom =
      userRole === "super-admin"
        ? rooms.find((r) => r._id === selectedRoomId)
        : room;

    if (!targetHotelId || !targetRoom) {
      return;
    }

    try {
      setOpenConfirm(false);
      await updateBooking({
        token,
        booking_id,
        hotel_id: targetHotelId,
        room_number: targetRoom.room_number,
        num_people: numPeople,
        check_in_date: checkIn,
        check_out_date: checkOut,
      });
      setOpenSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error updating booking");
    }
  };

  const handleHotelNameChange = (e) => {
    setHotelName(e.target.value);
  };

  const handleHotelUpdate = async (hotelId) => {
    try {
      await updateHotelName({ token, hotelId, newName: hotelName });
      setOpenSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error updating hotel name");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  // user / hotel-admin
  if (userRole === "user" || userRole === "hotel-admin") {
    return (
      <div className="rounded-2xl overflow-hidden">
        <RoomInfoCard
          room={room}
          isSelected={isSelected}
          onToggle={() => setIsSelected((s) => !s)}
        />

        <AnimatePresence>
          {isSelected && (
            <motion.div
              key="form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <RoomSelectionForm
                capacity={room.capacity}
                numPeople={numPeople}
                setNumPeople={setNumPeople}
                checkIn={checkIn}
                setCheckIn={setCheckIn}
                checkOut={checkOut}
                setCheckOut={setCheckOut}
                onUpdateClick={() => setOpenConfirm(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <DialogConfirm
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleFinalConfirm}
          roomNumber={room.room_number}
          numPeople={numPeople}
          checkIn={checkIn}
          checkOut={checkOut}
        />

        <SuccessDialog
          open={openSuccess}
          textshow="Update Booking Successful"
        />
      </div>
    );
  }

  // super-admin ========================================
  const selectedHotelName = (() => {
      const selectedRoom = rooms.find((r) => r._id === selectedRoomId);
      if (selectedRoom) {
        const hotel = hotels.find((h) => h._id === selectedRoom.hotel_id);
        return hotel?.name || "";
      }
      return "";
    return hotel?.name || "";
  })();
  

  return (
    <div style={{ padding: "10px 0" }}>
      {hotels.map((h) => {
        const isHotelOpen = expandedHotelId === h._id;
        const hotelRooms = rooms.filter((r) => r.hotel_id?.toString() === h._id?.toString());

        return (
          <div key={h._id} className="mb-6">
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                setExpandedHotelId((prev) => (prev === h._id ? null : h._id))
              }
            >
              <HotelInfoCard hotel={h} />
            </div>

            {isHotelOpen && userRole === "super-admin" && (
              <div style={{ paddingLeft: "16px" }}>
                <input
                  type="text"
                  value={hotelName} 
                  onChange={handleHotelNameChange} 
                  placeholder="Enter new hotel name"
                  style={{ marginBottom: "8px", padding: "8px" }}
                />
                <button onClick={() => handleHotelUpdate(h._id)}>Update Hotel Name</button>
              </div>
            )}

            <AnimatePresence>
              {isHotelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden", paddingLeft: "16px" }}
                >
                  {hotelRooms.map((r) => {
                    const isRoomOpen = selectedRoomId === r._id;
                    return (
                      <div key={r._id} className="mb-4">
                        <RoomInfoCard
                          room={r}
                          isSelected={isRoomOpen}
                          onToggle={() =>
                            setSelectedRoomId((prev) =>
                              prev === r._id ? null : r._id
                            )
                          }
                        />

                        <AnimatePresence>
                          {isRoomOpen && (
                            <motion.div
                              key="form"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{
                                overflow: "hidden",
                                marginTop: "8px",
                              }}
                            >
                              <RoomSelectionForm
                                capacity={r.capacity}
                                numPeople={numPeople}
                                setNumPeople={setNumPeople}
                                checkIn={checkIn}
                                setCheckIn={setCheckIn}
                                checkOut={checkOut}
                                setCheckOut={setCheckOut}
                                onUpdateClick={() => setOpenConfirm(true)}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <DialogConfirm
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleFinalConfirm}
        roomNumber={
          rooms.find((r) => r._id === selectedRoomId)?.room_number || ""
        }
        numPeople={numPeople}
        checkIn={checkIn}
        checkOut={checkOut}
        hotelName={selectedHotelName}
      />

      <SuccessDialog
        open={openSuccess}
        textshow="Update Booking Successful"
      />
    </div>
  );
};

export default UpdateBookingRoomCard;
