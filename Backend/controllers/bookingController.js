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

        req.body.account_id = 
        req.user.role === "user" 
        ? req.user.id
        : req.body.account_id

        req.body.hotel_id =
        req.user.role === "hotel_admin" 
        ? req.user.hotel_id 
        : req.body.hotel_id; 

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

        const hotel_id = 
        req.user.role === "hotel_admin" 
        ? req.user.hotel_id 
        : req.body.hotel_id

        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to accept this booking."});

        const booking = await Booking.findOneAndUpdate(
            { _id : req.body.id , hotel_id },  
            { status: "accepted" },  
            { new: true, runValidators: true }  
        );

        if(!booking) return res.status(404).json({ success: false, message: "Booking not found." }); 

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const rejectedBooking = async (req, res) => {
    try {
        const hotel_id = 
        req.user.role === "hotel_admin" 
        ? req.user.hotel_id 
        : req.body.hotel_id

        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to reject this booking."});
        
        const booking = await Booking.findOneAndUpdate(
            { _id : req.body.id , hotel_id },  
            { status: "rejected" },  
            { new: true, runValidators: true }  
        );

        if(!booking) return res.status(404).json({ success: false, message: "Booking not found." }); 

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const confirmedBooking = async (req, res) => {
    try {
        const account_id = 
        req.user.role === "user" 
        ? req.user.id
        : req.body.account_id

        const hotel_id =
        req.user.role === "hotel_admin" 
        ? req.user.hotel_id 
        : req.body.hotel_id; 
        
        const booking = await Booking.findOneAndUpdate(
            { _id : req.body.id , account_id , hotel_id },  
            { status: "confirm" },  
            { new: true, runValidators: true }  
        );

        if(!booking) return res.status(404).json({ success: false, message: "Booking not found." }); 

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const checkInBooking = async (req, res) => {
    try {

        const hotel_id = req.user.hotel_id || req.body.hotel_id;

        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to check-in this booking."});

        const booking = await Booking.findOneAndUpdate(
            { _id : req.body.id , hotel_id },  
            { status: "checked-in" },  
            { new: true, runValidators: true }  
        );

        if(!booking) return res.status(404).json({ success: false, message: "Booking not found." }); 

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const checkOutBooking = async (req, res) => {
    try {

        const hotel_id = req.user.hotel_id || req.body.hotel_id;

        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to check-out this booking."});

        const booking = await Booking.findOneAndUpdate(
            { _id : req.body.id , hotel_id },  
            { status: "checked-out" },  
            { new: true, runValidators: true }  
        );

        if(!booking) return res.status(404).json({ success: false, message: "Booking not found." }); 

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteBooking = async (req , res) => {
    try {

        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.booking.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to check-out this booking."});

        const booking = await Booking.findOneAndDelete(
            { _id : req.body.id , hotel_id },  
        );

        if(!booking) return res.status(404).json({ success: false, message: "Booking not found." }); 

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}