import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Account from "../models/Account.js";

export const accountExist = async (req, res, next) => {
    try {
        const { email, tel } = req.body;

        const existingAccount = await Account.findOne({
            $or: [{ email }, { tel }]
        });

        if (existingAccount) {
            return res.status(409).json({
                success: false,
                message: "Account with provided email or telephone already exists"
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error checking account existence",
            error: error.message
        });
    }
};

export const hotelExist = async(req, res, next) => {

    const hotel_id = req.params.hotel_id || req.body.hotel_id;

    try {
        const hotel = await Hotel.findById(hotel_id);
        if (!hotel) return res.status(404).json({ message: `Cannot find hotel with id: ${hotel_id}` });
        req.body.hotel = hotel;
        next();
    } catch (err) {
        res.status(500).json({message : "Hotel existence validation error" , error : err.message});
    }
}

export const roomExist = async(req, res, next) => {

    const room_id = req.params.room_id || req.body.room_id;

    try {
        const room = await Room.findById(room_id);
        if (!room) return res.status(404).json({ message: `Cannot find room with id: ${room_id}` });
        req.body.room = room;
        next();
    } catch (err) {
        res.status(500).json({message : "Room existence validation error" , error : err.message});
    }
}

export const bookingExist = async (req, res, next) => {
    const booking_id = req.params.booking_id ?? req.body.booking_id;
        console.log("🔍 req.params.booking_id:", req.params.booking_id);
        console.log("🧾 req.body.booking_id:", req.body.booking_id);
    console.log("🔍 Checking Booking ID:", booking_id);

    if (!booking_id) {
        console.log("⛔ booking_id is missing");
        return res.status(400).json({ message: "Booking ID is required" });
    }

    try {
        const booking = await Booking.findById(booking_id);
        if (!booking) {
            console.log("❌ Booking not found in database");
            return res.status(404).json({ message: `Cannot find booking with id: ${booking_id}` });
        }
        console.log("✅ Booking found:", booking._id);
        req.body.booking = booking;
        next();
    } catch (err) {
        console.log("🔥 Error in bookingExist middleware:", err.message);
        res.status(500).json({
            message: "Booking existence validation error",
            error: err.message
        });
    }
};
