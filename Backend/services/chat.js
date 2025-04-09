import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const searchChat = async ({ account_id , hotel_id , populate }) => {
    try {
        // Initialize the query object
        let query;

        if (account_id && hotel_id) query = { account_id, hotel_id };
        else if (hotel_id && !account_id) query = { hotel_id };
        else if (!hotel_id && account_id) query = { account_id };

        if (populate) {
            const populateFields = populate.split(",");
            populateFields.forEach((field) => {
                let [popField, popSelect] = field.split(":");
                if (popSelect) query = query.populate({ path: popField, select: popSelect.split(";").join(" ") });
                else query = query.populate(popField);
            });
        }

        // Perform the search
        const chats = await Chat.find(query).populate('hotel_id').populate('account_id');

        return chats;
    } catch (error) {
        console.error('Error searching chat:', error);
        throw new Error('Could not fetch chat records');
    }
};

export const findChatRoom = async({account_id , hotel_id }) => {
    try {
        
        if(!account_id || !hotel_id) throw new Error('no account_id or hotel_id');

        let chat = await Chat.findOne({ account_id , hotel_id });
        if(!chat) chat = await Chat.create({ account_id , hotel_id });
        return chat;
    } catch (error) {
        console.error('Error checking chat room:', error);
        throw new Error('Could not check chat room');
    }
};

export const handleNewMessage = async (from , chat_id , text) => {
    try {
        return await Message.create({ from , chat_id , text });
    } catch (error) {
        console.error('Error saving new message:', error);
        throw new Error('Message could not be saved');
    }
};

export const getMessageHistory = async (chat_id) => {
    try {
        return await Message.find({ chat_id }).sort({ createdAt: 1 });
    } catch (err) {
        throw new Error('Error fetching message history');
    }
}