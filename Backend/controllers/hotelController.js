import Hotel from "../models/Hotel.js";

export const searchHotel = async (req, res) => {
    try {
        const { select, populate, ...filters } = req.query;

        // Build the query with filters
        let query = Hotel.find(filters);

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
        const hotels = await query;

        res.status(200).json({ 
            success: true,
            hotels
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createHotel = async (req , res) => {
    try{
        const hotel = await Hotel.create(req.body);
        res.status(201).json({ success: true, hotel });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}