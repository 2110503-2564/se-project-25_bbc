import Chat from '../models/Chat.js';

import { getSocketInstance } from '../config/socket.js';

export const insertChat = async (req , res) => {
    try {

        const io = getSocketInstance();
        const account_id = req.user._id;
        const hotel_id = req.body.hotel_id;

        let chat = await Chat.findOne({ account_id , hotel_id });

        if(!chat) chat = await Chat.create({ account_id , hotel_id });

        io.to(`account_${account_id.toString()}`).emit("insert_chat", chat);

        return res.status(201).json({ success: true , chat});
    } catch (error) {
        console.error('Error inserting chat:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};