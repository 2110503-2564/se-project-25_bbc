import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Import Database
import connectDB from './config/mongo.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import accountRoutes from './routes/accountRoutes.js'

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


// -------------------------- Socket.io Setup -------------------------- //

import { handleNewMessage } from './controllers/messageController.js';
import { getRoomId } from './services/web-socket.js';

const superAdminSockets = {};
const hotelSockets = {};
const userSockets = {};

io.on('connection', (socket) => {

    socket.on('admin_join_user', ({ adminId, userId }) => {
        const roomId = getRoomId(adminId, userId);
        socket.join(roomId);
        console.log(`Admin joined room`);
    });

    socket.on('user_join_admin', ({ userId, adminId }) => {
        const roomId = getRoomId(userId , adminId);
        socket.join(roomId);
        console.log(`User joined room`);
    });

    socket.on('send_message', async ({ from, to, text }) => {
        try {
            const roomId = getRoomId(from, to);
            const message = await handleNewMessage({ from, to, text });
    
            io.to(roomId).emit('new_message', {
                from,
                to,
                text,
                createdAt: message.createdAt,
            });
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