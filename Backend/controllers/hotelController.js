import Hotel from "../models/Hotel.js";

export const createHotel = async (req , res) => {
    try{
        console.log(req.body)
        const hotel = await Hotel.create(req.body);

        res.status(201).json({ 
            message: "Create hotel successfully!",
            hotel
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Create hotel failed", error: error.message });
    }
}