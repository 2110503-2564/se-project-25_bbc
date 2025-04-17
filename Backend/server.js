import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Database
import connectDB from './config/mongo.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import accountRoutes from './routes/accountRoutes.js'
import uploadRoute from './routes/uploadRoutes.js';

// -------------------------- Configuration -------------------------- //
dotenv.config();
const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL, 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes 
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/account",accountRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', uploadRoute); // example: /api/upload

app.use('/static', express.static(path.join(__dirname, 'public')));

// -------------------------- Socket.io Setup -------------------------- //

import { searchChat , handleNewMessage , getMessageHistory, findChatRoom } from './services/chat.js';

io.on('connection', (socket) => {

    socket.on('search_chat', async ({ account_id , hotel_id }) => {
        try {
            const chats = await searchChat(account_id , hotel_id);
            socket.emit('my_chat', chats);
        } catch (err) {
            console.error('Error searching chat room:', err);
        }
    });

    socket.on('join_chat', async ({ account_id, hotel_id, chat_id }) => {
        const chatId = chat_id || await findChatRoom({ account_id , hotel_id });
        socket.join(chatId);
        try {
            const messageHistory = await getMessageHistory(chatId);
            socket.emit('message_history', { messageHistory });
        } catch (err) {
            console.error('Error loading message history for admin:', err);
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

// -------------------------- Start the Server -------------------------- //

const PORT = process.env.PORT || 8000;

const initializeServer = async () =>{
    try{
        console.log('🚀 Starting C-Canteen backend server...');
        
        // MongoDB Connection
        console.log('🔗 Connecting to MongoDB...');
        await connectDB(); 

        server.listen(PORT , '0.0.0.0', () => {
            console.log(`🎉 BBC Backend server is live at ${process.env.HOST}:${PORT} 🎉`);
        });
    }
    catch(err){
        console.log('❌ Failed to start the BBC backend server: ', err);
    }
}

initializeServer();