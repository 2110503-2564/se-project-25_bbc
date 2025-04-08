import Message from '../models/Message.js';

export const searchMessage = async (req, res) => {
    try {
        const { select, populate, limit, ...filters } = req.query;

        // Build the query with filters
        let query = Message.find(filters);

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

        // Handle limit if provided
        if (limit) query = query.limit(Number(limit));

        // Execute the query
        const messages = await query;

        res.status(200).json({ 
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const handleNewMessage = async ({ from, to, text }) => {
    try {
        return await Message.create({ from , to , text });
    } catch (error) {
        console.error('Error saving new message:', error);
        throw new Error('Message could not be saved');
    }
};