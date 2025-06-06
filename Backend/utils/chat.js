import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Booking from '../models/Booking.js';
import { getSocketInstance } from '../config/socket.js';

export const initializeChatSocket = () => {
    const io = getSocketInstance();
    if (!io) {
        console.error('Socket instance not found');
        return;
    }

    io.on('connection', (socket) => {

        socket.on("join_account_all" , () => {
            socket.join("account_all");
        });

        socket.on("join_account_booking", async (account_id) => {
            try {
                const hotelIds = await Booking.distinct("hotel_id", {
                    account_id: account_id,
                    status: "finished"
                });
        
                if (!hotelIds.length) return;
        
                hotelIds.forEach(hotelId => socket.join(`account_hotel_${hotelId}`));
        
            } catch (err) {
                console.error("Error while joining booking hotel rooms:", err);
            }
        });

        socket.on("join_account_id", (account_id) => {
            socket.join(`account_${account_id}`);
        });

        socket.on("join_hcotel_room", (hotel_id) => {
            socket.join(`hotel_${hotel_id}`);
        });

        socket.on('search_chat', async ({ account_id, hotel_id, role }) => {
            try {
                const chats = await searchChat({ account_id, hotel_id, role });

                const hasFinishedBooking = await Booking.exists({
                    account_id,
                    status: "finished"
                });
        
                let notifications;
                if (account_id && hasFinishedBooking) {
                    notifications = await Notification.find({
                        $or: [
                          { type: { $ne: "booking" } }, 
                          { type: { $ne: "emergency" } }, 
                          {
                            type: "booking", 
                            account_id
                          },
                        ],
                      }).populate("hotel_id");
                } else if(account_id){
                    notifications = await Notification.find({
                        $or: [
                          { type: { $ne: "booking" } }, 
                          {
                            type: "booking", 
                            account_id
                          },
                        ],
                    }).populate("hotel_id");
                }
        
                socket.emit('my_chat', { chats, notifications });
            } catch (err) {
                console.error('Error searching chat room:', err);
            }
        });

        socket.on('join_chat', async ({ account_id, hotel_id, chat_id }) => {
            const chatId = chat_id || (await findChatRoom({ account_id, hotel_id }));
            socket.join(chatId);
            try {
                const messageHistory = await getMessageHistory(chatId);
                socket.emit('message_history', { messageHistory });
            } catch (err) {
                console.error('Error loading message history:', err);
            }
        });

        socket.on('send_message', async ({ from, chat_id, text }) => {
            try {
                const message = await handleNewMessage(from, chat_id, text);
                io.to(chat_id).emit('receive_message', message);
            } catch (err) {
                console.error('send_message error:', err);
                socket.emit('message_error', 'Something went wrong');
            }
        });
    });
};

// Helper Function

export const searchChat = async ({ account_id , hotel_id , role }) => {
    try {
        // Initialize the query object
        let query;

        if (role === "hotel_admin") query = { hotel_id };
        else if (role === "user") query = { account_id };

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