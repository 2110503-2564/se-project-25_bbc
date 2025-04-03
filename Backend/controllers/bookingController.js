import Booking from "../models/Booking.js";

export const searchBooking = async (req , res) => {
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
                if (popSelect) query = query.populate({ path: popField, select: popSelect.split(";").join(" ") });
                else query = query.populate(popField);
            });
        }

        // Execute the query
        const bookings = await query;

        res.status(200).json({ 
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const createBooking = async (req , res) => {
    try{

        req.body.hotel_id = req.user.hotel_id || req.body.hotel_id;

        if(req.body.room.hotel_id.toString() !== req.body.hotel_id.toString())
            return res.status(400).json({ success: false, message: "This room does not belong to the specified hotel." });
        
        const booking = await Booking.create(req.body);

        res.status(201).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const acceptedBooking = async (req, res) => {
    try {

        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to accept this booking."});

        const booking = await Booking.findByIdAndUpdate(
            req.params.booking_id,  
            { status: "accepted" },  
            { new: true, runValidators: true }  
        );

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const rejectedBooking = async (req, res) => {
    try {

        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to accept this booking."});
        
        const booking = await Booking.findByIdAndUpdate(
            req.params.booking_id,  
            { status: "rejected" },  
            { new: true, runValidators: true }  
        );

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};