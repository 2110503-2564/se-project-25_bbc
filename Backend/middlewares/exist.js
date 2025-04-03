import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const hotelExist = async(req, res, next) => {

    const hotel_id = req.params.hotel_id || req.body.hotel_id;

    try {
        const hotel = await Hotel.findById(hotel_id);
        if (!hotel) return res.status(404).json({ message: `Cannot find hotel with id: ${hotel_id}` });
        req.body.hotel = hotel;
        next();
    } catch (err) {
        res.status(500).json({message : "Existence validation error" , error : err.message});
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
        res.status(500).json({message : "Existence validation error" , error : err.message});
    }
}

export const bookingExist = async(req, res, next) => {

    const booking_id = req.params.booking_id || req.body.booking_id;

    try {
        const booking = await Booking.findById(booking_id);
        if (!booking) return res.status(404).json({ message: `Cannot find booking with id: ${hotel_id}` });
        req.body.booking = booking;
        next();
    } catch (err) {
        res.status(500).json({message : "Existence validation error" , error : err.message});
    }
}