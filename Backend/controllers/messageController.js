import Message from '../models/Message.js';

export const searchChatRoom = async ( req , res ) => {
    try{
    
    } catch (error) {
        console.error('Error searching message:', error);
        res.status(500).json({ success: false, error: error.message })
    }
}


export const handleNewMessage = async ({ from, to, text, room }) => {
    try {
        return await Message.create({ from , to , text , room });
    } catch (error) {
        console.error('Error saving new message:', error);
        throw new Error('Message could not be saved');
    }
};

export const getMessageHistory = async (room) => {
    try {
        return await Message.find({ room }).sort({ createdAt: 1 });
    } catch (err) {
        throw new Error('Error fetching message history');
    }
}

export const getRoomId = (account_id , hotel_id) => {
    return [account_id, hotel_id].sort().join("_");
}