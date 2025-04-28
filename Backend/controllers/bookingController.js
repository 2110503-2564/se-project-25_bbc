import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Notification from "../models/Notification.js";
import { getSocketInstance } from "../config/socket.js";

export const searchBooking = async (req, res) => {
  try {
    const { select, populate, ...filters } = req.query;

    // Build the query with filters
    let query = Booking.find(filters);

    // Handle selection
    if (select) {
      const fieldsToSelect = select.split(",").join(" ");
      query = query.select(fieldsToSelect);
    }

    // Handle populate
    if (populate) {
      const populateFields = populate.split(",");
      populateFields.forEach((field) => {
        let [popField, popSelect] = field.split(":");
        if (popSelect)
          query = query.populate({
            path: popField,
            select: popSelect.split(";").join(" "),
          });
        else query = query.populate(popField);
      });
    }

    // Execute the query
    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const uploadReceipt = async (req, res) => {
  try{
    if(!req.file) return res.status(404).json({ success: false, message: "File not found." });
    
    const filePath = `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`;
    req.body.receiptUrl = filePath;

    const booking = await Booking.findByIdAndUpdate(
      req.params.booking_id,
      { $set: { receiptUrl: filePath } },
      { new: true , runValidators: true}
    );

    return res.status(201).json({
      success: true,
      booking
    });

  } catch(error){
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const createBooking = async (req, res) => {
  try {
    req.body.account_id =
      req.user.role === "user" ? req.user.id : req.body.account_id;

    req.body.hotel_id =
      req.user.role === "hotel_admin" ? req.user.hotel_id : req.body.hotel_id;

    const { account_id, hotel_id, room_id, check_in_date, check_out_date } =
      req.body;

    if (req.body.room.hotel_id.toString() !== req.body.hotel_id.toString())
      return res.status(400).json({
        success: false,
        message: "This room does not belong to the specified hotel.",
      });

    const overlapping = await Booking.findOne({
      hotel_id,
      room_id,
      account_id,
      status: { $in: ["pending", "accepted", "confirmed"] },
      $or: [
        {
          check_in_date: { $lt: new Date(check_out_date) },
          check_out_date: { $gt: new Date(check_in_date) },
        },
      ],
    });

    if (overlapping)
      return res.status(400).json({
        success: false,
        message:
          "You already have a booking for this room during the selected time.",
      });

    if (req.file) {
      const filePath = `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`;
      req.body.receiptUrl = filePath;
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const acceptedBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });

    const hotel_id = booking.hotel_id.toString();

    if (
      req.user.role === "hotel_admin" &&
      req.user.hotel_id.toString() !== hotel_id
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to accept this booking.",
      });
    }

    booking.status = "accepted";
    await booking.save();

    const hotel = await Hotel.findById(hotel_id);
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found." });

    const notification = await Notification.create({
      hotel_id: hotel_id,
      account_id: booking.account_id,
      head: `Booking accepted!`,
      detail: `Your Booking at ${hotel.name} was accepted`,
      type: "booking",
    });

    const io = getSocketInstance();
    io.to(`account_${booking.account_id.toString()}`).emit(
      "receive_notification",
      notification
    );

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const rejectedBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    const hotel_id = booking.hotel_id.toString();

    if (
      req.user.role === "hotel_admin" &&
      req.user.hotel_id.toString() !== hotel_id
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to reject this booking.",
      });
    }

    booking.status = "rejected";
    await booking.save();

    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found." });
    }

    const notification = await Notification.create({
      hotel_id,
      account_id: booking.account_id,
      head: `Booking rejected!`,
      detail: `Your booking at ${hotel.name} was rejected.`,
      type: "booking",
    });

    const io = getSocketInstance();
    io.to(`account_${booking.account_id.toString()}`).emit(
      "receive_notification",
      notification
    );

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const canceledBooking = async (req, res) => {
  try {

    const booking = await Booking.findOneAndUpdate(
      { _id: req.body.booking_id},
      { status: "canceled" },
      { new: true, runValidators: true }
    );

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const finishedBooking = async (req, res) => {
  try {
    const hotel_id = req.user.hotel_id || req.body.hotel_id;

    if (
      req.user.role === "hotel_admin" &&
      req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString()
    )
      return res.status(403).json({
        success: false,
        message: "You do not have permission to finish this booking.",
      });

    const booking = await Booking.findOneAndUpdate(
      { _id: req.body.booking_id, hotel_id },
      { status: "finished" },
      { new: true, runValidators: true }
    );

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });

    const io = getSocketInstance();
    const hotel = await Hotel.findById(hotel_id);
    const notification = await Notification.create({
      hotel_id: hotel_id,
      account_id: booking.account_id,
      head: `Booking finished!`,
      detail: `Your Booking at ${hotel.name} was finished`,
      type: "booking",
    });
    io.to(`account_${booking.account_id.toString()}`).emit(
      "receive_notification",
      notification
    );

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const hotel_id = req.user.hotel_id || req.body.hotel_id;
    const booking_id = req.body.booking_id || req.params.booking_id

    if (
      req.user.role === "hotel_admin" &&
      req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString()
    )
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this booking.",
      });

    const booking = await Booking.findOneAndDelete({
      _id: booking_id,
    });

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.booking_id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.booking_id}`,
      });
    }

    if (req.user.role === "user") {
      // Check if user is owner of booking
      if (booking.account_id.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: `The account with ID ${req.user.id} is not authorized to update this booking`,
        });
      }

      // Handle hotel change - users cannot change hotel

      if (
        req.body.hotel_id &&
        req.body.hotel_id !== booking.hotel_id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: `To update hotel, you must delete this booking and create a new one`,
        });
      }

      if (booking.status === "accept" || booking.status === "reject") {
        return res.status(403).json({
          success: false,
          message: `Cannot update booking status is ${booking.status} , you need to delete and create new booking`,
        });
      }

      // Allow user to update these fields
      const { room_number, check_in_date, check_out_date, num_people } =
        req.body;
      let updateCheckInDate = check_in_date || booking.check_in_date;
      let updateCheckOutDate = check_out_date || booking.check_out_date;
      let updateNumPeople = num_people || booking.num_people;

      if (updateCheckInDate && updateCheckOutDate) {
        const checkInDate = new Date(updateCheckInDate);
        const checkOutDate = new Date(updateCheckOutDate);

        // Ensure check-out date is after check-in date
        if (checkOutDate <= checkInDate) {
          return res.status(400).json({
            success: false,
            message: `The check-out date must be greater than check-in date`,
          });
        }

        // Ensure the booking duration is at most 3 nights (4 days)
        if (!isBookingDurationValid(updateCheckInDate, updateCheckOutDate)) {
          return res.status(400).json({
            success: false,
            message: `The booking duration must be less than or equal to 3 nights (4 days)`,
          });
        }

        // Check if the room number in the current hotel is available for the new dates
        const room = await Room.findOne({
          room_number,
          hotel_id: booking.hotel_id,
        });
        if (!room) {
          return res.status(404).json({
            success: false,
            message: `No room with room number ${room_number} in this hotel`,
          });
        }

        // Check if room is available for the new dates
        // if (!await isRoomAvailable(room.id, booking.hotel_id, updateCheckInDate, updateCheckOutDate,booking._id)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `The room is not available for the selected dates`
        //     });
        // }

        // Check room capacity
        if (!(await isRoomCapacityValid(room.id, updateNumPeople))) {
          return res.status(400).json({
            success: false,
            message: `The room with id ${room_number} cannot handle ${updateNumPeople} people`,
          });
        }

        // Update booking with new details
        booking.check_in_date = updateCheckInDate;
        booking.check_out_date = updateCheckOutDate;
        booking.room_id = room.id;
        booking.num_people = updateNumPeople;
      } else if (room_number) {
        // Check if room number is valid and available
        const room = await Room.findOne({
          room_number,
          hotel_id: booking.hotel_id,
        });
        if (!room) {
          return res.status(404).json({
            success: false,
            message: `No room with room number ${room_number} in this hotel`,
          });
        }

        if (
          !(await isRoomAvailable(
            room.id,
            booking.hotel_id,
            booking.check_in_date,
            booking.check_out_date,
            booking._id
          ))
        ) {
          return res.status(400).json({
            success: false,
            message: `The room is not available for the selected dates`,
          });
        }

        // Update room number and check room capacity
        if (!(await isRoomCapacityValid(room.id, booking.num_people))) {
          return res.status(400).json({
            success: false,
            message: `The room with id ${room_number} cannot handle ${booking.num_people} people`,
          });
        }

        booking.room_id = room.id;
      }

      // If user is updating the number of people, check the room capacity
      if (
        updateNumPeople &&
        !(await isRoomCapacityValid(booking.room_id, updateNumPeople))
      ) {
        return res.status(400).json({
          success: false,
          message: `The room with id ${booking.room_id.room_number} cannot handle ${updateNumPeople} people`,
        });
      }

      await booking.save();
      return res.status(200).json({
        success: true,
        message: `Booking updated successfully`,
        booking,
      });
    } else if (req.user.role === "hotel_admin") {
      // Ensure hotel admin can only update bookings in their hotel
      if (booking.hotel_id.toString() !== req.user.hotel_id.toString()) {
        return res.status(403).json({
          success: false,
          message: `Hotel Admin can only update bookings in their own hotel`,
        });
      }

      // Hotel admins can update the booking status
      if (req.body.status) {
        if (!["pending", "accept", "reject"].includes(req.body.status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status value. Allowed values: pending, accept, reject`,
          });
        }
        booking.status = req.body.status;
      }

      // Allow hotel admin to update room number and check-in/check-out dates
      if (req.body.room_number) {
        const room = await Room.findOne({
          room_number: req.body.room_number,
          hotel_id: req.user.hotel_id,
        });
        if (!room) {
          return res.status(404).json({
            success: false,
            message: `No room with room number ${req.body.room_number} in this hotel`,
          });
        }

        if (
          !(await isRoomAvailable(
            room.id,
            req.user.hotel_id,
            booking.check_in_date,
            booking.check_out_date,
            booking._id
          ))
        ) {
          return res.status(400).json({
            success: false,
            message: `The room is not available for the selected dates`,
          });
        }

        if (!(await isRoomCapacityValid(room.id, booking.num_people))) {
          return res.status(400).json({
            success: false,
            message: `The room with id ${room_number} cannot handle ${booking.num_people} people`,
          });
        }

        booking.room_id = room.id;
      }

      if (req.body.check_in_date && req.body.check_out_date) {
        const checkInDate = new Date(req.body.check_in_date);
        const checkOutDate = new Date(req.body.check_out_date);

        if (checkOutDate <= checkInDate) {
          return res.status(400).json({
            success: false,
            message: `The check-out date must be greater than check-in date`,
          });
        }

        booking.check_in_date = req.body.check_in_date;
        booking.check_out_date = req.body.check_out_date;
      }

      await booking.save();
      return res.status(200).json({
        success: true,
        message: `Booking updated successfully`,
        booking,
      });
    } else if (req.user.role === "super_admin") {
      // Super admin can update freely
      if (req.body.check_in_date && req.body.check_out_date) {
        const checkInDate = new Date(req.body.check_in_date);
        const checkOutDate = new Date(req.body.check_out_date);

        if (checkOutDate <= checkInDate) {
          return res.status(400).json({
            success: false,
            message: `The check-out date must be greater than check-in date`,
          });
        }

        booking.check_in_date = req.body.check_in_date;
        booking.check_out_date = req.body.check_out_date;
      }

      booking.status = req.body.status || booking.status;
      booking.num_people = req.body.num_people || booking.num_people;
      booking.hotel_id = req.body.hotel_id || booking.hotel_id;

      if (req.body.room_number) {
        const room = await Room.findOne({
          room_number: req.body.room_number,
          hotel_id: booking.hotel_id,
        });
        if (!room) {
          return res.status(404).json({
            success: false,
            message: `No room with room number ${req.body.room_number} in this hotel`,
          });
        }

        if (
          !(await isRoomAvailable(
            room.id,
            booking.hotel_id,
            booking.check_in_date,
            booking.check_out_date,
            booking._id
          ))
        ) {
          return res.status(400).json({
            success: false,
            message: `The room is not available for the selected dates`,
          });
        }

        if (!(await isRoomCapacityValid(room.id, booking.num_people))) {
          return res.status(400).json({
            success: false,
            message: `The room with id ${room_number} cannot handle ${booking.num_people} people`,
          });
        }

        booking.room_id = room.id;
      }

      await booking.save();
      return res.status(200).json({
        success: true,
        message: `Booking updated successfully`,
        booking,
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      success: false,
      message: "Cannot update booking",
      error: err.stack,
    });
  }
};

const isBookingDurationValid = (check_in, check_out) => {
  const check_in_date = new Date(check_in);
  const check_out_date = new Date(check_out);
  const diffTime = Math.abs(check_out_date - check_in_date);
  // for example have live at hotel day 1 - day 4 => 4-1 => 3 nights
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log("Nights :", diffDays);
  return diffDays <= 3;
};

const isRoomCapacityValid = async (room_id, num_people) => {
  const room = await Room.findById(room_id);
  if (!room) {
    throw new Error(`No room with id ${room_id}`);
  }
  return num_people <= room.capacity;
};

const isRoomAvailable = async (
  room_id,
  hotel_id,
  check_in_date,
  check_out_date,
  bookingIdToExclude = null
) => {
  const query = {
    room_id,
    hotel_id,
    $or: [
      {
        check_in_date: { $lt: check_out_date },
        check_out_date: { $gt: check_in_date },
      }, // General overlap
    ],
  };

  // Exclude the current booking when updating
  if (bookingIdToExclude) {
    query._id = { $ne: bookingIdToExclude };
  }

  const conflictingBookings = await Booking.find(query);
  return conflictingBookings.length === 0; // If no conflicts, room is available
};
