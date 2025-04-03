import Room from "../models/Room.js";

export const searchRoom = async (req, res) => {
    try {
        const { select, populate, ...filters } = req.query;

        // Build the query with filters
        let query = Room.find(filters);

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
        const rooms = await query;

        res.status(200).json({ 
            success: true,
            rooms
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createRoom = async (req , res) => {
    try{
        req.body.hotel_id = req.body.hotel_id || req.user.hotel_id;
        const room = await Room.create(req.body);
        res.status(201).json({ success: true, room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const updateRoom = async (req , res) => {
    try{
        if(req.user.role === "hotel_admin" && req.user.hotel_id.toString() !== req.body.room.hotel_id.toString())
            return res.status(403).json({ success: false , message: "You do not have permission to modify this room."});
        
        const room = await Room.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true , runValidators: true }
        )

        res.status(200).json({ success: true, room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}